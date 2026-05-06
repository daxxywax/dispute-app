import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { shopName, shopAddress, adjusterName, insurerName, claimNumber,
      vehicleYear, vehicleMake, vehicleModel, repairsPerformed, deniedItems,
      denialReason, dateOfLoss, laborHours, disputedAmount } = body;

    const systemPrompt = `You are an expert automotive insurance dispute specialist with 20 years of experience helping independent auto body shops recover fair compensation from insurance companies. You write professional, assertive, and legally sound dispute letters.

Your letters always:
- Use formal business letter format with proper headers
- Reference the shop's right to use OEM parts per manufacturer repair procedures
- Cite that insurers must pay prevailing market labor rates in the repair area
- Reference I-CAR, OEM position statements, and industry repair standards where applicable
- Professionally challenge aftermarket/LKQ part substitutions when OEM is required
- Address betterment deductions assertively when not justified
- Demand itemized written justification for any denied line items
- Close with a clear deadline for response (10 business days) and next steps
- Maintain a firm but professional tone throughout — never aggressive, always authoritative

Format the letter ready to print with date, addresses, subject line, body, and signature block.`;

    const userPrompt = `Write a dispute letter with these details:

Shop: ${shopName}
Shop Address: ${shopAddress}
Adjuster Name: ${adjusterName}
Insurance Company: ${insurerName}
Claim Number: ${claimNumber}
Date of Loss: ${dateOfLoss}
Vehicle: ${vehicleYear} ${vehicleMake} ${vehicleModel}
Total Labor Hours: ${laborHours}
Total Disputed Amount: $${disputedAmount}

Repairs Performed:
${repairsPerformed}

Denied or Underpaid Items:
${deniedItems}

Insurer's Stated Denial Reason:
${denialReason}

Write a complete, professional dispute letter ready to send with no placeholders — use the exact details provided above.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const letter = (message.content[0] as any).text;
    return NextResponse.json({ letter });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}