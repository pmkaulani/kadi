'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface DestructiveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  consequence: string;
  isReversible?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  requireKeyword?: string; // Optional confirmation string like 'DELETE' or event title
  isProcessing?: boolean;
}

export function DestructiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  consequence,
  isReversible = false,
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  requireKeyword,
  isProcessing = false,
}: DestructiveConfirmationModalProps) {
  const [typedKeyword, setTypedKeyword] = useState('');

  const isConfirmed = !requireKeyword || typedKeyword.trim() === requireKeyword.trim();

  const handleConfirm = async () => {
    if (!isConfirmed) return;
    await onConfirm();
    setTypedKeyword('');
  };

  const handleClose = () => {
    setTypedKeyword('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={isReversible ? 'Reversible Action' : 'Irreversible Action'}
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-600/30 text-[#272620] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
            <span>{isReversible ? 'Caution Advised' : 'Permanent Impact Notice'}</span>
          </div>
          <p className="text-xs text-stone-800 leading-relaxed">{consequence}</p>
        </div>

        {requireKeyword && (
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-[#272620]">
              To proceed, please type <strong className="font-mono text-red-800 select-all">{requireKeyword}</strong> below:
            </label>
            <input
              type="text"
              value={typedKeyword}
              onChange={(e) => setTypedKeyword(e.target.value)}
              placeholder={requireKeyword}
              className="w-full text-xs font-mono rounded-xl border border-stone-300 p-2.5 text-[#272620] focus:outline-none focus:border-red-600"
            />
          </div>
        )}

        <div className="pt-3 border-t border-[rgba(39,38,32,0.1)] flex justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isProcessing}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="!bg-red-700 hover:!bg-red-800 !text-white"
            onClick={handleConfirm}
            disabled={!isConfirmed || isProcessing}
          >
            {isProcessing ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
