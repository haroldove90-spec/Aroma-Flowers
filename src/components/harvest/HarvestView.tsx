import React, { useState } from 'react';
import {
  Flower2,
  Boxes,
  Sparkles,
  ThermometerSnowflake,
  PlusCircle,
  AlertOctagon,
  CheckCircle2,
  PackageCheck,
  TrendingDown,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { HarvestRecord } from '../../types/greenhouse';

export const HarvestView: React.FC = () => {
  const {
    activeView,
    harvest,
    modules,
    addHarvest,
    updateHarvest,
  } = useGreenhouse();

  const [tab, setTab] = useState<'corte' | 'clasificacion' | 'camara'>(
    activeView === 'clasificacion' ? 'clasificacion' : activeView === 'camara' ? 'camara' : 'corte'
  );

  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [hModule, setHModule] = useState(modules[0]?.code || 'M-01');
  const [hVariety, setHVariety] = useState('Rosa Freedom');
  const [hStemsCut, setHStemsCut] = useState('5000');
  const [hTeam, setHTeam] = useState('Cuadrilla Corte Mañana');
  const [hG40, setHG40] = useState('200');
  const [hG50, setHG50] = useState('800');
  const [hG60, setHG60] = useState('2000');
  const [hG70, setHG70] = useState('1500');
  const [hG80, setHG80] = useState('350');
  const [hWaste, setHWaste] = useState('150');
  const [hWasteReason, setHWasteReason] = useState('Tallo curvo, cáliz abierto');
  const [hColdRoom, setHColdRoom] = useState('Cámara Fría #1 (3.2°C)');

  const totalCut = harvest.reduce((acc, h) => acc + h.stemsCut, 0);
  const totalPackages25 = harvest.reduce((acc, h) => acc + h.packages25Stems, 0);
  const totalWaste = harvest.reduce((acc, h) => acc + h.stemsWaste, 0);
  const wasteRate = totalCut > 0 ? ((totalWaste / totalCut) * 100).toFixed(1) : '0';

  const handleCreateHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const cut = parseInt(hStemsCut) || 5000;
    const waste = parseInt(hWaste) || 0;
    const commercialStems = Math.max(0, cut - waste);
    const packages = Math.floor(commercialStems / 25);

    const newRecord: HarvestRecord = {
      id: `hrv-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      moduleId: modules.find((m) => m.code === hModule)?.id || 'mod-1',
      moduleCode: hModule,
      variety: hVariety,
      stemsCut: cut,
      harvesterTeam: hTeam,
      stemsGrade40cm: parseInt(hG40) || 0,
      stemsGrade50cm: parseInt(hG50) || 0,
      stemsGrade60cm: parseInt(hG60) || 0,
      stemsGrade70cm: parseInt(hG70) || 0,
      stemsGrade80cm: parseInt(hG80) || 0,
      stemsWaste: waste,
      wasteReason: hWasteReason,
      packages25Stems: packages,
      coldRoomCode: hColdRoom,
      solutionTreatment: 'Solución STS + Chrysal Professional 2',
      status: 'en_camara_fria',
    };
    addHarvest(newRecord);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Harvest Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Jefatura de Cosecha, Poscosecha y Empaque
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Corte, Clasificación y Paquetes de 25 Tallos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calidad, hidratación química, mermas y temperatura en cámara fría
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTab('corte')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'corte' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Corte Diario ({harvest.length})
          </button>
          <button
            onClick={() => setTab('clasificacion')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'clasificacion' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Empaque & Calidad
          </button>
          <button
            onClick={() => setTab('camara')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'camara' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cámara Fría (3.2°C)
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Tallos Cortados Acumulados</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
            {totalCut.toLocaleString()} tallos
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Registrados en bitácora</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Bonches Comerciales (x25)</span>
          <span className="text-xl sm:text-2xl font-black text-rose-700 mt-1 block">
            {totalPackages25.toLocaleString()} bonches
          </span>
          <span className="text-[11px] text-slate-500">{(totalPackages25 * 25).toLocaleString()} tallos aptos</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Índice de Merma / Descarte</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">
            {wasteRate}%
          </span>
          <span className="text-[11px] text-slate-500">{totalWaste.toLocaleString()} tallos descartados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Cámara Fría #1 & #2</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 mt-1 block flex items-center gap-1">
            <ThermometerSnowflake className="w-5 h-5 text-blue-500" /> 3.2°C / 88%
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Hidratación STS Activa</span>
        </div>
      </div>

      {/* Main Harvest List & Classification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Lotes de Cosecha & Conversión a Paquetes de 25
            </h2>
            <p className="text-xs text-slate-500">
              Trazabilidad integral: Módulo de origen ➔ Cuadrilla de corte ➔ Calificación de tallos ➔ Cámara
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Corte & Empaque</span>
          </button>
        </div>

        <div className="space-y-4">
          {harvest.map((h) => (
            <div
              key={h.id}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                    {h.moduleCode}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{h.variety}</h3>
                    <span className="text-[10px] text-slate-500">{h.harvesterTeam} • {h.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
                    {h.packages25Stems} Paquetes (25 tallos)
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">
                    {h.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Classification By Length breakdown */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Clasificación de Longitud de Tallos
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block">40 cm</span>
                    <strong className="text-slate-800">{h.stemsGrade40cm} tallos</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block">50 cm</span>
                    <strong className="text-slate-800">{h.stemsGrade50cm} tallos</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block">60 cm</span>
                    <strong className="text-slate-800">{h.stemsGrade60cm} tallos</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block">70 cm</span>
                    <strong className="text-slate-800">{h.stemsGrade70cm} tallos</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block">80 cm Select</span>
                    <strong className="text-slate-800">{h.stemsGrade80cm} tallos</strong>
                  </div>
                </div>
              </div>

              {/* Treatment & Waste */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 text-slate-600">
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl">
                  <strong className="text-blue-900 block text-[11px]">Ubicación & Preservación:</strong>
                  <span>{h.coldRoomCode} • {h.solutionTreatment}</span>
                </div>
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl">
                  <strong className="text-amber-900 block text-[11px]">Merma ({h.stemsWaste} tallos):</strong>
                  <span>{h.wasteReason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Registrar Corte & Clasificación */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs text-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Registrar Lote de Corte, Clasificación & Empaque
            </h3>
            <form onSubmit={handleCreateHarvest} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Módulo de Origen</label>
                  <select
                    value={hModule}
                    onChange={(e) => {
                      setHModule(e.target.value);
                      const m = modules.find((mod) => mod.code === e.target.value);
                      if (m) setHVariety(m.variety);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.code}>{m.code} - {m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Variedad</label>
                  <input
                    type="text"
                    value={hVariety}
                    onChange={(e) => setHVariety(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Tallos Cortados</label>
                  <input
                    type="number"
                    value={hStemsCut}
                    onChange={(e) => setHStemsCut(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cuadrilla de Corte</label>
                  <input
                    type="text"
                    value={hTeam}
                    onChange={(e) => setHTeam(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="border border-slate-200 p-3 rounded-xl bg-slate-50 space-y-2">
                <span className="font-bold text-slate-700 block">Distribución de Grados por Longitud</span>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">40 cm</label>
                    <input
                      type="number"
                      value={hG40}
                      onChange={(e) => setHG40(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">50 cm</label>
                    <input
                      type="number"
                      value={hG50}
                      onChange={(e) => setHG50(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">60 cm</label>
                    <input
                      type="number"
                      value={hG60}
                      onChange={(e) => setHG60(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">70 cm</label>
                    <input
                      type="number"
                      value={hG70}
                      onChange={(e) => setHG70(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">80 cm</label>
                    <input
                      type="number"
                      value={hG80}
                      onChange={(e) => setHG80(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tallos Merma / Descarte</label>
                  <input
                    type="number"
                    value={hWaste}
                    onChange={(e) => setHWaste(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-rose-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Causas de Descarte</label>
                  <input
                    type="text"
                    value={hWasteReason}
                    onChange={(e) => setHWasteReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destino Cámara Fría</label>
                <select
                  value={hColdRoom}
                  onChange={(e) => setHColdRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Cámara Fría #1 (3.2°C)">Cámara Fría #1 (3.2°C) - Rack A</option>
                  <option value="Cámara Fría #2 (3.5°C)">Cámara Fría #2 (3.5°C) - Rack B</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
                >
                  Guardar & Empacar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
