'use client';

import React, { useState, useMemo } from 'react';
import { GuestService, CSVImportRow, normalizeKenyanPhoneNumber, isValidPhoneNumber, isValidEmail } from '@/lib/services/guest-service';
import { GuestHouseholdEntity } from '@/lib/db/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  Info,
} from 'lucide-react';

interface EventCsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  existingGuests: GuestHouseholdEntity[];
  onImportSuccess: () => void;
}

export function EventCsvImportModal({
  isOpen,
  onClose,
  eventId,
  existingGuests,
  onImportSuccess,
}: EventCsvImportModalProps) {
  const [csvText, setCsvText] = useState(
    'Name,Phone,Email,Group,PlusOnes\nDr. Peter Otieno,+254712345678,peter@example.com,Family,2\nGrace Mwangi,+254722987654,grace@example.com,Friends,1\nHon. Kiprono,+254733112233,,VIP,1'
  );
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  // Parse and validate rows in real-time
  const parsedRows = useMemo(() => {
    return GuestService.parseCsvText(csvText);
  }, [csvText]);

  // Validation & Duplicate analysis
  const analysis = useMemo(() => {
    const existingPhones = new Set(existingGuests.map((g) => g.contactPhone).filter(Boolean));
    const existingEmails = new Set(existingGuests.map((g) => g.contactEmail?.toLowerCase()).filter(Boolean));

    let validCount = 0;
    let duplicateCount = 0;
    const errors: Array<{ row: number; reason: string }> = [];
    const warnings: Array<{ row: number; reason: string }> = [];

    parsedRows.forEach((row, idx) => {
      const rowNum = idx + 1;
      const name = row.name ? row.name.trim() : '';

      if (!name) {
        errors.push({ row: rowNum, reason: 'Missing guest or household name' });
        return;
      }

      let phone: string | undefined = undefined;
      if (row.phone && row.phone.trim()) {
        phone = normalizeKenyanPhoneNumber(row.phone.trim());
        if (!isValidPhoneNumber(phone)) {
          warnings.push({ row: rowNum, reason: `Phone "${row.phone}" does not match standard format` });
        }
      }

      let email: string | undefined = undefined;
      if (row.email && row.email.trim()) {
        email = row.email.trim().toLowerCase();
        if (!isValidEmail(email)) {
          errors.push({ row: rowNum, reason: `Invalid email address "${row.email}"` });
          return;
        }
      }

      const isDupPhone = phone && existingPhones.has(phone);
      const isDupEmail = email && existingEmails.has(email);

      if (isDupPhone || isDupEmail) {
        duplicateCount++;
        warnings.push({
          row: rowNum,
          reason: `Duplicate contact: ${phone || email} already exists in event guest list`,
        });
        if (skipDuplicates) return;
      }

      validCount++;
    });

    return {
      validCount,
      duplicateCount,
      errors,
      warnings,
    };
  }, [parsedRows, existingGuests, skipDuplicates]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);

    try {
      const res = await fetch(`/api/events/${eventId}/guests/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      if (!res.ok) {
        // Fallback for local service
        GuestService.importGuests(eventId, parsedRows, { skipDuplicates });
      }
      onImportSuccess();
      onClose();
    } catch {
      GuestService.importGuests(eventId, parsedRows, { skipDuplicates });
      onImportSuccess();
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Guest List (CSV / Spreadsheets)">
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        {/* Anti-spam disclosure banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-600/20 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Privacy & Delivery Guarantee:</strong>
            Importing contacts only prepares household draft records. Kadi will{' '}
            <span className="font-bold underline">never send invitations automatically</span> as a side effect
            of CSV imports.
          </div>
        </div>

        {/* File upload button */}
        <div className="flex items-center gap-3">
          <label className="kadi-button kadi-button--quiet cursor-pointer text-xs !py-1.5 !px-3">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload .CSV File</span>
            <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <span className="text-xs text-stone-400">or edit raw CSV text below:</span>
        </div>

        {/* Raw CSV Textarea */}
        <div>
          <label className="text-xs font-semibold text-[#272620] block mb-1">
            CSV Content (Header: Name, Phone, Email, Group, PlusOnes)
          </label>
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-stone-50 font-mono text-[11px] p-2.5 text-[#272620] focus:outline-none focus:border-[#934638]"
          />
        </div>

        {/* Live Validation & Analysis Bar */}
        <div className="p-3 rounded-lg bg-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-medium text-[#272620]">
              Total Parsed: <strong>{parsedRows.length}</strong>
            </span>
            <span className="text-emerald-700 font-medium">
              Ready to Import: <strong>{analysis.validCount}</strong>
            </span>
            {analysis.duplicateCount > 0 && (
              <span className="text-amber-700 font-medium">
                Duplicates: <strong>{analysis.duplicateCount}</strong>
              </span>
            )}
            {analysis.errors.length > 0 && (
              <span className="text-rose-700 font-medium">
                Errors: <strong>{analysis.errors.length}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="checkbox"
              id="skipDuplicatesCheckbox"
              checked={skipDuplicates}
              onChange={(e) => setSkipDuplicates(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
            />
            <label htmlFor="skipDuplicatesCheckbox" className="text-[11px] font-medium text-stone-700">
              Skip duplicate contacts
            </label>
          </div>
        </div>

        {/* Row-Level Errors List */}
        {analysis.errors.length > 0 && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
            <span className="font-bold block">Validation Errors:</span>
            {analysis.errors.slice(0, 5).map((err, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                <span>
                  Row {err.row}: {err.reason}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Row-Level Warnings List */}
        {analysis.warnings.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
            <span className="font-bold block">Warnings:</span>
            {analysis.warnings.slice(0, 4).map((warn, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>
                  Row {warn.row}: {warn.reason}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Live Preview Table */}
        {parsedRows.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-[#272620] block mb-1">
              Parsed Row Preview (First 5 Rows)
            </span>
            <div className="border border-[rgba(39,38,32,.15)] rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-stone-50 border-b border-[rgba(39,38,32,.1)] text-[10px] uppercase font-bold text-stone-500">
                  <tr>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Group</th>
                    <th className="py-2 px-3">Plus-Ones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(39,38,32,.06)]">
                  {parsedRows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="hover:bg-stone-50/50">
                      <td className="py-2 px-3 font-medium text-[#272620]">{r.name}</td>
                      <td className="py-2 px-3 font-mono text-stone-500">{r.phone || '—'}</td>
                      <td className="py-2 px-3 font-mono text-stone-500">{r.email || '—'}</td>
                      <td className="py-2 px-3 text-stone-600">{r.group || 'Guests'}</td>
                      <td className="py-2 px-3 text-stone-600">{r.plusOnes ?? 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(39,38,32,.1)]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCommitImport}
            disabled={isImporting || analysis.validCount === 0}
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
          >
            {isImporting ? 'Importing...' : `Confirm & Import ${analysis.validCount} Guests`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
