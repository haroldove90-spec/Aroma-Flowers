import React, { useState } from 'react';
import {
  Trash2,
  Database,
  RefreshCw,
  Copy,
  Check,
  Download,
  Upload,
  AlertTriangle,
  X,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const {
    demoDataCleared,
    clearAllDemoData,
    restoreDemoData,
    neverShowDemoAgain,
    setNeverShowDemoAgain,
    supabaseConfig,
    saveSupabaseConfig,
    generateSupabaseSql,
    generateSupabaseCleanupSql,
    exportDataJson,
    importDataJson,
  } = useGreenhouse();

  const [activeTab, setActiveTab] = useState<'demo' | 'supabase' | 'backup'>('demo');
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.anonKey || '');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleClear = () => {
    if (window.confirm('¿Confirmas que deseas borrar todos los datos de muestra del sistema Aroma Flowers? La base de datos local quedará en blanco lista para operación real.')) {
      clearAllDemoData();
      setActionMessage('¡Todos los datos de muestra han sido eliminados!');
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleRestore = () => {
    restoreDemoData();
    setActionMessage('Datos de demostración restaurados correctamente.');
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setActionMessage('Configuración de conexión Supabase guardada.');
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aroma_flowers_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setActionMessage('Copia de respaldo importada con éxito.');
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        alert('El archivo no tiene el formato JSON válido de Aroma Flowers.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">Gestión de Datos y Supabase</h3>
              <p className="text-xs text-emerald-200">Control de datos de prueba, esquemas y persistencia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {actionMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            {actionMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('demo')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'demo'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Datos de Muestra
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'supabase'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Conexión Supabase
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'backup'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Respaldos JSON
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 text-sm text-slate-700 max-h-[70vh] overflow-y-auto">
          {activeTab === 'demo' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-900">Borrar datos de muestra del todo el sistema</h4>
                    <p className="text-xs text-rose-700 mt-1">
                      Esta acción vacía todos los registros de prueba (invernaderos, lotes, registros de riego, monitoreos, cosechas, clientes, ventas y contabilidad) para dejar la plataforma en blanco lista para ingresar los datos reales de tu invernadero.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-rose-200/60">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="neverShowToggle"
                      checked={neverShowDemoAgain}
                      onChange={(e) => setNeverShowDemoAgain(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <label htmlFor="neverShowToggle" className="text-xs font-medium text-slate-700">
                      No volver a cargar datos de muestra al reiniciar el navegador
                    </label>
                  </div>

                  <button
                    onClick={handleClear}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-rose-700 active:scale-95 transition shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    Borrar Datos de Muestra
                  </button>
                </div>
              </div>

              {demoDataCleared && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-900">
                      El sistema se encuentra en blanco (modo producción sin datos demo).
                    </span>
                  </div>
                  <button
                    onClick={handleRestore}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Restaurar Demo
                  </button>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                  Estado Actual de Almacenamiento
                </h5>
                <p className="text-xs text-slate-600">
                  La información capturada se almacena localmente de forma persistente y continuará funcionando aún sin conexión a internet (modo offline). Al configurar Supabase, podrás sincronizar en tiempo real a la nube.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-5">
              <form onSubmit={handleSaveSupabase} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Anon Public Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Server className={`w-4 h-4 ${supabaseConfig.isConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs text-slate-500">
                      {supabaseConfig.isConnected ? 'Credenciales configuradas' : 'Sin vincular'}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    Guardar Conexión
                  </button>
                </div>
              </form>

              {/* SQL Generation Scripts */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-700">
                    1. Script SQL para Crear Tablas en Supabase:
                  </span>
                  <button
                    onClick={() => handleCopy(generateSupabaseSql(), 'schema')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100"
                  >
                    {copiedType === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'schema' ? 'Copiado' : 'Copiar Esquema SQL'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-700">
                    2. Script SQL de Limpieza Supabase (Borrar registros de prueba):
                  </span>
                  <button
                    onClick={() => handleCopy(generateSupabaseCleanupSql(), 'clean')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100"
                  >
                    {copiedType === 'clean' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'clean' ? 'Copiado' : 'Copiar Limpieza SQL'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <Download className="w-6 h-6 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Descargar Respaldo JSON</h4>
                  <p className="text-xs text-slate-600">
                    Genera un archivo seguro con todos los módulos, cosechas, clientes, movimientos y registros del invernadero.
                  </p>
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Exportar Base de Datos
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Importar Copia de Respaldo</h4>
                  <p className="text-xs text-slate-600">
                    Restaura una copia de seguridad previa en formato JSON para continuar trabajando.
                  </p>
                  <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Seleccionar Archivo JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
