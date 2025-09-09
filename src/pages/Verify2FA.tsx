import { createSignal, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Verify2FA = () => {
  const navigate = useNavigate();
  const [code, setCode] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  // Match SignIn page ambiance
  onMount(() => {
    document.body.classList.add('auth-page');
  });
  onCleanup(() => {
    document.body.classList.remove('auth-page');
  });

  const verify = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code() }),
      });
      if (!res.ok) {
        let msg = "Verifikasi gagal";
        try { const j = await res.json(); msg = j?.error || msg; } catch {}
        throw new Error(msg);
      }
      // Mark 2FA as enabled (persist) and this session as passed
      try { localStorage.setItem("twofa_enabled", "1"); } catch {}
      sessionStorage.setItem("twofa_passed", "1");
      navigate("/dashboard");
    } catch (e: any) {
      setError(e?.message === 'invalid_code' ? 'Kode salah' : e?.message === 'setup_required' ? 'QR belum discan, aktifkan 2FA di Settings' : 'Verifikasi gagal');
    } finally {
      setLoading(false);
    }
  };

  // Background style, mirroring SignIn
  const backgroundStyle = {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)",
    "background-size": "cover",
    "background-position": "center",
  } as any;

  return (
    <div class="min-h-screen relative overflow-hidden" style={backgroundStyle}>
      {/* Layers like SignIn */}
      <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/30 to-black/70"></div>
      <div class="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-purple-900/30"></div>

      {/* Decorative bubbles */}
      <div class="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-indigo-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Geometric lines */}
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-20 left-20 w-32 h-32 border border-white/20 rotate-45"></div>
        <div class="absolute top-40 right-32 w-24 h-24 border border-white/15 rotate-12"></div>
        <div class="absolute bottom-32 left-40 w-28 h-28 border border-white/10 -rotate-12"></div>
      </div>

      {/* Content container */}
      <div class="relative z-10 min-h-screen flex items-center justify-center px-3 py-4">
        <div class="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Left - company info (compact) */}
          <div class="hidden lg:block space-y-5">
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <div>
                  <div class="text-white font-bold text-xl tracking-tight">PT. Akusara Barindo Jaya</div>
                  <div class="text-blue-200 text-xs font-medium">Property Development Excellence</div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Verifikasi
                <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> 2FA </span>
                Akun Anda
              </h1>
              <p class="text-base text-blue-100 leading-relaxed max-w-lg">
                Demi keamanan, masukkan kode 6 digit dari aplikasi authenticator Anda.
              </p>
            </div>
          </div>

          {/* Right - compact verify card */}
          <div class="w-full max-w-xs mx-auto">
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-white/18 via-white/10 to-white/5 rounded-lg blur-sm"></div>
              <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/15 via-transparent to-purple-500/12 rounded-lg"></div>
              <div class="absolute inset-0 backdrop-blur-2xl bg-white/8 rounded-lg border border-white/25 shadow-xl"></div>

              <div class="relative p-4 rounded-lg">
                {/* Mobile logo */}
                <div class="lg:hidden mb-4 text-center">
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </div>
                    <span class="text-white font-bold text-sm">PT. Akusara Barindo</span>
                  </div>
                </div>

                {/* Header */}
                <div class="text-center mb-4">
                  <h2 class="text-xl lg:text-2xl font-bold text-white mb-1">Verifikasi 2FA</h2>
                  <p class="text-blue-100 text-xs">Masukkan kode 6 digit</p>
                </div>

                {error() && (
                  <div class="mb-3 p-2 bg-red-500/20 border border-red-400/30 text-red-100 rounded-lg text-center backdrop-blur-sm">
                    <div class="flex items-center justify-center space-x-1">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                      <span class="text-xs font-medium">{error()}</span>
                    </div>
                  </div>
                )}

                {/* OTP input */}
                <div class="space-y-3">
                  <div class="space-y-1">
                    <label class="text-white/90 text-xs font-medium flex items-center space-x-1">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 5h2v5h-2zm0 7h2v2h-2z"/></svg>
                      <span>Kode 2FA</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={code()}
                      onInput={(e) => setCode(e.currentTarget.value)}
                      class="w-full px-3 py-2 bg-white/95 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-300 outline-none text-neutral-900 placeholder-neutral-500 text-xs font-medium"
                      placeholder="123456"
                    />
                  </div>

                  <button
                    disabled={code().length !== 6 || loading()}
                    onClick={verify}
                    class={`w-full ${loading() ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5'} text-white py-2 px-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-transparent flex items-center justify-center space-x-1 text-xs`}
                  >
                    <span>Verifikasi</span>
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hero summary */}
      <div class="lg:hidden relative z-10 px-3 py-4">
        <div class="text-center text-white space-y-3">
          <h1 class="text-2xl font-bold leading-tight">
            Verifikasi <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">2FA</span>
          </h1>
          <p class="text-blue-100 text-sm leading-relaxed">Masukkan kode 6 digit dari Authenticator</p>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;
