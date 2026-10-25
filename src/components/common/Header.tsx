import React, { useState } from 'react';
import {
  LogOut,
  Database,
  Wifi,
  WifiOff,
  UserCheck,
  ChevronDown,
  GitBranch,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { ROLES, UserRole } from '../../types/greenhouse';
import { AromaFlowersLogo } from './AromaFlowersLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { DataManagementModal } from './DataManagementModal';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    activeView,
    setActiveView,
    isOnline,
    demoDataCleared,
  } = useGreenhouse();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

  const currentRoleConfig = ROLES.find((r) => r.id === activeRole);

  const handleLogout = () => {
    setActiveRole(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo & System Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('principal')}
              className="flex items-center gap-2.5 hover:opacity-90 transition text-left group"
              title="Aroma Flowers - Inicio"
            >
              <AromaFlowersLogo size="md" className="group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                  Aroma <span className="text-emerald-600">Flowers</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-emerald-800 uppercase mt-0.5">
                  Invernadero Florícola
                </span>
              </div>
            </button>

            {/* Workflow Quick Link button */}
            <button
              onClick={() => setActiveView(activeView === 'workflow' ? 'principal' : 'workflow')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                activeView === 'workflow'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
              <span>Flujo Integral</span>
            </button>
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline status */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${
                isOnline ? 'text-emerald-700 bg-emerald-50' : 'text-amber-800 bg-amber-100 animate-pulse'
              }`}
              title={isOnline ? 'Conexión activa' : 'Modo Offline (Los registros se guardan localmente)'}
            >
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
              <span className="hidden sm:inline">{isOnline ? 'En Línea' : 'Offline'}</span>
            </div>

            {/* Data Management / Supabase Trigger */}
            <button
              onClick={() => setShowDataModal(true)}
              className={`relative flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${
                demoDataCleared
                  ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title="Borrar datos de prueba / Conectar Supabase"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Datos & DB</span>
              {!demoDataCleared && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5" />
              )}
            </button>

            {/* Quick PWA Install Button */}
            <PWAInstallButton compact />

            {/* Active Role Selector / Badge */}
            {currentRoleConfig && (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition border border-slate-200/70"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="max-w-[110px] sm:max-w-[150px] truncate text-left">
                    {currentRoleConfig.shortTitle}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showRoleDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowRoleDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs">
                      <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                        Cambiar Rol Activo
                      </div>
                      {ROLES.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => {
                            setActiveRole(role.id as UserRole);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 transition ${
                            activeRole === role.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <span className="truncate">{role.title}</span>
                          {activeRole === role.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Unified Logout Button */}
            <button
              onClick={handleLogout}
              title="Cerrar sesión y volver al selector de roles"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200/60 active:scale-95 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal for Data Management */}
      <DataManagementModal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
      />
    </>
  );
};
