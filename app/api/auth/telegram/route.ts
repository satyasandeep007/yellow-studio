import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface TelegramUser {
   id: number;
   first_name: string;
   last_name?: string;
   username?: string;
   photo_url?: string;
}

/**
 * Verify Telegram Mini App authentication
 * Reference: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
   try {
      const urlParams = new URLSearchParams(initData);
      const hash = urlParams.get('hash');
      urlParams.delete('hash');

      if (!hash) return false;

      // Create data-check-string
      const dataCheckArray: string[] = [];
      for (const [key, value] of urlParams.entries()) {
         dataCheckArray.push(`${key}=${value}`);
      }
      dataCheckArray.sort();
      const dataCheckString = dataCheckArray.join('\n');

      // Generate secret key
      const secretKey = crypto
         .createHmac('sha256', 'WebAppData')
         .update(botToken)
         .digest();

      // Generate hash
      const calculatedHash = crypto
         .createHmac('sha256', secretKey)
         .update(dataCheckString)
         .digest('hex');

      return calculatedHash === hash;
   } catch (error) {
      console.error('Telegram verification error:', error);
      return false;
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { initData } = body;

      if (!initData) {
         return NextResponse.json(
            { error: 'Missing initData' },
            { status: 400 }
         );
      }

      // Get bot token from environment
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      if (!botToken) {
         console.error('TELEGRAM_BOT_TOKEN not configured');
         // For development/hackathon, allow bypass
         if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Development mode: Skipping Telegram verification');

            // Parse user data from initData
            const urlParams = new URLSearchParams(initData);
            const userStr = urlParams.get('user');

            if (userStr) {
               const user: TelegramUser = JSON.parse(userStr);
               return NextResponse.json({
                  success: true,
                  user: {
                     telegramId: user.id,
                     firstName: user.first_name,
                     lastName: user.last_name,
                     username: user.username,
                     photoUrl: user.photo_url,
                  },
                  devMode: true,
               });
            }
         }

         return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
         );
      }

      // Verify the data authenticity
      const isValid = verifyTelegramWebAppData(initData, botToken);

      if (!isValid) {
         return NextResponse.json(
            { error: 'Invalid authentication data' },
            { status: 401 }
         );
      }

      // Parse user data
      const urlParams = new URLSearchParams(initData);
      const userStr = urlParams.get('user');

      if (!userStr) {
         return NextResponse.json(
            { error: 'User data not found' },
            { status: 400 }
         );
      }

      const user: TelegramUser = JSON.parse(userStr);

      // Here you can:
      // 1. Save user to database
      // 2. Create session
      // 3. Generate JWT token
      // For hackathon, we'll just return user data

      return NextResponse.json({
         success: true,
         user: {
            telegramId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            photoUrl: user.photo_url,
         },
      });
   } catch (error) {
      console.error('Telegram auth error:', error);
      return NextResponse.json(
         { error: 'Authentication failed' },
         { status: 500 }
      );
   }
}

// For testing/dev: GET endpoint to check if API is working
export async function GET() {
   return NextResponse.json({
      message: 'Telegram auth API is ready',
      configured: !!process.env.TELEGRAM_BOT_TOKEN,
      env: process.env.NODE_ENV,
   });
}
