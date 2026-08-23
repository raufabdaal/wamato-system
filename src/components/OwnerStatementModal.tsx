import React, { useState } from 'react';
import { RentRecord } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  Send, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  DollarSign,
  Calendar,
  CreditCard
} from 'lucide-react';

interface OwnerStatementModalProps {
  record: RentRecord | null;
  onClose: () => void;
}

export const OwnerStatementModal: React.FC<OwnerStatementModalProps> = ({ record, onClose }) => {
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!record) return null;

  const handleSendStatement = () => {
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6 relative my-8">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900">EstateFlow Property Management</div>
              <div className="text-[11px] text-zinc-500">Official Owner Settlement Statement</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Print Statement"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statement Content */}
        <div className="space-y-6 print:m-0" id="printable-statement">
          
          {/* Header metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                Guaranteed Payout Settlement
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-2">
                Monthly Landlord Settlement
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Billing Period: <strong>{record.month}</strong></p>
            </div>

            <div className="text-left sm:text-right text-xs text-zinc-600 space-y-0.5">
              <div>Statement ID: <strong className="text-zinc-900 font-mono">STM-{record.id.toUpperCase()}</strong></div>
              <div>Issue Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Status: <span className="font-semibold text-emerald-700 uppercase">{record.payoutStatus}</span></div>
            </div>
          </div>

          {/* Owner & Property Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Property Beneficiary (Owner)</div>
              <div className="font-bold text-sm text-zinc-900 mt-1">{record.ownerName}</div>
              <div className="text-zinc-600 mt-0.5">{record.ownerEmail}</div>
              <div className="text-zinc-600">{record.ownerPhone}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Managed Rental Property</div>
              <div className="font-bold text-sm text-zinc-900 mt-1">{record.propertyName}</div>
              <div className="text-zinc-600 mt-0.5">{record.unitNumber}</div>
              <div className="text-zinc-500 mt-0.5">Tenant: {record.tenantName}</div>
            </div>
          </div>

          {/* Financial Itemization Table */}
          <div className="rounded-xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Rate / Terms</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="py-3 px-4">
                    <strong className="text-zinc-900 block">Gross Monthly Rent Collected</strong>
                    <span className="text-zinc-500 text-[11px]">Tenant rent payment for {record.month}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-zinc-600">100%</td>
                  <td className="py-3 px-4 text-right font-semibold text-zinc-900">
                    +${record.rentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4">
                    <strong className="text-zinc-900 block">Management Service Fee</strong>
                    <span className="text-zinc-500 text-[11px]">Full maintenance, tenant care & rent collection guarantee</span>
                  </td>
                  <td className="py-3 px-4 text-center text-zinc-600 font-medium text-indigo-700">
                    {record.managementFeePercent}%
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-indigo-900">
                    -${record.managementFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>

                {record.maintenanceDeductions > 0 && (
                  <tr>
                    <td className="py-3 px-4">
                      <strong className="text-zinc-900 block">Owner-Approved Maintenance Deductions</strong>
                      <span className="text-zinc-500 text-[11px]">Dispatched vendor repairs itemized</span>
                    </td>
                    <td className="py-3 px-4 text-center text-zinc-600">Direct Cost</td>
                    <td className="py-3 px-4 text-right font-medium text-amber-800">
                      -${record.maintenanceDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}

                <tr className="bg-emerald-50/50">
                  <td className="py-3.5 px-4">
                    <strong className="text-emerald-950 font-bold text-sm block">
                      NET GUARANTEED DIRECT DEPOSIT
                    </strong>
                    <span className="text-emerald-800 text-[11px]">
                      Scheduled transfer on the {record.guaranteedPayoutDay}th of the month
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-800">
                    Net Transfer
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-base text-emerald-900">
                    ${record.netOwnerPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transfer & Banking Details Footer */}
          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-600 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Payout Reference: <strong className="text-zinc-900 font-mono">{record.payoutTransactionRef || 'ACH-SCHEDULED'}</strong>
              </span>
            </div>
            <div className="text-zinc-500">
              Guaranteed Date: <strong>{record.guaranteedPayoutDay}th of month</strong>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-100">
          <div className="text-xs text-zinc-500">
            {sentSuccess ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Statement sent directly to owner email & SMS!
              </span>
            ) : (
              <span>Ready for owner verification and automated record keeping.</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSendStatement}
              className="flex-1 sm:flex-none px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Email/SMS to Landlord</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
