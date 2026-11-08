import { NextRequest, NextResponse } from 'next/server';
import { bookingRepo } from '@/lib/database';
import { DRIVING_SCHOOL_DATA } from '@/data/driving-school';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email = '',
      nicNumber = '',
      courseId,
      transmission = 'Auto',
      branch,
      preferredDate,
      preferredTimeSlot = 'Morning (8:00 AM - 11:00 AM)',
      hasLearnerPermit = false,
      notes = ''
    } = body;

    // Validation
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter a valid full name.' }, { status: 400 });
    }

    if (!phone || phone.trim().length < 9) {
      return NextResponse.json(
        { error: 'Please enter a valid Sri Lankan phone or mobile number (e.g., 077 123 4567).' },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json({ error: 'Please select a driving course.' }, { status: 400 });
    }

    if (!branch) {
      return NextResponse.json({ error: 'Please select a preferred branch.' }, { status: 400 });
    }

    if (!preferredDate) {
      return NextResponse.json({ error: 'Please select a preferred starting date.' }, { status: 400 });
    }

    const course = DRIVING_SCHOOL_DATA.courses.find(c => c.id === courseId);
    const courseName = course ? course.name : 'Standard Driving Course';

    const newBooking = bookingRepo.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      nicNumber: nicNumber.trim(),
      courseId,
      courseName,
      transmission: transmission === 'Manual' ? 'Manual' : 'Auto',
      branch,
      preferredDate,
      preferredTimeSlot,
      hasLearnerPermit: Boolean(hasLearnerPermit),
      notes: notes.trim()
    });

    return NextResponse.json({
      success: true,
      booking: newBooking,
      notice:
        'Your lesson booking request has been submitted successfully! Please note: This is a booking request and is pending instructor & dual-control vehicle verification. Our student coordinator will contact you via phone/WhatsApp within 2 hours to confirm your schedule.'
    });
  } catch (error) {
    console.error('API /api/booking error:', error);
    return NextResponse.json({ error: 'Failed to submit booking request.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = bookingRepo.getAll();
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('API /api/booking GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve bookings.' }, { status: 500 });
  }
}
