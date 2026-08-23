import React from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { 
  DollarSign, 
  ArrowUpRight, 
  Calendar, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building, 
  Users, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Send
} from 'lucide-react';
import { RentRecord, MaintenanceTicket } from '../types';

interface OverviewTabProps {
  onOpenNewTicket: () => void;
  onOpenRecordRent: () => void;
  onOpenOwnerStatement: (record: RentRecord) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onOpenNewTicket,
  onOpenRecordRent,
  onOpenOwnerStatement,
}) => {
  const { stats, rentRecords, tickets, properties, setActiveTab, updateTicketStatus, executeOwnerPayout, recordRentPaid } = usePropertyManager();

  // Find next upcoming payout target
  const pendingPayouts = rentRecords.filter(r => r.payoutStatus !== 'completed');
  const urgentTickets = tickets.filter(t => t.status !== 'resolved' && (t.priority === 'urgent' || t.priority === 'high'));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner: Value Proposition in Action (Guaranteed Owner Payout Tracker) */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl p-6 shadow-sm border border-zinc-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guaranteed Payout Guarantee Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              March 2026 Cash Flow & Payout Summary
            </h1>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Rent collection is <span className="text-emerald-400 font-semibold">{stats.collectionRate}% complete</span>. 
              All owner settlements are automatically calculated minus your 8% management fee and queued for exact-date direct deposit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('rent')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-medium rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Review Owner Payouts</span>
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-sm transition-all border border-zinc-700 flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>View Open Tickets ({stats.activeMaintenanceCount})</span>
            </button>
          </div>

        </div>

        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/5 to-transparent pointer-events-none" />
      </div>

      {/* Core Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Gross Rent & Collection */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium uppercase tracking-wider">
            <span>Rent Collected</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-900">
              ${stats.totalRentCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
              <span className="font-medium text-emerald-600">
                {stats.collectionRate}% of ${stats.totalGrossRent.toLocaleString()}
              </span>
              <span>• {stats.totalRentPending > 0 ? `$${stats.totalRentPending.toLocaleString()} pending` : 'All collected'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Management Fee Revenue */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium uppercase tracking-wider">
            <span>Management Cut (8%)</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-900">
              ${stats.totalManagementFeeEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
              <span className="text-zinc-600 font-medium">Automatic management take</span>
            </div>
          </div>
        </div>

        {/* Card 3: Guaranteed Landlord Payouts */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium uppercase tracking-wider">
            <span>Landlord Payouts</span>
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-900">
              ${stats.totalGuaranteedPayoutsPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
              </span>
              <span>• ${stats.totalPayoutsPending.toLocaleString()} in queue</span>
            </div>
          </div>
        </div>

        {/* Card 4: Maintenance Status */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium uppercase tracking-wider">
            <span>Active Maintenance</span>
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-900">
              {stats.activeMaintenanceCount} <span className="text-base font-normal text-zinc-500">tickets</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
              {stats.urgentTicketsCount > 0 ? (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {stats.urgentTicketsCount} high priority
                </span>
              ) : (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> No critical issues
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Two-Column Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Scheduled Owner Payouts & Rent Collection Table */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Guaranteed Owner Payout Schedule</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Exact scheduled transfer dates, gross rents, and automatic fee deductions
                </p>
              </div>
              <button
                onClick={() => setActiveTab('rent')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View Full Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-zinc-100 overflow-x-auto">
              {rentRecords.slice(0, 4).map((record) => {
                const isPaid = record.rentStatus === 'paid';
                const isPayoutDone = record.payoutStatus === 'completed';

                return (
                  <div key={record.id} className="py-3.5 flex items-center justify-between gap-4">
                    
                    <div className="min-w-[180px]">
                      <div className="font-medium text-sm text-zinc-900">{record.propertyName}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                        <span>{record.unitNumber}</span>
                        <span>•</span>
                        <span>Owner: {record.ownerName}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-zinc-900">
                        ${record.netOwnerPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-zinc-500">
                        Gross ${record.rentAmount.toLocaleString()} - {record.managementFeePercent}% fee (${record.managementFeeAmount})
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-xs font-medium text-zinc-700">
                        Date: <span className="text-zinc-900 font-semibold">{record.guaranteedPayoutDay}th of month</span>
                      </div>
                      <div className="mt-1">
                        {isPayoutDone ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Transferred
                          </span>
                        ) : (
                          <button
                            onClick={() => executeOwnerPayout(record.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
                          >
                            <span>Send Payout</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => onOpenOwnerStatement(record)}
                        title="View Landlord Statement"
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                      >
                        Statement
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Properties Directory summary */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Managed Estates & Rentals ({properties.length})</h2>
                <p className="text-xs text-zinc-500">Active portfolios under full management</p>
              </div>
              <button
                onClick={() => setActiveTab('properties')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Manage Portfolios</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {properties.map(p => {
                const totalRent = p.units.reduce((acc, u) => acc + u.currentRent, 0);
                const occupiedCount = p.units.filter(u => u.status === 'occupied').length;
                return (
                  <div key={p.id} className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm text-zinc-900">{p.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{p.address}, {p.city}</div>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-700">
                        {p.type}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-zinc-200/50 text-zinc-600">
                      <span>Owner: <strong className="text-zinc-800">{p.owner.name}</strong></span>
                      <span>Rent: <strong className="text-emerald-700">${totalRent.toLocaleString()}/mo</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Maintenance Triage & Priority Actions */}
        <div className="space-y-4">
          
          {/* Urgent Maintenance Box */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                  <Wrench className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-zinc-900">Maintenance Triage</h2>
              </div>
              <button
                onClick={onOpenNewTicket}
                className="text-xs font-medium text-zinc-900 hover:text-zinc-700 flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded-md transition-colors"
              >
                <span>+ Log Ticket</span>
              </button>
            </div>

            <p className="text-xs text-zinc-500 mb-3">
              Requests reported by tenants across all managed units
            </p>

            <div className="space-y-3">
              {tickets.slice(0, 3).map((ticket) => {
                return (
                  <div key={ticket.id} className="p-3 rounded-lg border border-zinc-200 bg-white space-y-2 hover:border-zinc-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 leading-tight">
                          {ticket.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {ticket.propertyName} ({ticket.unitNumber})
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                        ticket.priority === 'high' || ticket.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                      <span className="text-zinc-500 text-[11px]">
                        Vendor: {ticket.assignedVendor || 'Unassigned'}
                      </span>
                      
                      {ticket.status !== 'resolved' ? (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                          className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Resolved</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('maintenance')}
              className="w-full mt-4 py-2 text-center text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
            >
              View All Work Orders ({tickets.length})
            </button>
          </div>

          {/* Quick Communication Box */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-900">Tenant & Owner Communication</h2>
              <button
                onClick={() => setActiveTab('communications')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
              >
                Open Inbox
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-3">
              Respond directly to tenant questions and send payout confirmations
            </p>
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
              <Send className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-emerald-950">Automated Landlord Notifications</strong>
                Owners receive instant SMS/Email notifications on the 1st/5th when guaranteed payout is wired.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
