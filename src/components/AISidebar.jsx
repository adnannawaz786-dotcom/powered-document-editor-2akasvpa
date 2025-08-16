import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Loader2, MessageSquare, Settings, Zap, FileText, Edit3, Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';

const AISidebar = ({ isOpen, onClose, selectedText = '', documentContent = '' }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'AI features are currently under development. This is a placeholder response to demonstrate the interface. Your request has been noted!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    {
      icon: Edit3,
      label: 'Improve Writing',
      description: 'Enhance grammar and style',
      action: () => handleQuickAction('improve')
    },
    {
      icon: Lightbulb,
      label: 'Generate Ideas',
      description: 'Brainstorm content ideas',
      action: () => handleQuickAction('ideas')
    },
    {
      icon: FileText,
      label: 'Summarize',
      description: 'Create a summary',
      action: () => handleQuickAction('summarize')
    },
    {
      icon: Zap,
      label: 'Continue Writing',
      description: 'Extend the content',
      action: () => handleQuickAction('continue')
    }
  ];

  const handleQuickAction = (actionType) => {
    const actionPrompts = {
      improve: 'Please improve the writing style and grammar of the selected text.',
      ideas: 'Generate creative ideas related to this document topic.',
      summarize: 'Create a concise summary of the document content.',
      continue: 'Continue writing from where the document left off.'
    };

    setInput(actionPrompts[actionType] || '');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-gray-900">AI Assistant</h2>
          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
            Pending
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'chat'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'actions'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Actions
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'chat' ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">
                    Start a conversation with your AI assistant
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Feature coming soon!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-3 py-2',
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          message.type === 'user'
                            ? 'text-purple-200'
                            : 'text-gray-500'
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-sm text-gray-500">AI is thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Text Display */}
            {selectedText && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Selected text:</p>
                <p className="text-sm text-gray-700 italic">"{selectedText}"</p>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Quick Actions */
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <action.icon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            
            <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-orange-600" />
                <p className="text-sm font-medium text-orange-800">Development Status</p>
              </div>
              <p className="text-xs text-orange-700">
                AI features are currently under development. The interface is ready, 
                but AI functionality will be implemented in a future update.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISidebar;