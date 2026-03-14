import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const orderId = `LMT-${Math.floor(Math.random() * 1000000)}`;

    // 1. Save to Supabase (Mocked if keys are missing)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
        const { data, error } = await supabase
          .from('orders')
          .insert([
             {
               customer_name: orderData.name,
               phone: orderData.phone,
               address: `${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
               items: orderData.items,
               total_amount: orderData.totalAmount,
               payment_method: orderData.paymentMethod,
               payment_status: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
               fulfillment_status: 'Unfulfilled'
             }
          ])
          .select();
        
        if (error) console.error("Supabase Error:", error);
    } else {
        console.log("Supabase Mock Insert:", orderData);
    }

    // 2. Integration: Shopify Admin API Create Order
    // ... Shopify Logic ...

    // 3. Integration: MSG91 WhatsApp Confirmation Message
    const authKey = process.env.MSG91_AUTH_KEY;
    if (authKey) {
      const whatsappPayload = {
        integrated_number: "YOUR_MSG91_WHATSAPP_NUMBER", // Needs configuration in MSG91
        content_type: "template",
        payload: {
          to: `91${orderData.phone}`,
          type: "template",
          template: {
            name: "order_confirmation_template", // Replace with your approved msg91 template name
            language: {
              code: "en",
              policy: "deterministic"
            },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: orderData.name },
                  { type: "text", text: orderId }
                ]
              }
            ]
          }
        }
      };

      try {
        await fetch("https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authkey': authKey
          },
          body: JSON.stringify(whatsappPayload)
        });
        console.log('MSG91 WhatsApp trigger attempted');
      } catch (waError) {
        console.error("WhatsApp MSG91 Error:", waError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      message: 'Order created successfully' 
    });

  } catch (error) {
    console.error("Order Creation Failed:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

