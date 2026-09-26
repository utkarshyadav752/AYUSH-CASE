import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import { ConversationalMessage, AyushSystem } from '../../types/ayush';

interface ConversationalAssistantProps {
  messages: ConversationalMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  system: AyushSystem;
}

export const ConversationalAssistant: React.FC<ConversationalAssistantProps> = ({
  messages,
  onSendMessage,
  isLoading,
  system,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickReply = (reply: string) => {
    if (isLoading) return;
    onSendMessage(reply);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>AyushVani Clinical Intake Scribe</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.2 rounded-full">
                {system} Follow-up
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive clinical AI asking clarifying questions about modalities, digestion, and daily habits.
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
            )}

            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                    : 'bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/60'
                }`}
              >
                {msg.text}
              </div>

              {/* Quick replies */}
              {msg.role === 'assistant' && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleQuickReply(reply)}
                      className="text-[11px] bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 px-2.5 py-1 rounded-full transition-colors font-medium shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 order-2">
                <User className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-slate-50 rounded-xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>AyushVani is formulating clinical follow-ups...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Reply to AyushVani or clarify your symptoms further..."
          disabled={isLoading}
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 text-slate-800 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Reply</span>
        </button>
      </form>
    </div>
  );
};
