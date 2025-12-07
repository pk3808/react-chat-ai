//@ts-nocheck
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader, MessageSquare, Shield } from 'lucide-react';

// Helper function to generate unique IDs
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ColorTheme {
  botMessageBg?: string;
  botMessageText?: string;
  botMessageBorder?: string;
  userMessageBg?: string;
  userMessageText?: string;
  bodyBg?: string;
  bodyText?: string;
  headerBg?: string;
  headerText?: string;
  headerBorder?: string;
  footerBg?: string;
  footerText?: string;
  footerBorder?: string;
  inputBg?: string;
  inputText?: string;
  inputBorder?: string;
  inputPlaceholder?: string;
  botIconBg?: string;
  userIconBg?: string;
  primaryButton?: string;
  primaryButtonText?: string;
  secondaryButton?: string;
  secondaryButtonText?: string;
  timestampText?: string;
  borderColor?: string;
  shadowColor?: string;
}

interface ChatBotProps {
  apiKey?: string;
  provider?: 'gemini' | 'openai' | 'custom';
  websiteInfo?: {
    title?: string;
    description?: string;
    url?: string;
  };
  branding?: {
    logo?: string;
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
  customization?: {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    theme?: 'light' | 'dark' | 'auto';
  };
  colorTheme?: ColorTheme;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
  customApiEndpoint?: string;
  model?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({
  apiKey = '',
  provider = 'gemini',
  websiteInfo = {},
  branding = {},
  customization = {},
  colorTheme = {},
  onMessageSent,
  onResponseReceived,
  customApiEndpoint,
  model
}) => {
  const defaultModel = model || (provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.0-flash');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    logo,
    primaryColor = '#FF6B35',
    accentColor = '#4F46E5',
    fontFamily = 'system-ui, -apple-system, sans-serif'
  } = branding;

  const {
    position = 'bottom-right',
    theme = 'light'
  } = customization;

  const isDark = theme === 'dark' || (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const defaultColors: ColorTheme = {
    botMessageBg: isDark ? '#374151' : '#F3F4F6',
    botMessageText: isDark ? '#F9FAFB' : '#1F2937',
    botMessageBorder: isDark ? '#4B5563' : '#E5E7EB',
    userMessageBg: primaryColor,
    userMessageText: '#FFFFFF',
    bodyBg: isDark ? '#111827' : '#FFFFFF',
    bodyText: isDark ? '#F9FAFB' : '#1F2937',
    headerBg: isDark ? '#1F2937' : '#F9FAFB',
    headerText: isDark ? '#FFFFFF' : '#111827',
    headerBorder: isDark ? '#374151' : '#E5E7EB',
    footerBg: isDark ? '#1F2937' : '#F9FAFB',
    footerText: isDark ? '#F3F4F6' : '#6B7280',
    footerBorder: isDark ? '#374151' : '#E5E7EB',
    inputBg: isDark ? '#374151' : '#FFFFFF',
    inputText: isDark ? '#FFFFFF' : '#111827',
    inputBorder: isDark ? '#4B5563' : '#D1D5DB',
    inputPlaceholder: isDark ? '#9CA3AF' : '#6B7280',
    botIconBg: accentColor,
    userIconBg: primaryColor,
    primaryButton: primaryColor,
    primaryButtonText: '#FFFFFF',
    secondaryButton: isDark ? '#374151' : '#F3F4F6',
    secondaryButtonText: isDark ? '#D1D5DB' : '#4B5563',
    timestampText: isDark ? '#9CA3AF' : '#6B7280',
    borderColor: isDark ? '#374151' : '#E5E7EB',
    shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
  };

  const colors: ColorTheme = { ...defaultColors, ...colorTheme };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !showWelcome) {
      inputRef.current?.focus();
    }
  }, [isOpen, showWelcome]);

  const startChat = () => {
    setIsOpen(true);
    setShowWelcome(false);
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello! I'm your AI assistant for ${websiteInfo.title || 'this website'}. How can I assist you today?`,
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const getGeminiResponse = async (message: string) => {
    const context = websiteInfo.title
      ? `You are a helpful assistant for ${websiteInfo.title}. ${websiteInfo.description || ''} Answer the user's questions based on this context, you are representing this website ,so act like you are ${websiteInfo.title}.`
      : 'You are a helpful assistant. Answer the user\'s questions.';

    const geminiModel = (model && model.startsWith('gemini-')) ? model : 'gemini-2.0-flash';

    // Use v1 API endpoint for stable models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${geminiModel}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${context}\n\nUser question: ${message}\n\nPlease provide a helpful response.`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API request failed: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process your request. Please try again.";
  };

  const getOpenAIResponse = async (message: string) => {
    const context = websiteInfo.title
      ? `You are a helpful assistant for ${websiteInfo.title}. ${websiteInfo.description || ''} Answer the user's questions based on this context, you are representing this website ,so act like you are ${websiteInfo.title}.`
      : 'You are a helpful assistant. Answer the user\'s questions.';


    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: defaultModel,
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I couldn't process your request. Please try again.";
  };

  const getCustomResponse = async (message: string) => {
    if (!customApiEndpoint) {
      throw new Error('Custom API endpoint not provided');
    }

    const context = websiteInfo.title
      ? `You are a helpful assistant for ${websiteInfo.title}. ${websiteInfo.description || ''} Answer the user's questions based on this context.`
      : 'You are a helpful assistant. Answer the user\'s questions.';

    const response = await fetch(customApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({
        message: message,
        context: context,
        model: defaultModel
      })
    });

    if (!response.ok) {
      throw new Error(`Custom API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || "I couldn't process your request. Please try again.";
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateUniqueId(), // Use the helper function to generate unique IDs
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (onMessageSent) {
      onMessageSent(inputValue);
    }

    try {
      let aiResponse = '';

      if (apiKey) {
        switch (provider) {
          case 'openai':
            aiResponse = await getOpenAIResponse(inputValue);
            break;
          case 'custom':
            aiResponse = await getCustomResponse(inputValue);
            break;
          case 'gemini':
          default:
            aiResponse = await getGeminiResponse(inputValue);
            break;
        }
      } else {
        // Simulate a response when no API key is provided
        const responses = [
          "I understand your question. Let me help you with that.",
          "That's a great question! Here's what I can tell you...",
          "Based on the information about " + (websiteInfo.title || "our website") + ", I'd suggest...",
          "I'm here to help! Let me provide you with some details on that topic.",
          "Thank you for asking. Here's my response to your inquiry..."
        ];

        const assistantMessage: Message = {
          id: generateUniqueId(), // Use the helper function to generate unique IDs
          content: responses[Math.floor(Math.random() * responses.length)],
          role: 'assistant',
          timestamp: new Date()
        };

        // Use a promise to maintain async flow
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);

        if (onResponseReceived) {
          onResponseReceived(assistantMessage.content);
        }
      }

      const assistantMessage: Message = {
        id: generateUniqueId(), // Use the helper function to generate unique IDs
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

      if (onResponseReceived) {
        onResponseReceived(assistantMessage.content);
      }
    } catch (error) {
      console.error(`Error calling ${provider} API:`, error);

      const errorMessage: Message = {
        id: generateUniqueId(), // Use the helper function to generate unique IDs
        content: `I'm having trouble connecting to the ${provider} service right now. Please try again later. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);

      if (onResponseReceived) {
        onResponseReceived(errorMessage.content);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showWelcome) {
        startChat();
      } else {
        sendMessage();
      }
    }
  };

  const sizeClasses = isMobile ? 'w-full h-full' : 'w-[410px] h-[600px]';

  // Define position classes based on the customization prop
  const positionStyle = {
    position: 'fixed' as const,
    fontFamily,
    bottom: position.includes('bottom') ? '24px' : 'auto',
    right: position.includes('right') ? '24px' : 'auto',
    left: position.includes('left') ? '24px' : 'auto',
    top: position.includes('top') ? '24px' : 'auto',
    zIndex: 50,
  };

  return (
    <div style={positionStyle}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: colors.primaryButton,
            color: colors.primaryButtonText,
            boxShadow: `0 4px 20px ${colors.shadowColor}`
          }}
        >
          <Bot className="w-12 h-12 p-3 " />
        </button>
      )}

      {isOpen && (
        <div
          className={`${sizeClasses} ${isMobile ? 'border-0 rounded-none' : 'border rounded-2xl'
            } shadow-2xl flex flex-col transition-all duration-300 ${isMobile ? 'fixed inset-0' : ''
            }`}
          style={{
            backgroundColor: colors.bodyBg,
            borderColor: colors.borderColor,
            boxShadow: `0 25px 50px ${colors.shadowColor}`,
            backdropFilter: 'blur(10px)',
            maxWidth: isMobile ? 'none' : '450px',  // Added max-width constraint
            width: isMobile ? '100%' : '410px',  // Ensure it doesn't exceed 450px
            height: isMobile ? '100%' : '600px', // Fixed height to prevent expansion
            maxHeight: isMobile ? '100%' : '100vh', // Prevent exceeding viewport height
            overflow: 'hidden' // Prevent any overflow from the main container
          }}
        >
          <div
            className={`flex items-center justify-between p-4 border-b ${isMobile ? 'rounded-none' : 'rounded-t-2xl'
              }`}
            style={{
              backgroundColor: colors.headerBg,
              borderBottomColor: colors.headerBorder,
              color: colors.headerText,
              flexShrink: 0 // Prevent header from shrinking
            }}
          >
            <div className="flex items-center space-x-3">
              {logo ? (
                <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: colors.botIconBg }}
                >
                  <Bot size={16} />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm" style={{ color: colors.headerText }}>
                  {showWelcome ? 'AI Assistant' : websiteInfo.title || 'AI Assistant'}
                </h3>
                <p className="text-xs" style={{ color: colors.timestampText }}>
                  Online now
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: colors.secondaryButtonText
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryButton || ''}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={16} />
            </button>
          </div>

          {showWelcome ? (
            <div
              className="flex-1 overflow-y-auto flex flex-col justify-center items-center px-4 py-4"
              style={{ backgroundColor: colors.bodyBg }}
            >
              <div className="text-center max-w-sm mx-auto space-y-6">
                <div className="mx-auto mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto"
                    style={{ backgroundColor: colors.botIconBg }}
                  >
                    <Bot size={24} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-xl font-bold" style={{ color: colors.bodyText }}>
                    Hey there, I'm {websiteInfo.title ? `${websiteInfo.title}'s` : 'your'} AI Assistant
                  </h1>
                  <p className="text-sm" style={{ color: colors.timestampText }}>
                    I'm here to help answer questions and provide support for {websiteInfo.title || 'this website'}.
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <MessageSquare className="w-4 h-4" style={{ color: colors.timestampText }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm" style={{ color: colors.bodyText }}>
                        Ask me anything
                      </h3>
                      <p className="text-xs" style={{ color: colors.timestampText }}>
                        I can help with questions, provide information, and assist with various tasks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4" style={{ color: colors.timestampText }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm" style={{ color: colors.bodyText }}>
                        Safe & reliable
                      </h3>
                      <p className="text-xs" style={{ color: colors.timestampText }}>
                        Built with safety in mind to provide helpful and appropriate responses.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startChat}
                  className="w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg text-sm"
                  style={{
                    backgroundColor: colors.primaryButton,
                    color: colors.primaryButtonText
                  }}
                >
                  Start chatting
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{
                backgroundColor: colors.bodyBg,
                minHeight: 0, // Needed for flex child to be properly constrained
                overflowY: 'auto' // Explicitly set overflow for message area
              }}
            >
              <div className="space-y-4 w-full max-w-full"> {/* Added max-width constraint */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} space-x-2`}
                  >
                    {message.role === 'assistant' && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1"
                        style={{ backgroundColor: colors.botIconBg }}
                      >
                        <Bot size={16} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto' : 'border break-words' // Added break-words for long content
                        }`}
                      style={
                        message.role === 'user'
                          ? {
                            backgroundColor: colors.userMessageBg,
                            color: colors.userMessageText,
                            maxWidth: 'calc(100% - 40px)' // Ensure message doesn't exceed container width
                          }
                          : {
                            backgroundColor: colors.botMessageBg,
                            color: colors.botMessageText,
                            borderColor: colors.botMessageBorder,
                            maxWidth: 'calc(100% - 40px)' // Ensure message doesn't exceed container width
                          }
                      }
                    >
                      {message.content}
                      <div
                        className="text-xs mt-2"
                        style={{
                          color: message.role === 'user'
                            ? `${colors.userMessageText}B3`
                            : colors.timestampText
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1"
                        style={{ backgroundColor: colors.userIconBg }}
                      >
                        <User size={16} />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: colors.botIconBg }}
                    >
                      <Bot size={16} />
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl border break-words" // Added break-words for loading state too
                      style={{
                        backgroundColor: colors.botMessageBg,
                        borderColor: colors.botMessageBorder,
                        maxWidth: 'calc(100% - 40px)' // Ensure loading indicator doesn't exceed container width
                      }}
                    >
                      <Loader className="w-4 h-4 animate-spin" style={{ color: colors.botMessageText }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {!showWelcome && (
            <div
              className={`p-4 border-t ${isMobile ? 'rounded-none' : 'rounded-b-2xl'
                }`}
              style={{
                backgroundColor: colors.footerBg,
                borderTopColor: colors.footerBorder
              }}
            >
              <div>
                <div
                  className="flex items-end space-x-2 p-3 border rounded-xl max-w-full" // Added max-width constraint
                  style={{
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 p-2 bg-transparent outline-none text-sm overflow-hidden text-ellipsis"
                    style={{
                      color: colors.inputText,
                      maxWidth: 'calc(100% - 40px)' // Ensure input field doesn't exceed container width
                    }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0" // Added flex-shrink-0 to prevent button from shrinking
                    style={{
                      backgroundColor: colors.primaryButton,
                      color: colors.primaryButtonText
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p
                  className="text-xs mt-3 text-center"
                  style={{ color: colors.footerText }}
                >
                  Powered by AI • Press Enter to send
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
