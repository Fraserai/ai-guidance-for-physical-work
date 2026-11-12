import { GuidanceRequest, GuidanceResponse } from '@/types/ai';
import { SessionMessage } from '@/types/session';

import { buildFacilitiesSystemPrompt } from '@/lib/facilities-prompt';

function asChatContent(message: SessionMessage): string {
  return `${message.role.toUpperCase()}: ${message.content}`;
}

function parseAssistantReply(content: unknown): string {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (typeof item === 'object' && item && 'text' in item) {
          return String((item as { text?: string }).text ?? '');
        }

        return '';
      })
      .join(' ')
      .trim();
  }

  return '';
}

export async function requestGuidance({
  apiKey,
  contextNote,
  history,
  frameBase64
}: GuidanceRequest): Promise<GuidanceResponse> {
  const lastHistory = history.slice(-20).map(asChatContent).join('\n');

  const payload = {
    model: 'gpt-4o-2024-11-20',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: buildFacilitiesSystemPrompt(contextNote)
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Conversation so far:\n${lastHistory || 'No prior messages yet.'}`
          },
          {
            type: 'text',
            text: 'Latest camera frame from worker right now:'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${frameBase64}`
            }
          }
        ]
      }
    ]
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${details}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  const reply = parseAssistantReply(data.choices?.[0]?.message?.content) ||
    'I can see the task. Do this next: make the area safe and confirm isolation before touching anything. Ready for the next step?';

  return { reply };
}

export async function transcribeAudioChunk(apiKey: string, fileUri: string): Promise<string> {
  const filename = fileUri.split('/').pop() ?? 'audio.m4a';
  const formData = new FormData();

  formData.append('model', 'whisper-1');
  formData.append('file', {
    uri: fileUri,
    name: filename,
    type: 'audio/m4a'
  } as never);

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Transcription failed (${response.status}): ${details}`);
  }

  const json = (await response.json()) as { text?: string };
  return (json.text ?? '').trim();
}
