import React, { useState } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { X, DollarSign, CheckCircle2, Calendar, CreditCard } from 'lucide-react';

interface RecordRentModalProps {
  onClose: () => void;
}

export const RecordRentModal: React.FC<RecordRentModalProps> = ({ onClose }) => {
  const { rentRecords, recordRentPaid } = usePropertyManager();
  
  // Find unpaid records first
  const pendingRecords = rentRecords.filter(r => r.rentStatus !== 'paid');
  const [selectedRecordId, setSelectedRecordId] = useState(
    pendingRecords[0]?.id || rentRecords[0]?.id || ''
  );
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('ACH Auto-Debit');

  const selectedRecord = rentRecords.find(r => r.id === selectedRecordId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId) return;

    recordRentPaid(selectedRecordId, paymentDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4 my-8">
        
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900">Record Rent Payment</h3>
              <p className="text-xs text-zinc-500">Mark tenant rent collected and update payout ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Select Rental Account</label>
            <select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="w-full p-2.5 border border-zinc-200 rounded-lg bg-zinc-50 font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              {rentRecords.map(r => (
                <option key={r.id} value={r.id}>
                  {r.propertyName} ({r.unitNumber}) - {r.tenantName} [${r.rentAmount}] {r.rentStatus === 'paid' ? '(Already Paid)' : '(Pending)'}
                </option>
              ))}
            </select>
          </div>

          {selectedRecord && (
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Gross Rent:</span>
                <strong className="text-zinc-900">${selectedRecord.rentAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Management Cut (8%):</span>
                <strong className="text-indigo-700">${selectedRecord.managementFeeAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-zinc-200">
                <span className="text-zinc-700 font-semibold">Net Owner Payout:</span>
                <strong className="text-emerald-700 font-bold">${selectedRecord.netOwnerPayout.toLocaleString()}</strong>
              </div>
              <div className="text-[11px] text-zinc-500 pt-1">
                Guaranteed Payout Date: <strong>{selectedRecord.guaranteedPayoutDay}th of month</strong> (Landlord: {selectedRecord.ownerName})
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Payment Received Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="ACH Auto-Debit">ACH Bank Transfer</option>
                <option value="Online Portal">Online Tenant Portal</option>
                <option value="Zelle / Wire">Zelle / Direct Wire</option>
                <option value="Check">Physical Check / Cashiers</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Payment</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
