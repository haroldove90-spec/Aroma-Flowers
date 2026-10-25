import React from 'react';
import { ROLES, UserRole } from '../../types/greenhouse';
import { AromaFlowersLogo } from '../common/AromaFlowersLogo';
import { useGreenhouse } from '../../context/GreenhouseContext';

export const RoleSelector: React.FC = () => {
  const { setActiveRole, setActiveView } = useGreenhouse();

  const handleSelectRole = (roleId: UserRole) => {
    setActiveRole(roleId);
    setActiveView('principal');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl">
        {/* 
          Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio.
          Selector limpio con tarjetas independientes para cada rol.
          Sin header, sin descripciones, solo nombre del rol y el logo del sistema sin encapsular.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => handleSelectRole(role.id)}
              className="group relative flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/80 active:scale-98 transition-all duration-200 min-h-[200px] sm:min-h-[230px] cursor-pointer"
            >
              {/* Logo del sistema sin encapsular (pure vector mark on card surface) */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AromaFlowersLogo size="custom" className="w-full h-full" unencapsulated />
              </div>

              {/* Solo nombre del rol */}
              <h2 className="mt-4 text-xs sm:text-sm md:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                {role.title}
              </h2>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
