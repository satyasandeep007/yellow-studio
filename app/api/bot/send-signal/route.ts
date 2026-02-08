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

      // Validate chat ID format
      if (typeof chatId === 'string' && chatId.startsWith('@')) {
         return NextResponse.json(
            {
               error: 'Invalid chat ID format',
               message: 'Please use your numeric chat ID (e.g., 123456789), not @username',
               help: 'Visit /api/bot/get-chat-id to find your chat ID'
            },
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

      // Check if we're using HTTPS (production) or HTTP (local testing)
      const isProduction = MINI_APP_URL.startsWith('https://');

      const keyboard = isProduction ? {
         // Production: Use web_app buttons (requires HTTPS)
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
      } : {
         // Local testing: Use callback buttons with URLs in message
         inline_keyboard: [
            [
               {
                  text: '🔓 Unlock Full Signal – ₹1',
                  callback_data: `unlock_${signal.id}`
               }
            ],
            [
               {
                  text: '❓ Ask Trader – ₹1',
                  callback_data: `ask_${signal.id}`
               }
            ],
            [
               {
                  text: '🤖 AI Explain – ₹2',
                  callback_data: `ai_${signal.id}`
               }
            ],
            [
               {
                  text: '🔗 Open Mini App (Local)',
                  url: `${MINI_APP_URL}/mini/unlock?signal=${signal.id}&action=unlock`
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
         let errorMessage = data.description || 'Telegram API error';
         let helpMessage = '';

         if (data.description?.includes('chat not found')) {
            errorMessage = 'Chat not found. Please make sure you have started the bot.';
            helpMessage = 'Steps: 1) Open your bot in Telegram, 2) Click START or send /start, 3) Send any message, 4) Visit /api/bot/get-chat-id to get your chat ID';
         }

         return NextResponse.json(
            {
               error: errorMessage,
               help: helpMessage,
               telegramError: data.description
            },
            { status: 400 }
         );
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
