'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error';
export interface VersionedDraft<T> {
  value: T;
  revision: number;
}

/**
 * Canonical editor draft hook.
 * Immediate visual state update ensures 0ms latency for live preview.
 * Network/DB persistence is debounced and serialized via a promise queue with monotonic
 * revision numbers to guarantee out-of-order responses never overwrite newer drafts.
 */
export function useInvitationDraft<T>(
  initial: T,
  persist: (value: T, revision: number) => Promise<void>,
  delayMs = 300
) {
  const initialSnapshot: VersionedDraft<T> = { value: initial, revision: 0 };
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  const latestRef = useRef<VersionedDraft<T>>(initialSnapshot);
  const persistRef = useRef(persist);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const mountedRef = useRef(true);
  const lastPersistedRevisionRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    persistRef.current = persist;
  }, [persist]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /**
   * Apply an immutable update recipe. State and ref update immediately for instant preview.
   */
  const update = useCallback((recipe: (current: T) => T) => {
    const current = latestRef.current;
    const nextValue = recipe(current.value);
    const next: VersionedDraft<T> = { value: nextValue, revision: current.revision + 1 };
    latestRef.current = next;
    setSnapshot(next);
    setSaveStatus('unsaved');
    setSaveError(null);
  }, []);

  /**
   * Direct replacement of draft value with monotonic revision increment.
   */
  const setDraftDirect = useCallback((nextValue: T) => {
    const current = latestRef.current;
    const next: VersionedDraft<T> = { value: nextValue, revision: current.revision + 1 };
    latestRef.current = next;
    setSnapshot(next);
    setSaveStatus('unsaved');
    setSaveError(null);
  }, []);

  /**
   * Trigger a retry of the currently unpersisted draft.
   */
  const retrySave = useCallback(() => {
    setSaveError(null);
    setSaveStatus('unsaved');
    setRetryCounter((n) => n + 1);
  }, []);

  /**
   * Immediately flush any pending debounce to disk/network.
   */
  const flushSave = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const target = latestRef.current;
    if (target.revision <= lastPersistedRevisionRef.current) return;

    setSaveStatus('saving');
    setSaveError(null);
    try {
      await persistRef.current(target.value, target.revision);
      if (!mountedRef.current) return;
      lastPersistedRevisionRef.current = Math.max(lastPersistedRevisionRef.current, target.revision);
      if (latestRef.current.revision === target.revision) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('unsaved');
      }
    } catch (error) {
      if (!mountedRef.current) return;
      if (latestRef.current.revision === target.revision) {
        setSaveStatus('error');
        setSaveError(error instanceof Error ? error.message : 'Could not save changes. Try again.');
      } else {
        setSaveStatus('unsaved');
      }
    }
  }, []);

  // Debounced persistence effect
  useEffect(() => {
    if (snapshot.revision === 0 || snapshot.revision <= lastPersistedRevisionRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      queueRef.current = queueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (!mountedRef.current) return;
          // Coalesce fast edits by grabbing latest ref
          const target = latestRef.current;
          if (target.revision <= lastPersistedRevisionRef.current) return;

          setSaveStatus('saving');
          setSaveError(null);
          try {
            await persistRef.current(target.value, target.revision);
            if (!mountedRef.current) return;
            lastPersistedRevisionRef.current = Math.max(
              lastPersistedRevisionRef.current,
              target.revision
            );
            if (latestRef.current.revision === target.revision) {
              setSaveStatus('saved');
            } else {
              // Newer edit in flight; debounced handler will pick it up
              setSaveStatus('unsaved');
            }
          } catch (error) {
            if (!mountedRef.current) return;
            // Suppress error if a newer edit has already been initiated by the user
            if (latestRef.current.revision === target.revision) {
              setSaveStatus('error');
              setSaveError(
                error instanceof Error ? error.message : 'Could not save changes. Try again.'
              );
            } else {
              setSaveStatus('unsaved');
            }
          }
        });
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [snapshot.revision, retryCounter, delayMs]);

  return {
    draft: snapshot.value,
    revision: snapshot.revision,
    update,
    setDraftDirect,
    saveStatus,
    saveError,
    retrySave,
    flushSave,
  };
}
