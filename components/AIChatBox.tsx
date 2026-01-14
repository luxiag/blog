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

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // SSE 流式发送消息
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

    // 创建助手消息占位符
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    // 准备发送给AI的消息，包括文章上下文
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
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // 移除空的助手消息，添加错误消息
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
          className={`bg-white w-96 flex flex-col ${
            isMinimized ? 'h-14' : 'h-[500px]'
          } transition-all duration-200`}
          style={{
            borderRadius: '12px',
            border: '1px solid oklch(0.145 0 0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid oklch(0.145 0 0)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'oklch(0.145 0 0)'
            }}
          >
            <div className="flex items-center gap-2">
              <Bot size={16} style={{ color: 'oklch(0.145 0 0)' }} />
              <span>AI 助手</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMinimize}
                className="p-1 rounded"
                style={{
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
              >
                {isMinimized ? (
                  <Maximize2 size={14} style={{ color: 'oklch(0.145 0 0)' }} />
                ) : (
                  <Minimize2 size={14} style={{ color: 'oklch(0.145 0 0)' }} />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="p-1 rounded"
                style={{
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
              >
                <X size={14} style={{ color: 'oklch(0.145 0 0)' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div
                className="flex-1 overflow-y-auto"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  gap: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: 'oklch(0.145 0 0)'
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="mx-auto mb-4"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '1px dashed oklch(0.145 0 0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Bot size={20} style={{ color: 'oklch(0.145 0 0)' }} />
                    </div>
                    <p style={{ color: 'oklch(0.145 0 0)', marginBottom: '4px' }}>你好！我是文章AI助手</p>
                    <p className="text-sm" style={{ color: '#ea580c' }}>有什么关于这篇文章的问题吗？</p>
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
                        style={{
                          borderRadius: '8px',
                          padding: '16px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          lineHeight: '1.6'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {message.role === 'user' && (
                            <User size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.145 0 0)' }} />
                          )}
                          <div className="flex-1">
                            {message.role === 'user' ? (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            ) : (
                              <div className="whitespace-pre-wrap">
                                {message.content}
                                {isLoading && message.id === messages[messages.length - 1]?.id && (
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: '8px',
                                      height: '16px',
                                      background: '#ea580c',
                                      marginLeft: '2px',
                                      animation: 'blink 1s infinite',
                                      verticalAlign: 'text-bottom'
                                    }}
                                  />
                                )}
                              </div>
                            )}
                            <p className="text-xs mt-2" style={{ color: '#ea580c' }}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {message.role === 'assistant' && (
                            <Bot size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.145 0 0)' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid oklch(0.145 0 0)'
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入你的问题..."
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid oklch(0.145 0 0)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid oklch(0.145 0 0)',
                      background: isLoading || !input.trim() ? 'white' : '#ea580c',
                      color: isLoading || !input.trim() ? 'oklch(0.145 0 0)' : 'white',
                      cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s, opacity 0.2s',
                      opacity: isLoading || !input.trim() ? 0.5 : 1
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1px solid oklch(0.145 0 0)',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'box-shadow 0.2s, transform 0.2s'
          }}
        >
          <Bot size={20} style={{ color: 'oklch(0.145 0 0)' }} />
        </button>
      )}

      <style jsx global>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
