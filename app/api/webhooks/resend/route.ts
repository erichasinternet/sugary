import { type NextRequest, NextResponse } from 'next/server';

// Webhook endpoint for Resend email events (delivery, bounce, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify webhook signature if needed (add Resend webhook secret verification)
    // const signature = req.headers.get("resend-signature");

    // Handle different event types
    switch (body.type) {
      case 'email.delivered':
        // Log successful delivery
        console.log('Email delivered:', body.data);
        break;

      case 'email.bounced':
        // Handle bounced emails - could mark subscriber as invalid
        console.log('Email bounced:', body.data);
        break;

      case 'email.complained':
        // Handle spam complaints - should unsubscribe user
        console.log('Email complained:', body.data);
        break;

      case 'email.opened':
        // Track email opens for analytics
        console.log('Email opened:', body.data);
        break;

      case 'email.clicked':
        // Track link clicks for analytics
        console.log('Email clicked:', body.data);
        break;

      default:
        console.log('Unknown webhook event:', body.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
