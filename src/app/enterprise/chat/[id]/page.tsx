export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// 模拟OpenClaw数据
const openClawList = [
  { 
    id: 1, 
    name: '智能客服助手', 
    desc: '基于大语言模型的智能客服系统，支持多轮对话和知识库问答',
    models: ['大语言模型', '向量模型'],
    apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx1234',
    createdAt: '2025-03-01 10:30:00',
    status: 'active',
    calls: 12580,
  },
  { 
    id: 2, 
    name: '图像分析服务', 
    desc: '提供图像理解和分类功能，支持物体检测和场景识别',
    models: ['图像理解大模型'],
    apiKey: 'sk-yyyyyyyyyyyyyyyyyyyyyyyyyyyyy5678',
    createdAt: '2025-03-05 14:00:00',
    status: 'active',
    calls: 8920,
  },
  { 
    id: 3, 
    name: '内容创作工具', 
    desc: 'AI辅助内容创作，支持文案生成、图片生成等多模态能力',
    models: ['大语言模型', '图像生成大模型'],
    apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx1234',
    createdAt: '2025-03-10 09:20:00',
    status: 'inactive',
    calls: 5430,
  },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const clawId = parseInt(params.id as string);
  const claw = openClawList.find(c => c.id === clawId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整输入框高度
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `我是${claw?.name || 'AI助手'}，我已收到您的问题："${userMessage.content}"。这是一个模拟的回复，实际使用时会调用真实的模型接口。`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!claw) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">OpenClaw 不存在</div>
          <Link href="/enterprise" className="text-blue-500 hover:underline">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="4" fill="white" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px] md:max-w-none">
            {claw.name}
          </h1>
        </div>
        <button 
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-center">
                开始与 <span className="text-gray-600 font-medium">{claw.name}</span> 对话
              </p>
              <p className="text-sm mt-2 text-gray-300">
                使用模型：{claw.models.join('、')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 底部输入区域 */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-gray-100 rounded-2xl px-4 py-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入你的问题"
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                inputValue.trim() && !isLoading
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  );
}
