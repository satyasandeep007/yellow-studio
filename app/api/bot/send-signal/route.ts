import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const MINI_APP_URL = process.env.NEXT_PUBLIC_MINI_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
   try {
      const { chatId, signal } = await request.json();

      if (!chatId || !signal) {
         return NextResponse.json(
            { error: 'Missing chatId or signal data' },
            { status: 400 }
         );
      }

      const message = `
🚀 <b>${signal.asset || 'ETH'} Signal Alert</b>

Buy ${signal.asset || 'ETH'} at $${signal.price}
Target: 🔒 <i>Locked</i>
Stop-loss: 🔒 <i>Locked</i>
Confidence: 🔒 <i>Locked</i>

💎 Unlock premium insights below 👇
    `.trim();

      const keyboard = {
         inline_keyboard: [
            [
               {
                  text: '🔓 Unlock Full Signal – ₹1',
                  web_app: {
                     url: `${MINI_APP_URL}/mini/unlock?signal=${signal.id}&action=unlock`
                  }
               }
            ],
            [
               {
                  text: '❓ Ask Trader – ₹1',
                  web_app: {
                     url: `${MINI_APP_URL}/mini/unlock?signal=${signal.id}&action=ask`
                  }
               }
            ],
            [
               {
                  text: '🤖 AI Explain – ₹2',
                  web_app: {
                     url: `${MINI_APP_URL}/mini/unlock?signal=${signal.id}&action=ai`
                  }
               }
            ]
         ]
      };

      // Send message via Telegram Bot API
      const response = await fetch(
         `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
         {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               chat_id: chatId,
               text: message,
               parse_mode: 'HTML',
               reply_markup: keyboard,
            }),
         }
      );

      const data = await response.json();

      if (!data.ok) {
         throw new Error(data.description || 'Telegram API error');
      }

      return NextResponse.json({
         success: true,
         messageId: data.result.message_id,
         chatId: data.result.chat.id,
      });
   } catch (error) {
      console.error('Error sending signal:', error);
      return NextResponse.json(
         { error: 'Failed to send signal', details: error instanceof Error ? error.message : 'Unknown error' },
         { status: 500 }
      );
   }
}

// Test endpoint
export async function GET() {
   return NextResponse.json({
      message: 'Signal bot API is ready',
      configured: !!TELEGRAM_BOT_TOKEN,
      appUrl: MINI_APP_URL,
   });
}
