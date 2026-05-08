import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { shopName, shopAddress, adjusterName, insurerName, claimNumber,
      vehicleYear, vehicleMake, vehicleModel, repairsPerformed, deniedItems,
      denialReason, dateOfLoss, laborHours, disputedAmount } = body;

    const systemPrompt = `You are an expert automotive insurance dispute specialist helping independent auto body shops recover fair compensation. You write concise, direct, and effective dispute letters that adjusters actually respond to.

Your letters:
- Get straight to the point — no lengthy preambles or excessive citations
- Lead with the specific dollar amount being disputed
- Reference specific OEM procedures only when directly relevant to the denial
- Use clear, numbered arguments — one paragraph per disputed item
- Include specific part numbers, labor times, and dollar figures provided
- Demand a specific written response within 10 business days
- Are 1 page maximum — adjusters ignore long letters
- Close with clear next steps if the dispute is not resolved (state insurance commissioner complaint, appraisal clause)
- Are written for Canadian shops by default unless otherwise specified

Do NOT:
- Use excessive legal jargon
- Write more than 4-5 paragraphs
- Include generic boilerplate about I-CAR or OEM position statements unless specifically relevant
- Use placeholder brackets — only include information that was actually provided

Format: business letter with date, addresses, subject line, body, signature block.`;

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

Write a complete, professional dispute letter ready to send with no placeholders — use only the exact details provided above.`;

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