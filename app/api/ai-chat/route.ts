import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: "minimaxai/minimax-m2",
              messages: messages,
              temperature: 0.7,
              top_p: 0.95,
              max_tokens: 1024,
              stream: true
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('NVIDIA API error:', response.statusText, errorText);
            controller.error(new Error('Failed to get response from AI'));
            return;
          }

          const reader = response.body?.getReader();
          if (!reader) {
            controller.error(new Error('Response body is null'));
            return;
          }

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // 解析 SSE 格式数据
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // 忽略解析错误
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error('Error in stream:', error);
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
  } catch (error) {
    console.error('Error in AI chat API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
