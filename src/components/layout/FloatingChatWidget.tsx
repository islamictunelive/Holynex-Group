import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  Globe,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../../lib/languageContext';
import { AISettings } from '../../types';
import { initialAISettings } from '../../lib/aiData';
import { Storage } from '../../lib/storage';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  escalated?: boolean;
  hasLookup?: boolean;
}

const STORAGE_KEY = 'holynex_ai_live_chat_history';

// Helper to render text with clickable links
const renderMessageContent = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      let url = part;
      let trailingPunct = '';
      if (/[.,;]$/.test(url)) {
        trailingPunct = url.slice(-1);
        url = url.slice(0, -1);
      }
      return (
        <React.Fragment key={index}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-2 break-all font-semibold inline-flex items-center gap-0.5 mx-0.5"
          >
            <span>{url}</span>
            <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />
          </a>
          {trailingPunct}
        </React.Fragment>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang: globalLang, t } = useLanguage();
  const [chatLang, setChatLang] = useState<'bn' | 'en'>(globalLang === 'en' ? 'en' : 'bn');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCallInfo, setShowCallInfo] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(initialAISettings);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync with global language changes when first opening
  useEffect(() => {
    setChatLang(globalLang === 'en' ? 'en' : 'bn');
  }, [globalLang]);

  // Load public settings from backend or local storage
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/ai/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setAiSettings((prev) => ({ ...prev, ...data.settings }));
            return;
          }
        }
      } catch {
        // Fallback to local storage
      }
      const stored = Storage.getAISettings();
      if (stored) setAiSettings(stored);
    };

    fetchSettings();
  }, []);

  // Initialize and persist chat history
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
    return [
      {
        id: 'msg-welcome-1',
        sender: 'bot',
        text:
          chatLang === 'bn'
            ? initialAISettings.welcomeMessageBn
            : initialAISettings.welcomeMessageEn,
        timestamp: new Date().toISOString(),
        suggestedQuestions:
          chatLang === 'bn'
            ? [
                'নায্যমূল্য কার্ড সম্পর্কে জানুন',
                'Customer সুবিধা দেখুন',
                'ডিলার হতে চাই',
                'ডিলার আবেদন কীভাবে করব?',
                'ডিলার আবেদন স্ট্যাটাস',
                'কিস্তি সুবিধা সম্পর্কে জানুন',
                'পণ্যের তালিকা দেখুন',
                'যোগাযোগ করুন',
                'WhatsApp-এ যোগাযোগ করুন',
              ]
            : [
                'Learn about Fair Price Card',
                'View Customer Benefits',
                'Become a Dealer',
                'How to apply for dealership?',
                'Check Dealer Application Status',
                'Learn about Installment Benefits',
                'View Product Catalog',
                'Contact Us',
                'Contact via WhatsApp',
              ],
      },
    ];
  });

  // Save messages to local storage whenever changed
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
      } catch (e) {
        console.error('Error saving chat history:', e);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Handle Send
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyContext = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          lang: chatLang,
          history: historyContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || (chatLang === 'bn' ? aiSettings.fallbackMessageBn : aiSettings.fallbackMessageEn);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toISOString(),
        suggestedQuestions: data.suggestedQuestions,
        escalated: data.escalated,
        hasLookup: data.hasLookup,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Also log locally if Storage has method
      Storage.logAIChatQuery({
        query: textToSend,
        replySnippet: botReply.slice(0, 100),
        lang: chatLang,
        status: data.escalated ? 'escalated' : data.hasLookup ? 'lookup_success' : 'answered_ai',
        confidence: 'high',
        hasLookup: data.hasLookup,
      });
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text:
          chatLang === 'bn'
            ? 'দুঃখিত, সংযোগে সামান্য বিলম্ব হচ্ছে। আপনি সরাসরি আমাদের কাস্টমার কেয়ারে কল করতে পারেন: 01307835260 অথবা হোয়াটসঅ্যাপ করুন।'
            : 'Apologies, there was a temporary connection issue. You can reach our Corporate Helpline directly at 01307835260 or via WhatsApp.',
        timestamp: new Date().toISOString(),
        escalated: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(chatLang === 'bn' ? 'আপনি কি চ্যাট হিস্ট্রি মুছে ফেলতে চান?' : 'Do you want to clear chat history?')) {
      const welcome: ChatMessage = {
        id: `msg-welcome-${Date.now()}`,
        sender: 'bot',
        text:
          chatLang === 'bn'
            ? aiSettings.welcomeMessageBn
            : aiSettings.welcomeMessageEn,
        timestamp: new Date().toISOString(),
        suggestedQuestions:
          chatLang === 'bn'
            ? [
                'নায্যমূল্য কার্ড সম্পর্কে জানুন',
                'Customer সুবিধা দেখুন',
                'ডিলার হতে চাই',
                'ডিলার আবেদন কীভাবে করব?',
                'ডিলার আবেদন স্ট্যাটাস',
                'কিস্তি সুবিধা সম্পর্কে জানুন',
                'পণ্যের তালিকা দেখুন',
                'যোগাযোগ করুন',
                'WhatsApp-এ যোগাযোগ করুন',
              ]
            : [
                'Learn about Fair Price Card',
                'View Customer Benefits',
                'Become a Dealer',
                'How to apply for dealership?',
                'Check Dealer Application Status',
                'Learn about Installment Benefits',
                'View Product Catalog',
                'Contact Us',
                'Contact via WhatsApp',
              ],
      };
      setMessages([welcome]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleLanguage = () => {
    const nextLang = chatLang === 'bn' ? 'en' : 'bn';
    setChatLang(nextLang);
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-7 z-40">
      {/* Floating Chat Window Panel */}
      {isOpen && (
        <div
          id="holynex-ai-chat-window"
          className="fixed inset-0 sm:inset-auto sm:absolute sm:bottom-16 sm:right-0 w-full sm:w-[400px] md:w-[420px] h-full sm:h-[620px] max-h-full sm:max-h-[85vh] bg-slate-950 border-0 sm:border border-amber-500/30 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 py-3 text-slate-950 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-950 text-amber-400 border border-amber-300 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm leading-tight text-slate-950 tracking-tight">
                    {chatLang === 'bn' ? aiSettings.assistantNameBn : aiSettings.assistantNameEn}
                  </h4>
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-slate-950/15 text-slate-950 rounded">
                    AI Live
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-900/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 inline text-slate-900" />
                  {chatLang === 'bn' ? 'অফিসিয়াল কর্পোরেট সাপোর্ট • তাত্ক্ষণিক' : 'Official Corporate Desk • Instant'}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="px-2 py-1 rounded-lg bg-slate-950/15 hover:bg-slate-950/25 text-slate-950 text-xs font-bold transition-all flex items-center gap-1"
                title={chatLang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              >
                <Globe className="w-3 h-3" />
                <span>{chatLang === 'bn' ? 'EN' : 'বাং'}</span>
              </button>

              {/* Clear history */}
              <button
                onClick={handleClearHistory}
                className="w-7 h-7 rounded-lg bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center transition-colors"
                title={chatLang === 'bn' ? 'চ্যাট মুছে ফেলুন' : 'Clear Chat'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center transition-colors"
                title="Minimize / Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Direct Hotline Strip */}
          <div className="bg-slate-900/90 border-b border-amber-500/20 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300 shrink-0">
            <div className="flex items-center gap-2">
              <a
                href="tel:01307835260"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                title="হটলাইনে কল করুন"
              >
                <Phone className="w-3 h-3" />
                <span>01307835260</span>
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="https://wa.me/8801307835260"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                title="হোয়াটসঅ্যাপে যোগাযোগ"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setShowCallInfo(!showCallInfo)}
              className="text-slate-400 hover:text-white flex items-center gap-0.5 text-[10px]"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{showCallInfo ? 'সংক্ষিপ্ত' : 'অফিস সময়'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showCallInfo ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Collapsible Info Drawer */}
          {showCallInfo && (
            <div className="bg-slate-900 border-b border-amber-500/20 p-3 text-[11px] text-slate-300 space-y-1.5 animate-in fade-in duration-150 shrink-0">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{chatLang === 'bn' ? aiSettings.supportHoursBn : aiSettings.supportHoursEn}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{chatLang === 'bn' ? '৭১২, কমিশনার রোড, জুরাইন, যাত্রাবাড়ী, ঢাকা' : '712, Commissioner Road, Jurain, Dhaka'}</span>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[85%] rounded-2xl p-3.5 space-y-2 relative group shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 rounded-br-none font-medium'
                      : 'bg-slate-900/90 text-slate-100 border border-amber-500/20 rounded-bl-none'
                  }`}
                >
                  {/* Verified Lookup Badge */}
                  {msg.hasLookup && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full w-fit mb-1 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>{chatLang === 'bn' ? 'ভেরিফায়েড রেকর্ড যাচাইকৃত' : 'Verified Database Record'}</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="leading-relaxed whitespace-pre-line text-[12.5px]">
                    {renderMessageContent(msg.text)}
                  </div>

                  {/* Human Escalation Card inside Message */}
                  {msg.escalated && (
                    <div className="mt-2.5 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{chatLang === 'bn' ? 'সরাসরি কাস্টমার কেয়ারে যোগাযোগ করুন' : 'Direct Human Assistance'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="tel:01307835260"
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-400 transition-colors shadow"
                        >
                          <Phone className="w-3 h-3" />
                          <span>01307835260</span>
                        </a>
                        <a
                          href="https://wa.me/8801307835260"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-emerald-500 transition-colors shadow"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp (01307835260)</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Suggested Question Pills */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="pt-2 border-t border-amber-500/10 space-y-1.5">
                      <div className="text-[10px] text-amber-400/90 font-semibold flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>{chatLang === 'bn' ? 'প্রাসঙ্গিক প্রশ্নসমূহ:' : 'Suggested Inquiries:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            disabled={isLoading}
                            className="text-left px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700/60 hover:border-amber-500/40 text-[11px] transition-all disabled:opacity-50"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp and Copy Action */}
                  <div className="flex items-center justify-between text-[9.5px] opacity-75 pt-1">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-amber-400 p-0.5 rounded transition-colors flex items-center gap-0.5"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{chatLang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{chatLang === 'bn' ? 'কপি' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-900 text-amber-400 border border-amber-500/30 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium">
                    {chatLang === 'bn' ? 'হোলিনেক্স এআই অনুসন্ধান করছে...' : 'Holynex AI is searching...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-slate-950 border-t border-amber-500/30 shrink-0 space-y-1.5">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-slate-900 border border-slate-800 focus-within:border-amber-500 rounded-xl px-3 py-2 transition-colors">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    chatLang === 'bn'
                      ? 'প্রশ্ন লিখুন... (যেমন: ফেয়ার প্রাইস কার্ড, কিস্তি, ডিলারশিপ)'
                      : 'Ask a question... (e.g. Fair Price Card, Installments, Dealership)'
                  }
                  rows={2}
                  className="w-full bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Enter to send • Shift+Enter for new line</span>
                  <span>{inputMessage.length}/500</span>
                </div>
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shadow-md shadow-amber-500/20 shrink-0"
                title="Send Message"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Send className="w-4 h-4 text-slate-950" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button - Radiant Gold Button */}
      <button
        id="holynex-ai-chat-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 shadow-xl shadow-amber-500/35 hover:shadow-amber-500/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-amber-200 ring-4 ring-amber-500/20 group"
        title="Holynex Corporate AI Live Chat"
        aria-label="Open AI Live Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-950 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-amber-300 shadow"></span>
          </div>
        )}

        {/* Subtle tooltip pill when closed */}
        {!isOpen && (
          <span className="hidden sm:block absolute right-16 px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-[11px] font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {globalLang === 'bn' ? 'স্মার্ট এআই চ্যাট • প্রশ্ন করুন' : 'Smart AI Chat • Ask Anything'}
          </span>
        )}
      </button>
    </div>
  );
};
