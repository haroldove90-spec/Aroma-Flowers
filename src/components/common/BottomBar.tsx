import React from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Wallet,
  TrendingUp,
  Building2,
  Users,
  Boxes,
  Sprout,
  Droplet,
  ShieldAlert,
  Flower2,
  Sparkles,
  Tablet,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';

export const BottomBar: React.FC = () => {
  const { activeRole, activeView, setActiveView } = useGreenhouse();

  // Bottom navigation items according to current role
  const getBottomItems = () => {
    switch (activeRole) {
      case 'director':
        return [
          { id: 'principal', label: 'KPIs', icon: LayoutDashboard },
          { id: 'finanzas', label: 'Finanzas', icon: Wallet },
          { id: 'costos', label: 'Costos', icon: TrendingUp },
          { id: 'workflow', label: 'Flujo', icon: GitBranch },
        ];
      case 'operaciones':
        return [
          { id: 'principal', label: 'Módulos', icon: Building2 },
          { id: 'personal', label: 'Personal', icon: Users },
          { id: 'almacen', label: 'Almacén', icon: Boxes },
          { id: 'workflow', label: 'Flujo', icon: GitBranch },
        ];
      case 'agronomo':
        return [
          { id: 'principal', label: 'Labores', icon: Sprout },
          { id: 'riego', label: 'Riego/CE', icon: Droplet },
          { id: 'sanidad', label: 'Sanidad', icon: ShieldAlert },
          { id: 'workflow', label: 'Flujo', icon: GitBranch },
        ];
      case 'cosecha':
        return [
          { id: 'principal', label: 'Corte', icon: Flower2 },
          { id: 'clasificacion', label: 'Empaque', icon: Boxes },
          { id: 'camara', label: 'Cámara', icon: Sparkles },
          { id: 'workflow', label: 'Flujo', icon: GitBranch },
        ];
      case 'ventas':
        return [
          { id: 'principal', label: 'Pedidos', icon: TrendingUp },
          { id: 'clientes', label: 'Clientes', icon: Users },
          { id: 'cobranza', label: 'Cobranza', icon: Wallet },
          { id: 'workflow', label: 'Flujo', icon: GitBranch },
        ];
      case 'sistema':
        return [
          { id: 'principal', label: 'Campo', icon: Tablet },
          { id: 'offline', label: 'Offline', icon: GitBranch },
          { id: 'auditoria', label: 'Auditoría', icon: LayoutDashboard },
        ];
      default:
        return [
          { id: 'principal', label: 'Inicio', icon: LayoutDashboard },
          { id: 'workflow', label: 'Flujo', icon: GitBranch },
        ];
    }
  };

  const items = getBottomItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around safe-bottom">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 min-w-[60px] ${
              isActive
                ? 'text-emerald-700 font-bold bg-emerald-50/80 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-emerald-600' : 'stroke-[1.75px]'}`} />
            <span className="text-[11px] mt-1 tracking-tight leading-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
