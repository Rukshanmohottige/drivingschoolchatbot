import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai';
import { conversationRepo } from '@/lib/database';
import { Language, Message } from '@/types/chat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId = 'default-session', language = 'en' } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const cleanMessage = message.trim();
    const session = conversationRepo.getSession(sessionId);

    // Record user message
    const userMsg: Message = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'user',
      content: cleanMessage,
      timestamp: new Date().toISOString()
    };
    conversationRepo.addMessage(sessionId, userMsg);

    // Generate AI response with RAG groundedness
    const aiResult = await generateChatResponse(
      cleanMessage,
      language as Language,
      session.messages
    );

    // Record assistant message
    const botMsg: Message = {
      id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'assistant',
      content: aiResult.content,
      timestamp: new Date().toISOString(),
      citations: aiResult.citations,
      suggestedQuestions: aiResult.suggestedQuestions,
      action: aiResult.action
    };
    conversationRepo.addMessage(sessionId, botMsg);

    return NextResponse.json({
      success: true,
      message: botMsg,
      sessionId
    });
  } catch (error) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing chat message.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId') || 'default-session';
  const session = conversationRepo.getSession(sessionId);
  return NextResponse.json({ success: true, session });
}
