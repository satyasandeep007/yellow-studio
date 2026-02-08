import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

/**
 * Get your Telegram Chat ID
 * 
 * Steps:
 * 1. Start your bot in Telegram
 * 2. Send any message to your bot
 * 3. Visit this endpoint: http://localhost:3000/api/bot/get-chat-id
 * 4. Copy your chat ID from the response
 */
export async function GET() {
   try {
      if (!TELEGRAM_BOT_TOKEN) {
         return NextResponse.json(
            { error: 'TELEGRAM_BOT_TOKEN not configured' },
            { status: 500 }
         );
      }

      // Get recent updates from Telegram
      const response = await fetch(
         `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=10`,
         { method: 'GET' }
      );

      const data = await response.json();

      if (!data.ok) {
         throw new Error(data.description || 'Telegram API error');
      }

      // Extract unique chat IDs and user info
      const chats = new Map<number, any>();

      if (data.result && data.result.length > 0) {
         data.result.forEach((update: any) => {
            if (update.message?.chat) {
               const chat = update.message.chat;
               const from = update.message.from;

               chats.set(chat.id, {
                  chatId: chat.id,
                  type: chat.type,
                  firstName: from.first_name,
                  lastName: from.last_name,
                  username: from.username,
                  lastMessage: update.message.text,
                  date: new Date(update.message.date * 1000).toISOString(),
               });
            }
         });
      }

      const chatList = Array.from(chats.values());

      if (chatList.length === 0) {
         return NextResponse.json({
            success: false,
            message: 'No messages found. Please send a message to your bot first.',
            instructions: [
               '1. Open Telegram and search for your bot',
               '2. Start the bot by clicking "Start" or sending /start',
               '3. Send any message to the bot (e.g., "hello")',
               '4. Refresh this page',
            ],
         });
      }

      return NextResponse.json({
         success: true,
         message: 'Found your chat information!',
         chats: chatList,
         instructions: {
            howToUse: 'Copy your chatId and use it when posting signals',
            example: `Use chatId: ${chatList[0].chatId}`,
         },
      });
   } catch (error) {
      console.error('Error getting chat ID:', error);
      return NextResponse.json(
         {
            error: 'Failed to get chat ID',
            details: error instanceof Error ? error.message : 'Unknown error'
         },
         { status: 500 }
      );
   }
}
