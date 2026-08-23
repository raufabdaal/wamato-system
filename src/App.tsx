import React, { useState } from 'react';
import { PropertyProvider, usePropertyManager } from './context/PropertyContext';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { RentPayoutsTab } from './components/RentPayoutsTab';
import { MaintenanceTab } from './components/MaintenanceTab';
import { CommunicationsTab } from './components/CommunicationsTab';
import { PropertiesTab } from './components/PropertiesTab';
import { OwnerStatementModal } from './components/OwnerStatementModal';
import { NewTicketModal } from './components/NewTicketModal';
import { RecordRentModal } from './components/RecordRentModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { RentRecord } from './types';

const DashboardContent: React.FC = () => {
  const { activeTab } = usePropertyManager();
  
  // Modals state
  const [selectedStatementRecord, setSelectedStatementRecord] = useState<RentRecord | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showRecordRentModal, setShowRecordRentModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation Header */}
      <Navbar
        onOpenNewTicket={() => setShowNewTicketModal(true)}
        onOpenRecordRent={() => setShowRecordRentModal(true)}
        onOpenAddProperty={() => setShowAddPropertyModal(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <OverviewTab
            onOpenNewTicket={() => setShowNewTicketModal(true)}
            onOpenRecordRent={() => setShowRecordRentModal(true)}
            onOpenOwnerStatement={(record) => setSelectedStatementRecord(record)}
          />
        )}

        {activeTab === 'rent' && (
          <RentPayoutsTab
            onOpenRecordRent={() => setShowRecordRentModal(true)}
            onOpenOwnerStatement={(record) => setSelectedStatementRecord(record)}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceTab
            onOpenNewTicket={() => setShowNewTicketModal(true)}
          />
        )}

        {activeTab === 'communications' && (
          <CommunicationsTab />
        )}

        {activeTab === 'properties' && (
          <PropertiesTab
            onOpenAddProperty={() => setShowAddPropertyModal(true)}
            onOpenOwnerStatement={(record) => setSelectedStatementRecord(record)}
          />
        )}
      </main>

      {/* Modals */}
      {selectedStatementRecord && (
        <OwnerStatementModal
          record={selectedStatementRecord}
          onClose={() => setSelectedStatementRecord(null)}
        />
      )}

      {showNewTicketModal && (
        <NewTicketModal
          onClose={() => setShowNewTicketModal(false)}
        />
      )}

      {showRecordRentModal && (
        <RecordRentModal
          onClose={() => setShowRecordRentModal(false)}
        />
      )}

      {showAddPropertyModal && (
        <AddPropertyModal
          onClose={() => setShowAddPropertyModal(false)}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <PropertyProvider>
      <DashboardContent />
    </PropertyProvider>
  );
}
