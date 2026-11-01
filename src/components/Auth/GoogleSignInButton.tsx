'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Sparkles, X, KeyRound, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          prompt: (notification?: (notification: unknown) => void) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  mode?: 'login' | 'register';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  text?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  mode = 'login',
  onSuccess,
  onError,
  className = '',
  text,
}) => {
  const { loginWithGoogle } = useAuth();
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGisReady, setIsGisReady] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [devEmail, setDevEmail] = useState('pengguna.google@gmail.com');
  const [devName, setDevName] = useState('Pengguna Google');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize Google Identity Services (GIS) when clientId exists
  useEffect(() => {
    if (!clientId) return;

    let isMounted = true;

    const initGis = () => {
      if (!window.google?.accounts?.id || !googleBtnContainerRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential?: string }) => {
            if (!isMounted) return;
            if (response.credential) {
              setIsLoading(true);
              const result = await loginWithGoogle({ credential: response.credential });
              setIsLoading(false);
              if (result.success) {
                if (onSuccess) onSuccess();
              } else {
                if (onError) onError(result.error || 'Gagal masuk dengan akun Google.');
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render official GIS button inside container
        const width = Math.min(
          Math.max(googleBtnContainerRef.current.offsetWidth || 340, 240),
          400
        );

        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: mode === 'register' ? 'signup_with' : 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width,
        });

        setIsGisReady(true);
      } catch (e) {
        console.warn('Gagal memuat tombol resmi Google Identity:', e);
      }
    };

    // Check if script already loaded
    if (window.google?.accounts?.id) {
      initGis();
    } else {
      const scriptId = 'google-gis-client';
      const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!existingScript) {
        const newScript = document.createElement('script');
        newScript.id = scriptId;
        newScript.src = 'https://accounts.google.com/gsi/client';
        newScript.async = true;
        newScript.defer = true;
        newScript.onload = () => {
          if (isMounted) initGis();
        };
        document.head.appendChild(newScript);
      } else {
        const prevOnload = existingScript.onload;
        existingScript.onload = (e) => {
          if (typeof prevOnload === 'function') prevOnload.call(existingScript, e);
          if (isMounted) initGis();
        };
      }
    }

    return () => {
      isMounted = false;
    };
  }, [clientId, mode, loginWithGoogle, onSuccess, onError]);

  // Handle click when clientId is missing or custom fallback is active
  const handleCustomButtonClick = async () => {
    if (!clientId) {
      setShowConfigModal(true);
      return;
    }

    // If GIS is ready, trigger prompt
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  // Handle simulated dev login when testing without Client ID
  const handleSimulatedLogin = async () => {
    if (!devEmail.trim()) return;
    setIsLoading(true);
    try {
      const res = await loginWithGoogle({
        profile: {
          email: devEmail.trim().toLowerCase(),
          name: devName.trim() || 'Pengguna Google',
        },
      });
      setIsLoading(false);
      setShowConfigModal(false);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        if (onError) onError(res.error || 'Gagal simulasi login Google.');
      }
    } catch {
      setIsLoading(false);
      if (onError) onError('Terjadi kesalahan saat memproses login Google.');
    }
  };

  const buttonLabel =
    text || (mode === 'register' ? 'Daftar dengan Google' : 'Masuk dengan Google');

  return (
    <>
      <div className={`relative w-full ${className}`}>
        {/* Official GIS Button Container (when clientId is provided) */}
        {clientId && (
          <div
            ref={googleBtnContainerRef}
            className={`w-full flex justify-center items-center min-h-[44px] ${
              isGisReady ? 'block' : 'hidden'
            }`}
          />
        )}

        {/* Fallback / Custom Tailwind Button (shown when clientId is absent or GIS is loading) */}
        {(!clientId || !isGisReady) && (
          <button
            type="button"
            onClick={handleCustomButtonClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>{isLoading ? 'Menghubungkan ke Google...' : buttonLabel}</span>
          </button>
        )}
      </div>

      {/* Setup Guide & Test Modal (Only opens if Client ID is not configured yet) */}
      {showConfigModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowConfigModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <GoogleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Konfigurasi Google Sign-In</h3>
                <p className="text-[11px] text-slate-500">Google OAuth 2.0 Client ID</p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-4 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Client ID Belum Terpasang di Environment</span>
              </div>
              Agar pengunjung dapat login 1-klik langsung menggunakan popup resmi akun Google mereka, tambahkan <b>NEXT_PUBLIC_GOOGLE_CLIENT_ID</b> di file <code>.env.local</code> atau Vercel Environment Variables.
            </div>

            {/* Quick 3-Step Setup Guide */}
            <div className="space-y-2 mb-4 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                Langkah Cepat Aktivasi Google OAuth:
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
                <div>1. Buka <b>console.cloud.google.com</b> &gt; APIs &amp; Services &gt; Credentials</div>
                <div>2. Buat <b>OAuth client ID</b> (Web application)</div>
                <div>3. Tambahkan <code>https://cvbagus.id</code> &amp; <code>http://localhost:3000</code> ke <i>Authorized JavaScript origins</i></div>
                <div>4. Salin Client ID ke <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code></div>
              </div>
            </div>

            {/* Dev Mode Simulated Login */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulasi Login Akun Google (Mode Testing)</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Anda dapat menguji alur login &amp; pembuatan akun otomatis di database cloud langsung sekarang:
              </p>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Email Akun Google
                  </label>
                  <input
                    type="email"
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="nama@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Nama Pengguna Google
                  </label>
                  <input
                    type="text"
                    value={devName}
                    onChange={(e) => setDevName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Contoh: Septian Riawan"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSimulatedLogin}
                  disabled={isLoading || !devEmail.trim()}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isLoading ? 'Memproses...' : 'Uji Masuk Sebagai Pengguna Google Ini'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
