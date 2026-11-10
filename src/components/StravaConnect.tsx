import React, { useEffect, useState } from 'react';
import { stravaService } from '../services/stravaService';
import { RefreshCw, CheckCircle, ExternalLink, LogOut } from 'lucide-react';

interface StravaConnectProps {
  onSyncSuccess?: () => void;
}

export const StravaConnect: React.FC<StravaConnectProps> = ({ onSyncSuccess }) => {
  const [isConnected, setIsConnected] = useState(stravaService.isAuthenticated());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we are returning from Strava OAuth redirect with a code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setLoading(true);
      // Clean query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // In production, send 'code' to your backend API to exchange for token securely.
      // For demonstration / client-side OAuth flow:
      console.log('Strava OAuth authorization code received:', code);

      // Simulate OAuth token exchange
      setTimeout(() => {
        stravaService.saveTokens({
          access_token: 'mock_strava_token_' + Date.now(),
          refresh_token: 'mock_refresh_token',
          expires_at: Math.floor(Date.now() / 1000) + 21600,
        });
        setIsConnected(true);
        setLoading(false);
        if (onSyncSuccess) onSyncSuccess();
      }, 1000);
    }
  }, [onSyncSuccess]);

  const handleConnect = () => {
    window.location.href = stravaService.getAuthUrl();
  };

  const handleDisconnect = () => {
    stravaService.clearAuth();
    setIsConnected(false);
    if (onSyncSuccess) onSyncSuccess();
  };

  return (
    <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000]/10 border border-[#ff0000]/20 flex items-center justify-center">
            <span className="text-[#ff0000] font-black text-xs tracking-tighter">STRAVA</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Integración con Strava</h3>
            <p className="text-xs text-[#555555]">Sincroniza tus sesiones de entrenamiento</p>
          </div>
        </div>

        {isConnected ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
            <CheckCircle size={14} className="mr-1.5" />
            Conectado
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1a1212] text-[#555555] border border-[#221515]">
            Desconectado
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center space-x-2 text-[#ff0000] text-sm py-3 font-medium">
          <RefreshCw size={18} className="animate-spin" />
          <span>Sincronizando con Strava...</span>
        </div>
      ) : isConnected ? (
        <div className="space-y-4 pt-2">
          <p className="text-xs text-[#666666]">
            Sincronización activa. Los datos de rendimiento se actualizarán en tu dashboard.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => onSyncSuccess && onSyncSuccess()}
              className="flex items-center space-x-2 px-4 py-2 bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-bold rounded-xl transition-colors shadow-[0_4px_15px_rgba(255,0,0,0.2)]"
            >
              <RefreshCw size={14} />
              <span>Sincronizar</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center space-x-2 px-4 py-2 bg-[#050505] hover:bg-[#110808] text-[#ff0000] border border-[#221515] text-xs font-medium rounded-xl transition-colors"
            >
              <LogOut size={14} />
              <span>Desvincular</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <p className="text-xs text-[#666666]">
            Conecta tu cuenta para importar actividades, estadísticas de ritmo y frecuencia cardíaca.
          </p>
          <button
            onClick={handleConnect}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(255,0,0,0.2)]"
          >
            <ExternalLink size={14} />
            <span>Conectar Strava</span>
          </button>
        </div>
      )}
    </div>
  );
};
