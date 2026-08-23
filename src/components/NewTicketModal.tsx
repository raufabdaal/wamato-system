import React, { useState } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { TicketPriority, MaintenanceTicket } from '../types';
import { X, Wrench, AlertTriangle, Building, User } from 'lucide-react';

interface NewTicketModalProps {
  onClose: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ onClose }) => {
  const { properties, addTicket } = usePropertyManager();

  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const [unitNumber, setUnitNumber] = useState(selectedProperty?.units[0]?.unitNumber || 'Main Residence');
  const [tenantName, setTenantName] = useState(selectedProperty?.units[0]?.tenant?.name || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceTicket['category']>('plumbing');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assignedVendor, setAssignedVendor] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(150);
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');

  const handlePropertyChange = (propId: string) => {
    setSelectedPropertyId(propId);
    const prop = properties.find(p => p.id === propId);
    if (prop && prop.units.length > 0) {
      setUnitNumber(prop.units[0].unitNumber);
      setTenantName(prop.units[0].tenant?.name || 'Direct Owner / Prep');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addTicket({
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      unitNumber,
      tenantName: tenantName || 'Tenant',
      title: title.trim(),
      category,
      description: description.trim(),
      priority,
      status: 'new',
      assignedVendor: assignedVendor.trim() || undefined,
      estimatedCost: Number(estimatedCost) || 0,
      scheduledDate: scheduledDate || undefined,
      chargeTo: 'owner',
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4 my-8">
        
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900">Log Maintenance Ticket</h3>
              <p className="text-xs text-zinc-500">Record a tenant repair request or routine estate service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Property Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Rental Property</label>
              <select
                value={selectedPropertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Unit Number</label>
              <input
                type="text"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                required
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Tenant Name */}
          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Reported By (Tenant / Staff)</label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="e.g. Marcus Sterling"
              required
              className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Issue Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-zinc-700 block mb-1">Issue Summary / Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Water heater pilot light not igniting"
                required
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="plumbing">Plumbing</option>
                <option value="hvac">HVAC / Heat</option>
                <option value="appliance">Appliance</option>
                <option value="electrical">Electrical</option>
                <option value="structural">Structural</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Detailed Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe symptoms, location in house, tenant notes..."
              required
              className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Priority & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="low">Low (Routine)</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent / Emergency</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Assigned Vendor</label>
              <input
                type="text"
                value={assignedVendor}
                onChange={(e) => setAssignedVendor(e.target.value)}
                placeholder="e.g. Austin Quick Plumbing"
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Estimated Cost ($)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Dispatch Notes */}
          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Access Notes / Gate Codes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Gate code #4821, key lockbox on rear porch"
              className="w-full p-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
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
              Log Ticket & Dispatch
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
