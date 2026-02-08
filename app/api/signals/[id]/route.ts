import { NextRequest, NextResponse } from 'next/server';

// Mock signal data - replace with Cosmos DB in production
const mockSignals: Record<string, any> = {
   'sig_001': {
      id: 'sig_001',
      asset: 'ETH',
      price: 3200,
      target: 3500,
      stopLoss: 3000,
      confidence: 85,
      traderId: 'trader_001',
      traderName: 'CryptoWhale',
      createdAt: new Date().toISOString(),
   },
   'sig_002': {
      id: 'sig_002',
      asset: 'BTC',
      price: 65000,
      target: 70000,
      stopLoss: 62000,
      confidence: 92,
      traderId: 'trader_001',
      traderName: 'CryptoWhale',
      createdAt: new Date().toISOString(),
   }
};

export async function GET(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const signalId = params.id;

      // TODO: Fetch from Cosmos DB
      // const signal = await getSignalFromDB(signalId);

      const signal = mockSignals[signalId];

      if (!signal) {
         return NextResponse.json(
            { error: 'Signal not found' },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         signal,
      });
   } catch (error) {
      console.error('Error fetching signal:', error);
      return NextResponse.json(
         { error: 'Failed to fetch signal' },
         { status: 500 }
      );
   }
}
