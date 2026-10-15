'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error';
export interface VersionedDraft<T> { value: T; revision: number; }

/**
 * Canonical editor draft pattern. State updates immediately; only persistence is debounced.
 * `initial` must stay stable for a draft id. Key/remount the editor by draft id when switching.
 * Reconcile this sample with the app's existing API and event/design model before integration.
 */
export function useInvitationDraft<T>(
  initial: T,
  persist: (value: T, revision: number) => Promise<void>,
  delayMs = 250,
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

  useEffect(() => { persistRef.current = persist; }, [persist]);
  useEffect(() => () => {
    mountedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const update = useCallback((recipe: (current: T) => T) => {
    // Compute from the ref to avoid side effects inside a React setState updater.
    const current = latestRef.current;
    const next = { value: recipe(current.value), revision: current.revision + 1 };
    latestRef.current = next;
    setSnapshot(next);
    setSaveStatus('unsaved');
    setSaveError(null);
  }, []);

  const retrySave = useCallback(() => {
    setSaveError(null);
    setSaveStatus('unsaved');
    setRetryCounter((n) => n + 1);
  }, []);

  useEffect(() => {
    if (snapshot.revision === 0 || snapshot.revision <= lastPersistedRevisionRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      queueRef.current = queueRef.current.catch(() => undefined).then(async () => {
        if (!mountedRef.current) return;
        // Select the newest draft when the queued task actually begins. This coalesces fast edits.
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
            // A newer edit happened while this save was in flight; its own debounce persists it next.
            setSaveStatus('unsaved');
          }
        } catch (error) {
          if (!mountedRef.current) return;
          // Don't display an old request's error if the user has since made a newer edit.
          if (latestRef.current.revision === target.revision) {
            setSaveStatus('error');
            setSaveError(error instanceof Error ? error.message : 'Could not save changes. Try again.');
          } else {
            setSaveStatus('unsaved');
          }
        }
      });
    }, delayMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [snapshot.revision, retryCounter, delayMs]);

  return { draft: snapshot.value, revision: snapshot.revision, update, saveStatus, saveError, retrySave };
}
