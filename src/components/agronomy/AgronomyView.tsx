import React, { useState } from 'react';
import {
  Sprout,
  Droplet,
  ShieldAlert,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Calendar,
  Clock,
  Layers,
  FlaskConical,
  Flame,
  Camera,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { CulturalTask, IrrigationLog, PestMonitoring, PhytosanitaryApplication } from '../../types/greenhouse';

export const AgronomyView: React.FC = () => {
  const {
    activeView,
    modules,
    tasks,
    irrigation,
    pestMonitoring,
    applications,
    addTask,
    updateTask,
    addIrrigation,
    addPestMonitoring,
    addApplication,
  } = useGreenhouse();

  const [tab, setTab] = useState<'labores' | 'riego' | 'sanidad'>(
    activeView === 'riego' ? 'riego' : activeView === 'sanidad' ? 'sanidad' : 'labores'
  );

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showIrrigationModal, setShowIrrigationModal] = useState(false);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);

  // Task form
  const [taskModule, setTaskModule] = useState(modules[0]?.code || 'M-01');
  const [taskType, setTaskType] = useState<CulturalTask['taskType']>('tutoreo');
  const [taskName, setTaskName] = useState('');
  const [taskTeam, setTaskTeam] = useState('Cuadrilla A');
  const [taskBeds, setTaskBeds] = useState('38');

  // Irrigation form
  const [irgModule, setIrgModule] = useState(modules[0]?.code || 'M-01');
  const [irgVolume, setIrgVolume] = useState('14.0');
  const [irgDuration, setIrgDuration] = useState('45');
  const [irgPhIn, setIrgPhIn] = useState('5.8');
  const [irgPhOut, setIrgPhOut] = useState('6.2');
  const [irgEcIn, setIrgEcIn] = useState('1.65');
  const [irgEcOut, setIrgEcOut] = useState('1.95');
  const [irgTensiometer, setIrgTensiometer] = useState('18');
  const [irgTankA, setIrgTankA] = useState('Nitrato de Calcio (40kg) + Fe-EDDHA (1kg)');
  const [irgTankB, setIrgTankB] = useState('Fosfato Monopotásico (18kg) + Sulfato de Mg (22kg)');

  // Monitoring form
  const [monModule, setMonModule] = useState(modules[0]?.code || 'M-01');
  const [monPest, setMonPest] = useState<PestMonitoring['pestName']>('Araña Roja (Tetranychus)');
  const [monSeverity, setMonSeverity] = useState<PestMonitoring['severity']>('media');
  const [monIncidence, setMonIncidence] = useState('7.5');
  const [monNotes, setMonNotes] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: CulturalTask = {
      id: `tsk-${Date.now()}`,
      moduleId: modules.find((m) => m.code === taskModule)?.id || 'mod-1',
      moduleCode: taskModule,
      taskType,
      taskName: taskName.trim() || `Labor de ${taskType} en ${taskModule}`,
      date: new Date().toISOString().slice(0, 10),
      assignedTeam: taskTeam,
      scheduledBeds: parseInt(taskBeds) || 30,
      executedBeds: 0,
      status: 'pendiente',
    };
    addTask(newTask);
    setShowTaskModal(false);
  };

  const handleCreateIrrigation = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: IrrigationLog = {
      id: `irg-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      moduleId: modules.find((m) => m.code === irgModule)?.id || 'mod-1',
      moduleCode: irgModule,
      sector: `Sector ${irgModule.replace('M-0', '')}`,
      volumeM3: parseFloat(irgVolume) || 12,
      durationMinutes: parseInt(irgDuration) || 40,
      phInput: parseFloat(irgPhIn) || 5.8,
      phDrainage: parseFloat(irgPhOut) || 6.2,
      ecInput: parseFloat(irgEcIn) || 1.6,
      ecDrainage: parseFloat(irgEcOut) || 1.9,
      tensiometerCbar: parseInt(irgTensiometer) || 18,
      tankARecipe: irgTankA,
      tankBRecipe: irgTankB,
      operator: 'Mateo Rangel',
    };
    addIrrigation(newLog);
    setShowIrrigationModal(false);
  };

  const handleCreateMonitoring = (e: React.FormEvent) => {
    e.preventDefault();
    const newMon: PestMonitoring = {
      id: `pst-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      moduleId: modules.find((m) => m.code === monModule)?.id || 'mod-1',
      moduleCode: monModule,
      section: 'Camas centrales',
      pestName: monPest,
      severity: monSeverity,
      incidencePercent: parseFloat(monIncidence) || 5,
      status: monSeverity === 'alta' || monSeverity === 'critica' ? 'requiere_aplicacion' : 'vigilancia',
      notes: monNotes || 'Monitoreo de rutina registrado',
    };
    addPestMonitoring(newMon);
    setShowMonitoringModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Agronomy Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Ingeniería Agronómica & Sanidad Vegetal
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Nutrición, Riego y Control Fitosanitario
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoreo agronómico de pH/CE, tensiómetros, labores culturales y recetas
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTab('labores')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'labores' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Labores Culturales ({tasks.length})
          </button>
          <button
            onClick={() => setTab('riego')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'riego' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riego & Tanques A/B ({irrigation.length})
          </button>
          <button
            onClick={() => setTab('sanidad')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'sanidad' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sanidad & Plagas ({pestMonitoring.length})
          </button>
        </div>
      </div>

      {/* Labores Culturales Tab */}
      {tab === 'labores' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Programación y Avance de Labores en Módulos
            </h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Programar Labor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((t) => {
              const progressPct = t.scheduledBeds > 0 ? Math.round((t.executedBeds / t.scheduledBeds) * 100) : 0;
              return (
                <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {t.moduleCode} • {t.taskType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        t.status === 'completado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'en_progreso'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{t.taskName}</h3>
                  <p className="text-[11px] text-slate-500">Asignado: {t.assignedTeam} ({t.date})</p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Camas: {t.executedBeds} / {t.scheduledBeds}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {t.notes && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {t.notes}
                    </p>
                  )}

                  {t.status !== 'completado' && (
                    <button
                      onClick={() =>
                        updateTask({
                          ...t,
                          executedBeds: t.scheduledBeds,
                          status: 'completado',
                        })
                      }
                      className="w-full py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                    >
                      Marcar 100% Completado
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Riego & Fertirrigación Tab */}
      {tab === 'riego' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lecturas de Riego, pH, CE y Tensiómetros
              </h2>
              <p className="text-xs text-slate-500">Monitoreo de gotero vs drenaje y recetas de tanques concentrados</p>
            </div>
            <button
              onClick={() => setShowIrrigationModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Riego</span>
            </button>
          </div>

          <div className="space-y-3">
            {irrigation.map((irg) => (
              <div
                key={irg.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {irg.moduleCode}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{irg.sector}</span>
                    <span className="text-xs text-slate-400">({irg.date} a las {irg.time})</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Volumen: <strong className="text-blue-700">{irg.volumeM3} m³</strong> en {irg.durationMinutes} min
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">pH Entrada / Drenaje</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {irg.phInput} <span className="text-slate-400 font-normal">➔</span> {irg.phDrainage}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">CE Entrada / Drenaje</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {irg.ecInput} <span className="text-slate-400 font-normal">➔</span> {irg.ecDrainage} dS/m
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Tensiómetro Suelo</span>
                    <span className="font-bold text-emerald-800 text-sm">
                      {irg.tensiometerCbar} cbars (Óptimo)
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Operador Cabezal</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">{irg.operator}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p><strong>Tanque A (Calcio / N):</strong> {irg.tankARecipe}</p>
                  <p><strong>Tanque B (Fósforo / K / Mg):</strong> {irg.tankBRecipe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sanidad & Plagas Tab */}
      {tab === 'sanidad' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Monitoreo Fitosanitario & Tratamientos</h2>
              <p className="text-xs text-slate-500">Severidad de plagas, intervalos de reingreso y eficacia</p>
            </div>
            <button
              onClick={() => setShowMonitoringModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Monitoreo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pestMonitoring.map((pm) => (
              <div
                key={pm.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {pm.moduleCode} • {pm.section}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{pm.pestName}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      pm.severity === 'alta' || pm.severity === 'critica'
                        ? 'bg-rose-100 text-rose-800'
                        : pm.severity === 'media'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Severidad: {pm.severity} ({pm.incidencePercent}%)
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {pm.notes}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Fecha: {pm.date}</span>
                  <span className="font-semibold text-emerald-700 capitalize">Estado: {pm.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Programar Labor */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs text-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Programar Labor Cultural
            </h3>
            <form onSubmit={handleCreateTask} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Módulo</label>
                <select
                  value={taskModule}
                  onChange={(e) => setTaskModule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.code}>
                      {m.code} - {m.name} ({m.variety})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Labor</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="tutoreo">Tutoreo / Elevación de mallas</option>
                  <option value="desahije">Desahije / Raleo basal</option>
                  <option value="desbotonado_pinch">Desbotonado (Pinch lateral)</option>
                  <option value="toque_hoja">Toque de hoja / Defoliación</option>
                  <option value="poda">Poda de renovación</option>
                  <option value="desmalezado">Desmalezado manual de pasillos</option>
                  <option value="manejo_cortinas">Manejo de cortinas climáticas</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Descriptivo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Desbotonado lateral en botón principal"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cuadrilla Asignada</label>
                  <input
                    type="text"
                    value={taskTeam}
                    onChange={(e) => setTaskTeam(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Camas Programadas</label>
                  <input
                    type="number"
                    value={taskBeds}
                    onChange={(e) => setTaskBeds(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Riego */}
      {showIrrigationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs text-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Registrar Evento de Fertirrigación
            </h3>
            <form onSubmit={handleCreateIrrigation} className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Módulo</label>
                  <select
                    value={irgModule}
                    onChange={(e) => setIrgModule(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.code}>{m.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Volumen (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={irgVolume}
                    onChange={(e) => setIrgVolume(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={irgDuration}
                    onChange={(e) => setIrgDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">pH Entrada</label>
                  <input
                    type="number"
                    step="0.1"
                    value={irgPhIn}
                    onChange={(e) => setIrgPhIn(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">pH Drenaje</label>
                  <input
                    type="number"
                    step="0.1"
                    value={irgPhOut}
                    onChange={(e) => setIrgPhOut(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CE Entrada</label>
                  <input
                    type="number"
                    step="0.05"
                    value={irgEcIn}
                    onChange={(e) => setIrgEcIn(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tensiómetro</label>
                  <input
                    type="number"
                    value={irgTensiometer}
                    onChange={(e) => setIrgTensiometer(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receta Tanque A (Calcio / N)</label>
                <input
                  type="text"
                  value={irgTankA}
                  onChange={(e) => setIrgTankA(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receta Tanque B (P / K / Mg)</label>
                <input
                  type="text"
                  value={irgTankB}
                  onChange={(e) => setIrgTankB(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIrrigationModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Guardar Lectura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Monitoreo */}
      {showMonitoringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs text-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Registrar Monitoreo Fitosanitario
            </h3>
            <form onSubmit={handleCreateMonitoring} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Módulo</label>
                <select
                  value={monModule}
                  onChange={(e) => setMonModule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.code}>{m.code} - {m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plaga o Enfermedad</label>
                <select
                  value={monPest}
                  onChange={(e) => setMonPest(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Araña Roja (Tetranychus)">Araña Roja (Tetranychus urticae)</option>
                  <option value="Trips (Frankliniella)">Trips (Frankliniella occidentalis)</option>
                  <option value="Oídio / Cenicilla">Oídio / Cenicilla (Podosphaera)</option>
                  <option value="Botrytis">Botrytis cinerea (Moho gris)</option>
                  <option value="Mosca Blanca">Mosca Blanca (Bemisia tabaci)</option>
                  <option value="Pulgón">Pulgón (Macrosiphum)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severidad</label>
                  <select
                    value={monSeverity}
                    onChange={(e) => setMonSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Incidencia (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={monIncidence}
                    onChange={(e) => setMonIncidence(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={monNotes}
                  onChange={(e) => setMonNotes(e.target.value)}
                  placeholder="Focos detectados, condiciones ambientales..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMonitoringModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Guardar Monitoreo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
