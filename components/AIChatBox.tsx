"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBoxProps {
  articleTitle?: string;
  articleContent?: string;
}

export default function AIChatBox({ articleTitle, articleContent }: AIChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    const contextMessages = [
      {
        role: 'system' as const,
        content: `你是一个专业的文章解读助手。当前用户正在阅读一篇题为"${articleTitle}"的文章。请根据文章内容回答用户的问题，提供深入见解和解释。如果问题与文章无关，礼貌地引导用户回到文章相关话题。`
      },
      {
        role: 'user' as const,
        content: `文章内容摘要：${articleContent ? articleContent.substring(0, 2000) + '...' : '无内容'}`
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: input
      }
    ];

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: contextMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setMessages(prev => {
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg && lastMsg.id === assistantMessageId) {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMsg, content: lastMsg.content + content }
                    ];
                  }
                  return prev;
                });
              }
            } catch {
            }
          }
        }
      }
    } catch (error) {

      setMessages(prev => {
        const withoutEmpty = prev.filter(msg => msg.id !== assistantMessageId);
        return [...withoutEmpty, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，发生了错误，请稍后再试。',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, articleTitle, articleContent]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div
          className={`bg-white w-96 flex flex-col border border-neutral-200 shadow-sm transition-all duration-200 rounded-xl ${
            isMinimized ? 'h-14' : 'h-[500px]'
          }`}
        >
          <div
            className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 font-mono text-xs text-neutral-500"
          >
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-neutral-500" />
              <span>AI 助手</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMinimize}
                className="p-1 rounded hover:bg-neutral-100 transition-colors"
                aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
              >
                {isMinimized ? (
                  <Maximize2 size={14} className="text-neutral-500" />
                ) : (
                  <Minimize2 size={14} className="text-neutral-500" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="p-1 rounded hover:bg-neutral-100 transition-colors"
                aria-label="Close chat"
              >
                <X size={14} className="text-neutral-500" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div
                className="flex-1 overflow-y-auto flex flex-col px-6 py-6 gap-4 font-mono text-xs leading-6 text-neutral-500"
              >
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="mx-auto mb-4 w-12 h-12 rounded-full border border-dashed border-neutral-300 flex items-center justify-center"
                    >
                      <Bot size={20} className="text-neutral-500" />
                    </div>
                    <p className="text-neutral-500 mb-1">你好！我是文章AI助手</p>
                    <p className="text-sm text-orange-600">有什么关于这篇文章的问题吗？</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className="rounded-lg p-4 font-mono text-xs leading-6"
                      >
                        <div className="flex items-start gap-3">
                          {message.role === 'user' && (
                            <User size={14} className="mt-0.5 flex-shrink-0 text-neutral-500" />
                          )}
                          <div className="flex-1">
                            {message.role === 'user' ? (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            ) : (
                              <div className="whitespace-pre-wrap">
                                {message.content}
                                {isLoading && message.id === messages[messages.length - 1]?.id && (
                                  <span
                                    className="inline-block w-2 h-4 bg-orange-600 ml-0.5 animate-bounce align-text-bottom"
                                  />
                                )}
                              </div>
                            )}
                            <p className="text-xs mt-2 text-orange-600">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {message.role === 'assistant' && (
                            <Bot size={14} className="mt-0.5 flex-shrink-0 text-neutral-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div
                className="px-5 py-4 border-t border-neutral-200"
              >
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入你的问题..."
                    aria-label="Type your question"
                    className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 font-mono text-xs outline-none transition-colors focus:border-neutral-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                    className={`px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                      isLoading || !input.trim()
                        ? 'bg-white border-neutral-200 text-neutral-400 cursor-not-allowed opacity-50'
                        : 'bg-orange-600 border-orange-600 text-white cursor-pointer hover:opacity-90'
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-12 h-12 rounded-full border border-neutral-200 bg-white flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all"
          aria-label="Open AI chat"
        >
          <Bot size={20} className="text-neutral-500" />
        </button>
      )}
    </div>
  );
}
