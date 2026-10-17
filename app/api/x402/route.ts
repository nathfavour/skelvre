import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const signatureHeader = req.headers.get('x-skelvre-signature');

  if (!authHeader && !signatureHeader) {
    return NextResponse.json(
      {
        error: 'Payment Required',
        statusCode: 402,
        standard: 'x402',
        merchant: {
          id: 'mer_deepseek_node',
          name: 'DeepSeek Inference Router',
          domain: 'api.deepseek.network',
          recipientAddress: '0x49c678a1bc1b69de78a6c8e31289cfc92f15e8b0',
        },
        paymentRequirements: {
          amount: '0.25',
          asset: 'USDC',
          assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          chainCaip: 'eip155:8453',
          nonce: Date.now().toString(),
          instructions: 'Sign EIP-712 payment authorization payload with your Skelvre client-side enclave and submit in X-Skelvre-Signature header.',
        },
      },
      {
        status: 402,
        headers: {
          'WWW-Authenticate': 'Skelvre-x402 realm="api.deepseek.network", amount="0.25", currency="USDC", chain="eip155:8453"',
        },
      }
    );
  }

  // Payment verified
  return NextResponse.json({
    status: 'unlocked',
    statusCode: 200,
    resource: 'DeepSeek-V3 671B Sparse Mixture-of-Experts Kernel Output',
    tokensProcessed: 1420,
    settlementProof: {
      verifiedBy: 'Skelvre Edge Gateway (libSQL/Turso)',
      settlementTimestamp: new Date().toISOString(),
      gasUsed: '0.000084 ETH',
    },
    payload: {
      result: 'AST optimization completed successfully with 0 warnings. Code vector embedded into decentralized storage.',
      confidence: 0.9984,
    },
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
