import React, { useState, useMemo } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { MaintenanceTicket, TicketPriority, TicketStatus } from '../types';
import { 
  Wrench, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Flame, 
  User, 
  Building, 
  DollarSign, 
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';

interface MaintenanceTabProps {
  onOpenNewTicket: () => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ onOpenNewTicket }) => {
  const { 
    tickets, 
    updateTicketStatus, 
    updateTicketDetails,
    deleteTicket, 
    searchQuery, 
    setSearchQuery 
  } = usePropertyManager();

  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'scheduled' | 'resolved' | 'urgent_only'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Status filter
      if (statusFilter === 'urgent_only') {
        if (ticket.status === 'resolved' || (ticket.priority !== 'urgent' && ticket.priority !== 'high')) return false;
      } else if (statusFilter !== 'all' && ticket.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && ticket.category !== categoryFilter) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(q) ||
          ticket.propertyName.toLowerCase().includes(q) ||
          ticket.tenantName.toLowerCase().includes(q) ||
          ticket.unitNumber.toLowerCase().includes(q) ||
          (ticket.assignedVendor && ticket.assignedVendor.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [tickets, statusFilter, categoryFilter, searchQuery]);

  const priorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-700">Low</span>;
    }
  };

  const statusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">New Request</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case 'scheduled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Vendor Scheduled</span>;
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Resolved</span>;
    }
  };

  const categoryIcon = (cat: string) => {
    return <Wrench className="w-4 h-4 text-zinc-500" />;
  };

  const urgentCount = tickets.filter(t => t.status !== 'resolved' && (t.priority === 'urgent' || t.priority === 'high')).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Maintenance & Repairs Tracker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Automatic triage, vendor dispatch, and cost tracking with zero landlord friction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'board' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          <button
            onClick={onOpenNewTicket}
            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'all' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Tickets ({tickets.length})
          </button>

          <button
            onClick={() => setStatusFilter('urgent_only')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'urgent_only' ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>High / Urgent ({urgentCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'in_progress' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            In Progress ({tickets.filter(t => t.status === 'in_progress').length})
          </button>

          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'scheduled' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Scheduled ({tickets.filter(t => t.status === 'scheduled').length})
          </button>

          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'resolved' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Resolved ({tickets.filter(t => t.status === 'resolved').length})
          </button>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500 font-medium">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="hvac">HVAC / Cooling</option>
            <option value="appliance">Appliances & Pool</option>
            <option value="electrical">Electrical</option>
            <option value="structural">Structural / Locks</option>
          </select>
        </div>

      </div>

      {/* Main Content: List or Board */}
      {viewMode === 'list' ? (
        
        <div className="space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="text-base font-semibold text-zinc-800">No active maintenance tickets</p>
              <p className="text-xs text-zinc-500 mt-1">All rental units are functioning normally with zero pending repairs.</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-xl border p-4.5 transition-all shadow-xs ${
                    ticket.priority === 'urgent' && !isResolved
                      ? 'border-rose-300 bg-rose-50/20'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Left: Info & Description */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {priorityBadge(ticket.priority)}
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          {ticket.category}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-xs font-medium text-zinc-700">
                          Reported: {ticket.reportedDate}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-zinc-900">
                          {ticket.title}
                        </h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                          {ticket.description}
                        </p>
                      </div>

                      {/* Property & Unit Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="font-medium text-zinc-800">{ticket.propertyName}</span>
                          <span>({ticket.unitNumber})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Tenant: {ticket.tenantName}</span>
                        </div>
                      </div>

                      {ticket.notes && (
                        <div className="mt-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs text-zinc-600">
                          <strong className="text-zinc-800">Dispatch Note:</strong> {ticket.notes}
                        </div>
                      )}
                    </div>

                    {/* Right: Vendor, Cost & Quick Status Controls */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                      
                      <div className="text-left lg:text-right">
                        <div className="text-xs text-zinc-500">Assigned Vendor</div>
                        <div className="text-xs font-semibold text-zinc-900 mt-0.5">
                          {ticket.assignedVendor || 'Pending Dispatch'}
                        </div>
                        <div className="text-xs text-zinc-600 mt-1">
                          Est. Cost: <strong className="text-zinc-900">${ticket.estimatedCost}</strong>
                          {ticket.actualCost && <span> (Final: ${ticket.actualCost})</span>}
                        </div>
                      </div>

                      {/* Status Dropdown & 1-click resolve */}
                      <div className="flex items-center gap-2">
                        <select
                          value={ticket.status}
                          onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                          className="text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        >
                          <option value="new">New Request</option>
                          <option value="in_progress">In Progress</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="resolved">Resolved</option>
                        </select>

                        {ticket.status !== 'resolved' ? (
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => deleteTicket(ticket.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-100 transition-colors"
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      ) : (

        /* Pipeline Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {(['new', 'in_progress', 'scheduled', 'resolved'] as TicketStatus[]).map((colStatus) => {
            const colTickets = filteredTickets.filter(t => t.status === colStatus);
            const colTitles: Record<TicketStatus, string> = {
              new: 'New Requests',
              in_progress: 'In Progress / Triage',
              scheduled: 'Vendor Scheduled',
              resolved: 'Resolved',
            };

            return (
              <div key={colStatus} className="bg-zinc-50/80 rounded-xl p-3.5 border border-zinc-200 flex flex-col min-h-[450px]">
                
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200/80">
                  <div className="font-semibold text-xs text-zinc-800 uppercase tracking-wider">
                    {colTitles[colStatus]}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                    {colTickets.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colTickets.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-400">
                      Empty
                    </div>
                  ) : (
                    colTickets.map(ticket => (
                      <div
                        key={ticket.id}
                        className="bg-white rounded-lg p-3 border border-zinc-200 shadow-2xs space-y-2 hover:border-zinc-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          {priorityBadge(ticket.priority)}
                          <span className="text-[11px] text-zinc-400 font-medium">
                            ${ticket.estimatedCost}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-zinc-900 leading-tight">
                          {ticket.title}
                        </div>

                        <div className="text-[11px] text-zinc-500">
                          {ticket.propertyName} ({ticket.unitNumber})
                        </div>

                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400">
                            {ticket.assignedVendor || 'No vendor'}
                          </span>
                          
                          <select
                            value={ticket.status}
                            onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                            className="text-[10px] bg-zinc-50 border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-700"
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Prog</option>
                            <option value="scheduled">Sched</option>
                            <option value="resolved">Done</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};
