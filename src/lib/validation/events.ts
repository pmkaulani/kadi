import { z } from 'zod';
import { EventStatus } from '@/lib/db/types';
import { EVENT_CATEGORY_IDS } from '@/lib/events/categories';

export const VALID_STATUS_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  draft: ['published', 'archived'],
  published: ['archived'],
  archived: ['draft'], // Can unarchive back to draft for editing
};

export function isValidStatusTransition(current: EventStatus, next: EventStatus): boolean {
  if (current === next) return true;
  return VALID_STATUS_TRANSITIONS[current]?.includes(next) ?? false;
}

export const CreateEventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(150, 'Title cannot exceed 150 characters'),
  subtitle: z.string().max(250).optional(),
  category: z.enum(EVENT_CATEGORY_IDS),
  templateId: z.string().min(1),
  templateVersion: z.string().default('1.0.0'),
  hosts: z.string().min(1, 'Host name is required').max(200),
  celebrants: z.string().max(200).optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  timezone: z.string().default('Africa/Nairobi'),
  venue: z.string().min(1, 'Venue name is required'),
  address: z.string().optional(),
  city: z.string().default('Nairobi'),
  directionsNote: z.string().max(500).optional(),
  dressCode: z.string().max(200).optional(),
  story: z.string().max(2000).optional(),
  heroImage: z.string().url('Hero image must be a valid URL'),
  galleryImages: z.array(z.string().url()).max(12).optional(),
  rsvpDeadline: z.string().min(1, 'RSVP deadline is required'),
  maxCapacity: z.number().int().min(1).max(5000).optional(),
  allowsChildren: z.boolean().default(true),
  mpesaType: z.enum(['till', 'paybill', 'send_money']).optional(),
  mpesaNumber: z.string().max(50).optional(),
  mpesaRecipient: z.string().max(100).optional(),
  mpesaReference: z.string().max(100).optional(),
});

export const UpdateEventSchema = CreateEventSchema.partial().extend({
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export const GuestImportRowSchema = z
  .object({
    name: z.string().max(150).optional(),
    displayName: z.string().max(150).optional(),
    group: z.string().max(50).default('General'),
    phone: z.string().max(30).optional(),
    contactPhone: z.string().max(30).optional(),
    email: z.string().email('Invalid email').max(150).optional().or(z.literal('')),
    contactEmail: z.string().email('Invalid email').max(150).optional().or(z.literal('')),
    plusOnes: z.number().int().min(0, 'Plus ones cannot be negative').max(10, 'Max plus ones is 10').optional(),
    allowedPlusOnes: z.number().int().min(0, 'Plus ones cannot be negative').max(10, 'Max plus ones is 10').optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((data) => Boolean(data.name?.trim() || data.displayName?.trim()), {
    message: 'Guest name is required.',
  })
  .transform((row) => ({
    name: (row.name || row.displayName || 'Guest').trim(),
    phone: row.phone || row.contactPhone,
    email: row.email || row.contactEmail,
    group: (row.group || 'General').trim(),
    plusOnes: row.plusOnes ?? row.allowedPlusOnes ?? 1,
    notes: row.notes?.trim(),
  }));

export const GuestImportPayloadSchema = z.object({
  rows: z.array(GuestImportRowSchema).min(1, 'At least one guest row is required').max(500, 'Import limit is 500 guests per batch'),
});

export const MAX_CSV_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_CSV_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'text/plain',
  'text/comma-separated-values',
];
