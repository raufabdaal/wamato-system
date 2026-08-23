import React, { useState } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { Property, RentRecord } from '../types';
import { 
  Building2, 
  Plus, 
  User, 
  Calendar, 
  DollarSign, 
  Home, 
  ShieldCheck, 
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PropertiesTabProps {
  onOpenAddProperty: () => void;
  onOpenOwnerStatement: (record: RentRecord) => void;
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({
  onOpenAddProperty,
  onOpenOwnerStatement,
}) => {
  const { properties, rentRecords } = usePropertyManager();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Managed Properties & Estates ({properties.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Owner settlement terms, unit occupancy, and active tenant lease agreements
          </p>
        </div>

        <button
          onClick={onOpenAddProperty}
          className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Main Grid: Properties List + Selected Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Columns: Property Cards */}
        <div className="lg:col-span-5 space-y-3">
          {properties.map((prop) => {
            const isSelected = prop.id === selectedProperty?.id;
            const totalRent = prop.units.reduce((acc, u) => acc + u.currentRent, 0);
            const occupiedCount = prop.units.filter(u => u.status === 'occupied').length;

            return (
              <div
                key={prop.id}
                onClick={() => setSelectedPropertyId(prop.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-white border-zinc-900 ring-2 ring-zinc-900/10'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-sm sm:text-base">{prop.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{prop.address}, {prop.city}, {prop.state} {prop.zip}</p>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                    {prop.type}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-zinc-400 text-[10px] uppercase font-semibold">Total Rent</div>
                    <div className="font-bold text-zinc-900 mt-0.5">${totalRent.toLocaleString()}/mo</div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px] uppercase font-semibold">Occupancy</div>
                    <div className="font-semibold text-emerald-700 mt-0.5">
                      {occupiedCount} / {prop.totalUnits} Units
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px] uppercase font-semibold">Payout Date</div>
                    <div className="font-semibold text-zinc-800 mt-0.5">
                      {prop.owner.guaranteedPayoutDay}th of month
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Columns: Deep Dive into Selected Property */}
        {selectedProperty && (
          <div className="lg:col-span-7 space-y-4">
            
            {/* Property Overview Card */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Active Full Management
                  </span>
                  <h2 className="text-xl font-bold text-zinc-900 mt-2">{selectedProperty.name}</h2>
                  <p className="text-xs text-zinc-500">{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}</p>
                </div>
              </div>

              {/* Owner Agreement Terms Box */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                <div className="text-xs font-semibold text-zinc-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Landlord & Payout Agreement</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Owner Name:</span>
                    <strong className="text-zinc-900 font-semibold">{selectedProperty.owner.name}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Guaranteed Payout Date:</span>
                    <strong className="text-emerald-700 font-semibold">
                      Every {selectedProperty.owner.guaranteedPayoutDay}th of the month
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Management Fee Take:</span>
                    <strong className="text-zinc-900 font-semibold">
                      {selectedProperty.owner.managementFeePercent}% of collected gross rent
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Direct Deposit Account:</span>
                    <strong className="text-zinc-800 font-medium">
                      Bank Ending ••••{selectedProperty.owner.bankAccountEnding}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
                  <span>Contact: {selectedProperty.owner.email}</span>
                  <span>{selectedProperty.owner.phone}</span>
                </div>
              </div>

              {/* Units Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                  Units in this Property ({selectedProperty.units.length})
                </div>

                <div className="space-y-2.5">
                  {selectedProperty.units.map(unit => {
                    const isOccupied = unit.status === 'occupied';

                    return (
                      <div
                        key={unit.id}
                        className="p-3.5 rounded-lg border border-zinc-200 bg-white space-y-2 hover:border-zinc-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-zinc-400" />
                            <span className="font-semibold text-sm text-zinc-900">{unit.unitNumber}</span>
                            <span className="text-xs text-zinc-400">
                              ({unit.bedrooms} bd / {unit.bathrooms} ba • {unit.sqft} sqft)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-900">
                              ${unit.currentRent.toLocaleString()}/mo
                            </span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                              isOccupied
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {isOccupied ? 'Occupied' : 'Vacant'}
                            </span>
                          </div>
                        </div>

                        {unit.tenant ? (
                          <div className="p-2.5 bg-zinc-50 rounded-md text-xs text-zinc-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <div>
                              Tenant: <strong className="text-zinc-900">{unit.tenant.name}</strong>
                              <span className="text-zinc-400 ml-1">({unit.tenant.phone})</span>
                            </div>
                            <div className="text-zinc-500">
                              Lease: {unit.tenant.leaseStart} to {unit.tenant.leaseEnd}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2 bg-amber-50/50 rounded-md text-xs text-amber-800 flex items-center justify-between">
                            <span>Ready for prospective tenant showings</span>
                            <button className="font-semibold text-amber-900 underline">Add Lease</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
