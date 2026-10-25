import React, { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Building2,
  Settings,
  Sprout,
  Flower2,
  TrendingUp,
  Tablet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Droplet,
  ShieldAlert,
  Boxes,
  Users,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { ROLES, UserRole } from '../../types/greenhouse';

export const Sidebar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    activeView,
    setActiveView,
  } = useGreenhouse();

  const [collapsed, setCollapsed] = useState(false);

  const getRoleSpecificMenuItems = () => {
    switch (activeRole) {
      case 'director':
        return [
          { id: 'principal', label: 'Panel Dirección (KPIs)', icon: LayoutDashboard },
          { id: 'finanzas', label: 'Finanzas & Cuentas', icon: Wallet },
          { id: 'costos', label: 'Costos & Rentabilidad', icon: TrendingUp },
          { id: 'reportes', label: 'Reportes & Auditoría', icon: Building2 },
        ];
      case 'operaciones':
        return [
          { id: 'principal', label: 'Módulos de Producción', icon: Building2 },
          { id: 'personal', label: 'Personal & Nómina', icon: Users },
          { id: 'almacen', label: 'Compras & Almacén', icon: Boxes },
          { id: 'activos', label: 'Activos & Mantenimiento', icon: Settings },
        ];
      case 'agronomo':
        return [
          { id: 'principal', label: 'Labores Culturales', icon: Sprout },
          { id: 'riego', label: 'Riego & Fertirrigación', icon: Droplet },
          { id: 'sanidad', label: 'Monitoreo Fitosanitario', icon: ShieldAlert },
        ];
      case 'cosecha':
        return [
          { id: 'principal', label: 'Corte Diario', icon: Flower2 },
          { id: 'clasificacion', label: 'Clasificación & Empaque', icon: Boxes },
          { id: 'camara', label: 'Cámara Fría & Trazabilidad', icon: Sparkles },
        ];
      case 'ventas':
        return [
          { id: 'principal', label: 'Pedidos & Facturación', icon: TrendingUp },
          { id: 'clientes', label: 'Clientes & Canales', icon: Users },
          { id: 'cobranza', label: 'Cobranza & Cuentas x Cobrar', icon: Wallet },
        ];
      case 'sistema':
        return [
          { id: 'principal', label: 'Captura Ágil Campo', icon: Tablet },
          { id: 'offline', label: 'Sincronización Offline', icon: GitBranch },
          { id: 'auditoria', label: 'Auditoría & Usuarios', icon: Settings },
        ];
      default:
        return [{ id: 'principal', label: 'Inicio', icon: LayoutDashboard }];
    }
  };

  const menuItems = getRoleSpecificMenuItems();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      } shrink-0`}
    >
      {/* Sidebar Header toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Navegación de Rol
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-auto"
          title={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Role specific links */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          {!collapsed && 'Módulos Activos'}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Global Workflow Pipeline link */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            {!collapsed && 'Flujo Operativo'}
          </div>
          <button
            onClick={() => setActiveView('workflow')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeView === 'workflow'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="Flujo de Trabajo Integral"
          >
            <GitBranch className="w-5 h-5 text-emerald-400 shrink-0" />
            {!collapsed && <span className="truncate">Flujo Integral (6 Etapas)</span>}
          </button>
        </div>

        {/* Quick Switch Roles list in sidebar */}
        {!collapsed && (
          <div className="pt-4 border-t border-slate-800 mt-4 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
              Cambio de Rol Rápido
            </div>
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id as UserRole);
                  setActiveView('principal');
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs truncate transition flex items-center justify-between ${
                  activeRole === r.id
                    ? 'text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="truncate">{r.shortTitle}</span>
                {activeRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => setActiveRole(null)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
