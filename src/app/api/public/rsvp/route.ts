import { NextRequest, NextResponse } from 'next/server';
import { RSVPService } from '@/lib/services/rsvp-service';

// In-memory rate-limiter: max 10 requests per minute per IP / token
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(key: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await req.json();

    // 1. Honeypot anti-spam check (hidden field filled only by bots)
    if (body.hp_field || body.website || body.company_fax) {
      return NextResponse.json(
        { error: 'Spam submission detected.' },
        { status: 400 }
      );
    }

    // 2. Rate limit check per IP and token
    const rateLimitKey = body.guestToken ? `tok_${body.guestToken}` : `ip_${ip}`;
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    if (!body.eventId || !body.status || !body.primaryName || !body.contact) {
      return NextResponse.json(
        { error: 'Missing required RSVP fields (eventId, status, primaryName, contact).' },
        { status: 400 }
      );
    }

    const submission = RSVPService.submitRSVP({
      eventId: body.eventId,
      guestToken: body.guestToken,
      primaryName: body.primaryName,
      contact: body.contact,
      status: body.status,
      attendeeCount: Number(body.attendeeCount) || 1,
      attendeeNames: Array.isArray(body.attendeeNames) ? body.attendeeNames : undefined,
      dietaryRequirements: body.dietaryRequirements,
      songRequest: body.songRequest,
      noteToHost: body.noteToHost,
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: any) {
    const message = error.message || 'An error occurred while processing your RSVP.';
    const isForbidden =
      message.includes('required to RSVP') ||
      message.includes('different event') ||
      message.includes('Invalid invitation token');

    return NextResponse.json(
      { error: message },
      { status: isForbidden ? 403 : 400 }
    );
  }
}
