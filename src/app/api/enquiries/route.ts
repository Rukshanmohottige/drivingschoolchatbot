import { NextRequest, NextResponse } from 'next/server';
import { enquiryRepo } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email = '', category = 'general', message } = body;

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!phone || phone.trim().length < 9) {
      return NextResponse.json({ error: 'Please provide a valid phone number.' }, { status: 400 });
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please enter a message or question with at least 5 characters.' },
        { status: 400 }
      );
    }

    const enquiry = enquiryRepo.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      category,
      message: message.trim()
    });

    return NextResponse.json({
      success: true,
      enquiry,
      notice: 'Your enquiry has been received. Our team will get back to you shortly!'
    });
  } catch (error) {
    console.error('API /api/enquiries error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const enquiries = enquiryRepo.getAll();
    return NextResponse.json({ success: true, enquiries });
  } catch (error) {
    console.error('API /api/enquiries GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve enquiries.' }, { status: 500 });
  }
}
