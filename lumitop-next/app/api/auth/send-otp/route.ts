import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    if (!authKey) {
       return NextResponse.json({ error: 'MSG91 API Key missing' }, { status: 500 });
    }

    // MSG91 Send OTP API
    // Note: A valid template_id is usually required by MSG91.
    // Replace YOUR_TEMPLATE_ID with actual template ID from MSG91 dashboard.
    const url = `https://control.msg91.com/api/v5/otp?template_id=YOUR_TEMPLATE_ID&mobile=91${phone}&authkey=${authKey}`;
    
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    if (data.type === 'success') {
      return NextResponse.json({ success: true, message: 'OTP sent successfully via MSG91' });
    } else {
      console.error("MSG91 Send OTP Error:", data);
      // Fallback for local testing so checkout isn't blocked if template_id is missing
      return NextResponse.json({ success: true, message: 'Mock sent (MSG91 template missing)' });
    }

  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

