import React, { useState, useMemo } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { RentRecord } from '../types';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  Send, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  CreditCard,
  Building,
  UserCheck
} from 'lucide-react';

interface RentPayoutsTabProps {
  onOpenRecordRent: () => void;
  onOpenOwnerStatement: (record: RentRecord) => void;
}

export const RentPayoutsTab: React.FC<RentPayoutsTabProps> = ({
  onOpenRecordRent,
  onOpenOwnerStatement,
}) => {
  const { 
    rentRecords, 
    recordRentPaid, 
    executeOwnerPayout, 
    searchQuery, 
    setSearchQuery 
  } = usePropertyManager();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_rent' | 'needs_payout' | 'completed'>('all');
  const [selectedMonth, setSelectedMonth] = useState('March 2026');

  // Filtered records
  const filteredRecords = useMemo(() => {
    return rentRecords.filter(record => {
      // Month match
      if (record.month !== selectedMonth) return false;

      // Status filter
      if (statusFilter === 'pending_rent' && record.rentStatus === 'paid') return false;
      if (statusFilter === 'needs_payout' && (record.payoutStatus === 'completed' || record.rentStatus !== 'paid')) return false;
      if (statusFilter === 'completed' && record.payoutStatus !== 'completed') return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesProp = record.propertyName.toLowerCase().includes(q);
        const matchesTenant = record.tenantName.toLowerCase().includes(q);
        const matchesOwner = record.ownerName.toLowerCase().includes(q);
        const matchesUnit = record.unitNumber.toLowerCase().includes(q);
        return matchesProp || matchesTenant || matchesOwner || matchesUnit;
      }

      return true;
    });
  }, [rentRecords, selectedMonth, statusFilter, searchQuery]);

  // Aggregate stats for currently viewed month
  const monthStats = useMemo(() => {
    const records = rentRecords.filter(r => r.month === selectedMonth);
    const totalGross = records.reduce((acc, r) => acc + r.rentAmount, 0);
    const totalCollected = records.filter(r => r.rentStatus === 'paid').reduce((acc, r) => acc + r.rentAmount, 0);
    const totalFeeEarned = records.filter(r => r.rentStatus === 'paid').reduce((acc, r) => acc + r.managementFeeAmount, 0);
    const totalPayoutsDispatched = records.filter(r => r.payoutStatus === 'completed').reduce((acc, r) => acc + r.netOwnerPayout, 0);
    const totalPayoutsQueued = records.filter(r => r.payoutStatus !== 'completed').reduce((acc, r) => acc + r.netOwnerPayout, 0);

    return {
      totalGross,
      totalCollected,
      totalFeeEarned,
      totalPayoutsDispatched,
      totalPayoutsQueued,
      collectionRate: totalGross > 0 ? Math.round((totalCollected / totalGross) * 100) : 100,
    };
  }, [rentRecords, selectedMonth]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Rent Collections & Guaranteed Owner Payouts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Automated 8% management fee deduction and guaranteed exact-date direct transfers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm font-medium bg-white border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          >
            <option value="March 2026">March 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="April 2026">April 2026 (Upcoming)</option>
          </select>

          <button
            onClick={onOpenRecordRent}
            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Gross Rent Billed</div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">
            ${monthStats.totalGross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {monthStats.collectionRate}% collected (${monthStats.totalCollected.toLocaleString()})
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Management Revenue (8%)</div>
          <div className="mt-2 text-2xl font-bold text-indigo-900">
            ${monthStats.totalFeeEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Retained management fee
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Guaranteed Landlord Transfers</div>
          <div className="mt-2 text-2xl font-bold text-emerald-900">
            ${monthStats.totalPayoutsDispatched.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Wired to owners on set dates
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Pending / Queued Payouts</div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">
            ${monthStats.totalPayoutsQueued.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Auto-disbursing on landlord cycle date
          </div>
        </div>

      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100/80 rounded-lg w-fit overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Portfolios ({rentRecords.filter(r => r.month === selectedMonth).length})
          </button>

          <button
            onClick={() => setStatusFilter('needs_payout')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'needs_payout'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Ready for Payout ({rentRecords.filter(r => r.month === selectedMonth && r.rentStatus === 'paid' && r.payoutStatus !== 'completed').length})
          </button>

          <button
            onClick={() => setStatusFilter('pending_rent')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'pending_rent'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Awaiting Tenant ({rentRecords.filter(r => r.month === selectedMonth && r.rentStatus !== 'paid').length})
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              statusFilter === 'completed'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Completed ({rentRecords.filter(r => r.month === selectedMonth && r.payoutStatus === 'completed').length})
          </button>
        </div>

        {searchQuery && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Filtering by "{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-700 hover:underline font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Main Rent & Payout Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Property & Unit</th>
                <th className="py-3.5 px-4">Tenant</th>
                <th className="py-3.5 px-4">Owner & Settlement Date</th>
                <th className="py-3.5 px-4 text-right">Gross Rent</th>
                <th className="py-3.5 px-4 text-right">Fee (8%)</th>
                <th className="py-3.5 px-4 text-right">Net Payout</th>
                <th className="py-3.5 px-4 text-center">Rent Status</th>
                <th className="py-3.5 px-4 text-center">Owner Payout</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-400">
                    <Building className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium text-zinc-600">No rent records found for this filter</p>
                    <p className="text-xs text-zinc-400 mt-1">Try switching tabs or resetting the search query.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const isRentPaid = record.rentStatus === 'paid';
                  const isPayoutCompleted = record.payoutStatus === 'completed';

                  return (
                    <tr key={record.id} className="hover:bg-zinc-50/70 transition-colors">
                      
                      {/* Property & Unit */}
                      <td className="py-4 px-4 font-medium text-zinc-900">
                        <div>{record.propertyName}</div>
                        <div className="text-xs text-zinc-500 font-normal">{record.unitNumber}</div>
                      </td>

                      {/* Tenant */}
                      <td className="py-4 px-4 text-zinc-700">
                        <div className="font-medium text-zinc-900">{record.tenantName}</div>
                        <div className="text-xs text-zinc-500">
                          {isRentPaid ? `Paid on ${record.rentPaidDate || '1st'}` : 'Awaiting payment'}
                        </div>
                      </td>

                      {/* Owner & Guaranteed Date */}
                      <td className="py-4 px-4 text-zinc-700">
                        <div className="font-medium text-zinc-900">{record.ownerName}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          <span>Guaranteed every <strong>{record.guaranteedPayoutDay}th</strong></span>
                        </div>
                      </td>

                      {/* Gross Rent */}
                      <td className="py-4 px-4 text-right font-semibold text-zinc-900">
                        ${record.rentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Management Fee */}
                      <td className="py-4 px-4 text-right text-xs text-zinc-600">
                        <span className="text-indigo-700 font-medium">
                          ${record.managementFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        {record.maintenanceDeductions > 0 && (
                          <div className="text-[11px] text-amber-700">
                            -${record.maintenanceDeductions} repair
                          </div>
                        )}
                      </td>

                      {/* Net Owner Payout */}
                      <td className="py-4 px-4 text-right font-bold text-zinc-900">
                        ${record.netOwnerPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Rent Collection Status */}
                      <td className="py-4 px-4 text-center">
                        {isRentPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Collected
                          </span>
                        ) : (
                          <button
                            onClick={() => recordRentPaid(record.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                          >
                            <Clock className="w-3 h-3" /> Mark Paid
                          </button>
                        )}
                      </td>

                      {/* Owner Payout Status */}
                      <td className="py-4 px-4 text-center">
                        {isPayoutCompleted ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Dispatched
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-0.5">{record.payoutCompletedDate}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => executeOwnerPayout(record.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-2xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>Wired on {record.guaranteedPayoutDay}th</span>
                          </button>
                        )}
                      </td>

                      {/* Action: Statement */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => onOpenOwnerStatement(record)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Statement</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="bg-zinc-50 px-4 py-3 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-zinc-500 gap-2">
          <div>
            Showing <strong>{filteredRecords.length}</strong> rental accounts for <strong>{selectedMonth}</strong>
          </div>
          <div className="flex items-center gap-4">
            <span>Standard Manager Fee: <strong>8.0%</strong></span>
            <span>ACH Settlement Protocol: <strong>Guaranteed Same-Day</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};
