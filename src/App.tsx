import React from 'react';
import { GreenhouseProvider, useGreenhouse } from './context/GreenhouseContext';
import { RoleSelector } from './components/roles/RoleSelector';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomBar } from './components/common/BottomBar';
import { WorkflowView } from './components/workflow/WorkflowView';
import { DirectorView } from './components/director/DirectorView';
import { OperationsView } from './components/operations/OperationsView';
import { AgronomyView } from './components/agronomy/AgronomyView';
import { HarvestView } from './components/harvest/HarvestView';
import { SalesView } from './components/sales/SalesView';
import { SystemView } from './components/system/SystemView';

const MainAppLayout: React.FC = () => {
  const { activeRole, activeView, isOnline } = useGreenhouse();

  // If no active role is selected, show the clean Role Selector on Home
  // (Cuadrícula 2 col móvil / 4 col escritorio, sin header, sin descripciones, logo sin encapsular)
  if (!activeRole) {
    return <RoleSelector />;
  }

  // Render current active module view
  const renderRoleView = () => {
    if (activeView === 'workflow') {
      return <WorkflowView />;
    }

    switch (activeRole) {
      case 'director':
        return <DirectorView />;
      case 'operaciones':
        return <OperationsView />;
      case 'agronomo':
        return <AgronomyView />;
      case 'cosecha':
        return <HarvestView />;
      case 'ventas':
        return <SalesView />;
      case 'sistema':
        return <SystemView />;
      default:
        return <DirectorView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Unified Institutional Header */}
      <Header />

      {/* Offline Toast Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center shadow-inner flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Modo Sin Conexión — Los registros se guardan localmente y se sincronizarán al recuperar señal.</span>
        </div>
      )}

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar />

        {/* Dynamic Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderRoleView()}
          </div>
        </main>
      </div>

      {/* Mobile & Tablet Fixed Bottom Bar */}
      <BottomBar />
    </div>
  );
};

export default function App() {
  return (
    <GreenhouseProvider>
      <MainAppLayout />
    </GreenhouseProvider>
  );
}
