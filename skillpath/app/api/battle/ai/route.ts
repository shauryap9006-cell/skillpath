import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { optionA, optionB, winner, totalVotes, trend, premium } = await req.json();

    const prompt = `
      You are a senior tech architect and career strategist. 
      Battle: ${optionA.name} vs ${optionB.name}
      Winner: ${winner === 'A' ? optionA.name : (winner === 'B' ? optionB.name : 'Tie')}
      Data Context:
      - Total market "votes": ${totalVotes}
      - Growth Trend: ${trend}%
      - Salary Premium: $${premium}
      
      Generate a one-sentence "Architect's Verdict" that explains LOGICALLY why the winner is the superior choice for a career path right now. 
      Focus on technical merit, market stability, or financial ROI based on the provided data.
      Keep it professional, persuasive, and under 25 words. Do not use hashtags.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant', // Low power, high speed
      temperature: 0.8,
      max_tokens: 60,
    });

    const aiVerdict = completion.choices[0]?.message?.content?.trim() || "The data has spoken, but the AI is speechless.";

    return NextResponse.json({ aiVerdict });
  } catch (error) {
    console.error('AI Battle Error:', error);
    return NextResponse.json({ aiVerdict: "Error consulting the AI oracle. Stick to the hard data." }, { status: 500 });
  }
}
