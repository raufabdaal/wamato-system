import React, { useState } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { Property, Unit } from '../types';
import { X, Building2, User, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

interface AddPropertyModalProps {
  onClose: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onClose }) => {
  const { addProperty } = usePropertyManager();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Austin');
  const [state, setState] = useState('TX');
  const [zip, setZip] = useState('78701');
  const [type, setType] = useState<Property['type']>('Single Family');
  
  // Owner info
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [bankEnding, setBankEnding] = useState('');
  const [guaranteedPayoutDay, setGuaranteedPayoutDay] = useState(5);
  const [managementFeePercent, setManagementFeePercent] = useState(8);

  // Initial unit
  const [unitNumber, setUnitNumber] = useState('Main Residence');
  const [rent, setRent] = useState(3500);
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState(2100);
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !ownerName.trim()) return;

    const unit: Unit = {
      id: `u-${Date.now()}`,
      unitNumber,
      bedrooms: Number(beds) || 2,
      bathrooms: Number(baths) || 2,
      sqft: Number(sqft) || 1500,
      currentRent: Number(rent) || 2000,
      status: tenantName ? 'occupied' : 'vacant',
      tenant: tenantName ? {
        name: tenantName,
        email: tenantEmail || 'tenant@email.com',
        phone: tenantPhone || '(512) 555-0000',
        leaseStart: '2026-01-01',
        leaseEnd: '2026-12-31',
      } : undefined,
    };

    addProperty({
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      type,
      totalUnits: 1,
      units: [unit],
      owner: {
        id: `own-${Date.now()}`,
        name: ownerName.trim(),
        email: ownerEmail.trim() || 'owner@example.com',
        phone: ownerPhone.trim() || '(512) 555-0100',
        bankAccountEnding: bankEnding.trim() || '9901',
        guaranteedPayoutDay: Number(guaranteedPayoutDay) || 5,
        managementFeePercent: Number(managementFeePercent) || 8,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 space-y-4 my-8">
        
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900">Add Managed Property</h3>
              <p className="text-xs text-zinc-500">Onboard an estate or rental with owner payout terms</p>
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
          
          {/* Section 1: Property Details */}
          <div className="space-y-2.5">
            <div className="font-semibold text-zinc-800 uppercase tracking-wider text-[11px]">
              1. Property Identification
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-zinc-700 block mb-1">Estate / Property Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Westlake Summit Villa"
                  required
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="Single Family">Single Family</option>
                  <option value="Multi Family">Multi Family</option>
                  <option value="Luxury Estate">Luxury Estate</option>
                  <option value="Townhome">Townhome</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-zinc-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 5200 Westlake Dr"
                  required
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">City, State Zip</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-1/2 p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900"
                  />
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="Zip"
                    className="w-1/2 p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Owner & Payout Agreement */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100">
            <div className="font-semibold text-zinc-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. Landlord & Guaranteed Payout Agreement</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Jonathan Bradley"
                  required
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Guaranteed Payout Day</label>
                <select
                  value={guaranteedPayoutDay}
                  onChange={(e) => setGuaranteedPayoutDay(Number(e.target.value))}
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value={1}>1st of each month</option>
                  <option value={5}>5th of each month (Standard)</option>
                  <option value={10}>10th of each month</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Management Cut (%)</label>
                <input
                  type="number"
                  value={managementFeePercent}
                  onChange={(e) => setManagementFeePercent(Number(e.target.value))}
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 font-semibold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Owner Email / Phone</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@investments.com"
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Direct Deposit Bank Ending</label>
                <input
                  type="text"
                  maxLength={4}
                  value={bankEnding}
                  onChange={(e) => setBankEnding(e.target.value)}
                  placeholder="e.g. 7412"
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Unit & Tenant */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100">
            <div className="font-semibold text-zinc-800 uppercase tracking-wider text-[11px]">
              3. Unit & Current Rent
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Unit Label</label>
                <input
                  type="text"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Monthly Rent ($)</label>
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Current Tenant Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Leave empty if vacant"
                  className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900"
                />
              </div>
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
              className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              Save & Activate Management
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
