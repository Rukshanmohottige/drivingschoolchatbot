import { NextRequest, NextResponse } from 'next/server';
import { bookingRepo, enquiryRepo, conversationRepo, statsRepo } from '@/lib/database';

export async function GET() {
  try {
    const stats = statsRepo.getStats();
    const bookings = bookingRepo.getAll();
    const enquiries = enquiryRepo.getAll();
    const sessions = conversationRepo.listAll();

    return NextResponse.json({
      success: true,
      stats,
      bookings,
      enquiries,
      sessions
    });
  } catch (error) {
    console.error('API /api/admin error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin data.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return NextResponse.json({ error: 'Missing type, id, or status.' }, { status: 400 });
    }

    if (type === 'booking') {
      const updated = bookingRepo.updateStatus(id, status);
      if (!updated) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
      return NextResponse.json({ success: true, item: updated });
    } else if (type === 'enquiry') {
      const updated = enquiryRepo.updateStatus(id, status);
      if (!updated) return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json({ error: 'Invalid entity type.' }, { status: 400 });
  } catch (error) {
    console.error('API /api/admin PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
  }
}
