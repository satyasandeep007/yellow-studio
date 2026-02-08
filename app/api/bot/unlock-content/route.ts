import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export async function POST(request: NextRequest) {
   try {
      const { signalId, userId, action, content, username } = await request.json();

      let message = '';
      const userMention = username ? `@${username}` : `User ${userId}`;

      if (action === 'unlock') {
         message = `
✅ <b>Full Signal Unlocked</b> by ${userMention}

🎯 Target: <b>$${content.target}</b>
🛑 Stop-loss: <b>$${content.stopLoss}</b>
📊 Confidence: <b>${content.confidence}%</b>

Thank you for your support! 🙏
      `.trim();
      } else if (action === 'ask') {
         message = `
❓ ${userMention} wants to ask about Signal #${signalId}

<i>Trader will respond shortly...</i>
      `.trim();
      } else if (action === 'ai') {
         message = `
🤖 <b>AI Analysis</b> for ${userMention}

${content.aiAnalysis || 'Based on technical indicators, this signal shows strong momentum with good risk/reward ratio. However, always do your own research.'}

<i>Powered by AI • Not financial advice</i>
      `.trim();
      }

      // Send as a reply in the group
      const telegramResponse = await fetch(
         `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
         {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               chat_id: content.chatId,
               text: message,
               parse_mode: 'HTML',
               reply_to_message_id: content.originalMessageId,
            }),
         }
      );

      const data = await telegramResponse.json();

      if (!data.ok) {
         throw new Error(data.description || 'Telegram API error');
      }

      return NextResponse.json({
         success: true,
         messageId: data.result.message_id,
      });
   } catch (error) {
      console.error('Error unlocking content:', error);
      return NextResponse.json(
         { error: 'Failed to unlock content', details: error instanceof Error ? error.message : 'Unknown error' },
         { status: 500 }
      );
   }
}
