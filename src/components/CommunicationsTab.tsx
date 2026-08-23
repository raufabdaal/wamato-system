import React, { useState } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { MessageThread } from '../types';
import { 
  MessageSquare, 
  Send, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  CheckCheck,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Wrench
} from 'lucide-react';

export const CommunicationsTab: React.FC = () => {
  const { threads, sendMessage, createThread } = usePropertyManager();
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tenant' | 'owner'>('all');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  const selectedThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const filteredThreads = threads.filter(t => {
    if (filterType === 'all') return true;
    return t.recipientType === filterType;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedThread) return;
    sendMessage(selectedThread.id, messageInput.trim());
    setMessageInput('');
  };

  const quickCannedTemplates = [
    {
      label: 'Payout Transferred',
      text: `Hi ${selectedThread?.recipientName.split(' ')[0] || 'there'}, your net monthly payout has been direct-deposited to your verified bank account today.`,
      icon: DollarSign,
    },
    {
      label: 'Technician Dispatched',
      text: `Hello ${selectedThread?.recipientName.split(' ')[0] || 'there'}, our licensed technician is scheduled for tomorrow between 9:00 AM - 11:00 AM.`,
      icon: Wrench,
    },
    {
      label: 'Rent Payment Confirmed',
      text: `Thank you, your rent payment for this month has been received and processed successfully.`,
      icon: CheckCheck,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Tenant & Owner Communications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Direct SMS and portal inbox for maintenance alerts, payment receipts, and owner updates
          </p>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Message</span>
        </button>
      </div>

      {/* Main 2-Pane Container */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* Left Pane: Threads List */}
        <div className="md:col-span-4 lg:col-span-4 border-r border-zinc-200 flex flex-col bg-zinc-50/50">
          
          {/* Thread Filter Chips */}
          <div className="p-3 border-b border-zinc-200 bg-white">
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                  filterType === 'all' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                All ({threads.length})
              </button>
              <button
                onClick={() => setFilterType('tenant')}
                className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                  filterType === 'tenant' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Tenants ({threads.filter(t => t.recipientType === 'tenant').length})
              </button>
              <button
                onClick={() => setFilterType('owner')}
                className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                  filterType === 'owner' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Landlords ({threads.filter(t => t.recipientType === 'owner').length})
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="divide-y divide-zinc-200/60 overflow-y-auto flex-1 max-h-[520px]">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === selectedThread?.id;

              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-white border-l-4 border-zinc-900 shadow-2xs' : 'hover:bg-zinc-100/60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    thread.recipientType === 'owner'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {thread.recipientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-zinc-900 truncate">
                        {thread.recipientName}
                      </span>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {thread.lastMessageTime}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {thread.propertyName}
                    </div>

                    <p className="text-xs text-zinc-600 truncate mt-1">
                      {thread.lastMessage}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded uppercase ${
                        thread.recipientType === 'owner'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {thread.recipientType === 'owner' ? 'Property Owner' : 'Tenant'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Pane: Active Thread Chat */}
        {selectedThread ? (
          <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-white">
            
            {/* Thread Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">{selectedThread.recipientName}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                    selectedThread.recipientType === 'owner'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {selectedThread.recipientType === 'owner' ? 'Landlord / Client' : 'Active Tenant'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{selectedThread.propertyName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SMS & App Sync
                </span>
              </div>
            </div>

            {/* Message Bubble History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[380px] bg-zinc-50/30">
              {selectedThread.messages.map((msg) => {
                const isMe = msg.sender === 'manager';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-zinc-400 mb-1 px-1">
                      {msg.senderName} • {msg.timestamp}
                    </div>

                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-zinc-900 text-white rounded-tr-xs'
                          : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Canned Template Suggestions */}
            <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0 pl-1">
                Quick Reply:
              </span>
              {quickCannedTemplates.map((tpl, i) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={i}
                    onClick={() => setMessageInput(tpl.text)}
                    className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-700 transition-colors"
                  >
                    <Icon className="w-3 h-3 text-zinc-500" />
                    <span>{tpl.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Send a text message to ${selectedThread.recipientName}...`}
                className="flex-1 text-xs sm:text-sm bg-zinc-50 focus:bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center text-zinc-400 p-8">
            Select a message thread
          </div>
        )}

      </div>

      {/* New Message Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 space-y-4">
            <h3 className="text-base font-bold text-zinc-900">Start New Message Thread</h3>
            <p className="text-xs text-zinc-500">
              Send an instant SMS alert or message to a tenant or property owner.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const recipientType = formData.get('recipientType') as 'tenant' | 'owner';
                const recipientName = formData.get('recipientName') as string;
                const propertyName = formData.get('propertyName') as string;
                const initialMsg = formData.get('initialMsg') as string;

                createThread({
                  recipientType,
                  recipientName,
                  propertyName,
                  lastMessage: initialMsg,
                  messages: [
                    {
                      id: `m-${Date.now()}`,
                      sender: 'manager',
                      senderName: 'Management Desk',
                      text: initialMsg,
                      timestamp: 'Just now',
                    },
                  ],
                });
                setShowNewThreadModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-semibold text-zinc-700">Recipient Type</label>
                <select name="recipientType" className="w-full mt-1 text-xs border border-zinc-200 rounded-lg p-2 bg-zinc-50">
                  <option value="tenant">Tenant</option>
                  <option value="owner">Property Owner / Landlord</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Recipient Name</label>
                <input required name="recipientName" placeholder="e.g. John Doe" className="w-full mt-1 text-xs border border-zinc-200 rounded-lg p-2 bg-zinc-50" />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Property / Unit</label>
                <input required name="propertyName" placeholder="e.g. Highland Oaks Estate" className="w-full mt-1 text-xs border border-zinc-200 rounded-lg p-2 bg-zinc-50" />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Message Text</label>
                <textarea required name="initialMsg" rows={3} placeholder="Write your update..." className="w-full mt-1 text-xs border border-zinc-200 rounded-lg p-2 bg-zinc-50" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
                >
                  Create & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
