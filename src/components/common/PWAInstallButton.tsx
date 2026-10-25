import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showFallbackModal, setShowFallbackModal] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">App Instalada</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowFallbackModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Invernadero Aroma Flowers en tu dispositivo"
        className={`flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 active:scale-95 transition-all ${
          compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm'
        }`}
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span>Instalar App</span>
      </button>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Smartphone className="w-5 h-5" />
                <h3>Instalar en iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  1
                </span>
                <span>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha arriba) en Safari.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  2
                </span>
                <span>Desplázate hacia abajo y presiona <strong>&quot;Agregar a inicio&quot;</strong>.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  3
                </span>
                <span>Disfruta de Aroma Flowers como una aplicación nativa pantalla completa.</span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Android Chrome fallback when prompt not yet fired */}
      {showFallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Download className="w-5 h-5" />
                <h3>Instalación de Aplicación</h3>
              </div>
              <button
                onClick={() => setShowFallbackModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-600 space-y-2">
              <p>
                Para instalar <strong>Invernadero Aroma Flowers</strong> en tu computadora o Android:
              </p>
              <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                Haz clic en el icono de instalación <strong>(+) o monitor con flecha</strong> que aparece al final de la barra de direcciones de tu navegador (Chrome, Edge o Brave) y selecciona <em>&quot;Instalar Aroma Flowers&quot;</em>.
              </p>
            </div>
            <button
              onClick={() => setShowFallbackModal(false)}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
