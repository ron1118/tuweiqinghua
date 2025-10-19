'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 检测键盘弹起
  useEffect(() => {
    const handleResize = () => {
      const initialHeight = window.innerHeight;
      const currentHeight = window.innerHeight;
      setIsKeyboardOpen(currentHeight < initialHeight * 0.75);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 自动调整textarea高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-pickup-lines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: inputText.trim(),
          intensity: intensity,
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      
      // 将AI回复的三条情话分别添加为消息
      data.pickupLines.forEach((line: string, index: number) => {
        const aiMessage: Message = {
          id: `${Date.now()}-${index}`,
          text: line,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: '抱歉，生成失败了，请稍后再试',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理点击消息区域隐藏键盘
  const handleMessageAreaClick = () => {
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--wechat-bg)] max-w-md mx-auto sm:max-w-none">
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:py-4 flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-base sm:text-lg font-medium text-[var(--wechat-text)]">土味情话生成器</h1>
      </div>

      {/* 暧昧程度滑块 */}
      <div className="bg-white px-4 py-3 sm:py-4 border-b border-gray-200 sticky top-[60px] sm:top-[68px] z-10">
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base text-[var(--wechat-light-text)]">暧昧程度</span>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xs sm:text-sm text-[var(--wechat-light-text)]">1</span>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-20 sm:w-24 h-3 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
              style={{
                background: `linear-gradient(to right, #07c160 0%, #07c160 ${(intensity - 1) * 11.11}%, #e5e5e5 ${(intensity - 1) * 11.11}%, #e5e5e5 100%)`
              }}
            />
            <span className="text-xs sm:text-sm text-[var(--wechat-light-text)]">10</span>
            <span className="text-sm sm:text-base font-medium text-[var(--wechat-green)] min-w-[24px] sm:min-w-[28px] text-center">
              {intensity}
            </span>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 sm:space-y-4"
        onClick={handleMessageAreaClick}
      >
        {messages.length === 0 && (
          <div className="text-center text-[var(--wechat-light-text)] mt-16 sm:mt-20">
            <div className="text-5xl sm:text-6xl mb-4">💕</div>
            <p className="text-base sm:text-lg mb-2">欢迎使用土味情话生成器</p>
            <p className="text-sm sm:text-base">输入对方的话，我来帮你生成三条土味情话</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-[var(--wechat-green)] text-white rounded-br-md'
                  : 'bg-white text-[var(--wechat-text)] rounded-bl-md shadow-sm'
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words selectable">
                {message.text}
              </p>
              <p className={`text-xs sm:text-sm mt-1 ${
                message.isUser ? 'text-green-100' : 'text-[var(--wechat-light-text)]'
              }`}>
                {message.timestamp.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-[var(--wechat-text)] rounded-2xl rounded-bl-md shadow-sm px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[var(--wechat-green)] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[var(--wechat-green)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[var(--wechat-green)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm sm:text-base text-[var(--wechat-light-text)]">正在生成情话...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-4 py-3 sm:py-4 sticky bottom-0 z-10">
        <div className="flex items-end space-x-2 sm:space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入对方的话..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-[var(--wechat-green)] text-sm sm:text-base touch-manipulation"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: isKeyboardOpen ? '80px' : '100px',
              }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-white font-medium text-sm sm:text-base transition-colors touch-manipulation ${
              !inputText.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[var(--wechat-green)] hover:bg-[#06ad56] active:bg-[#059c4d]'
            }`}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
