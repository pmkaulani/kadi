import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export default function WorkspaceNotFound() {
  return (
    <div className="p-6 sm:p-16 max-w-xl mx-auto my-auto text-center">
      <p className="kadi-eyebrow text-[#934638] mb-3">Resource Missing</p>
      <h1 className="font-serif text-3xl sm:text-4xl text-[#272620] mb-3">
        Event or record not found.
      </h1>
      <p className="text-xs sm:text-sm text-[#756F64] leading-relaxed mb-8 max-w-md mx-auto">
        The event, guest household or settings record you are attempting to view either does not exist or belongs to another workspace.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/app/events" className="kadi-button w-full sm:w-auto">
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </Link>
        <Link href="/app/events/new" className="kadi-button kadi-button--quiet w-full sm:w-auto">
          <Plus size={14} />
          <span>Create New Event</span>
        </Link>
      </div>
    </div>
  );
}
