'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AnnounceOptions {
  politeness?: 'polite' | 'assertive';
  timeoutMs?: number;
}

interface AnnouncerContextType {
  announce: (message: string, options?: AnnounceOptions) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType>({
  announce: () => {},
});

export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, options: AnnounceOptions = {}) => {
    const { politeness = 'polite', timeoutMs = 4000 } = options;
    if (politeness === 'assertive') {
      setAssertiveMessage(message);
      setTimeout(() => setAssertiveMessage(''), timeoutMs);
    } else {
      setPoliteMessage(message);
      setTimeout(() => setPoliteMessage(''), timeoutMs);
    }
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Visually hidden screen reader live regions */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        {politeMessage}
      </div>

      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useAnnouncer() {
  return useContext(AnnouncerContext);
}
