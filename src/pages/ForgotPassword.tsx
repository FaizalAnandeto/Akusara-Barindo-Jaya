import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

const ForgotPassword = () => {
  const [email, setEmail] = createSignal("");
  const [isSubmitted, setIsSubmitted] = createSignal(false);
  const [showValidationMessage, setShowValidationMessage] = createSignal("");
  const navigate = useNavigate();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if form is valid
  const isFormValid = () => {
    return email().trim() !== "" && isValidEmail(email());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      if (email().trim() === "") {
        setShowValidationMessage("Mohon masukkan alamat email Anda!");
      } else if (!isValidEmail(email())) {
        setShowValidationMessage("Format email tidak valid!");
      }
      // Hide message after 3 seconds
      setTimeout(() => setShowValidationMessage(""), 3000);
      return;
    }

    setShowValidationMessage("");
    console.log("Password reset attempt for:", email());

    // Add your password reset logic here
    setIsSubmitted(true);

    // Redirect to signin after showing success message
    setTimeout(() => {
      navigate("/signin");
    }, 3000);
  };

  const handleButtonClick = () => {
    if (!isFormValid()) {
      if (email().trim() === "") {
        setShowValidationMessage("Mohon masukkan alamat email Anda!");
      } else if (!isValidEmail(email())) {
        setShowValidationMessage("Format email tidak valid!");
      }
      setTimeout(() => setShowValidationMessage(""), 3000);
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      navigate("/signin");
    }, 3000);
  };

  // Modern gradient background
  const backgroundStyle = {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)",
    "background-size": "cover",
    "background-position": "center",
  };

  return (
    <div class="min-h-screen relative overflow-hidden" style={backgroundStyle}>
      {/* Enhanced Multi-Layer Background */}
      <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/30 to-black/70"></div>
      <div class="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-purple-900/30"></div>

      {/* Enhanced Decorative Elements */}
      <div class="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-indigo-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Geometric Pattern Overlay */}
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-20 left-20 w-32 h-32 border border-white/20 rotate-45"></div>
        <div class="absolute top-40 right-32 w-24 h-24 border border-white/15 rotate-12"></div>
        <div class="absolute bottom-32 left-40 w-28 h-28 border border-white/10 -rotate-12"></div>
      </div>

      {/* Content Container */}
      <div class="relative z-10 min-h-screen flex items-center justify-center px-3 py-4">
        <div class="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Compact Company Info */}
          <div class="hidden lg:block space-y-5">
            {/* Compact Company Logo */}
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <div>
                  <div class="text-white font-bold text-xl tracking-tight">
                    PT. Akusara Barindo Jaya
                  </div>
                  <div class="text-blue-200 text-xs font-medium">
                    Property Development Excellence
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Main Heading */}
            <div class="space-y-4">
              <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Lupa
                <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  Password{" "}
                </span>
                Anda?
              </h1>

              {/* Compact Description */}
              <p class="text-base text-blue-100 leading-relaxed max-w-lg">
                Jangan khawatir! Masukkan alamat email Anda dan kami akan
                mengirimkan link reset password ke email Anda.
              </p>
            </div>

            {/* Compact CTA Buttons */}
            <div class="flex flex-col sm:flex-row gap-3">
              <button class="group bg-white/95 backdrop-blur-sm text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2 text-sm">
                <svg
                  class="w-4 h-4 group-hover:rotate-12 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Lihat Proyek Terbaru</span>
              </button>
              <button class="group border-2 border-white/80 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:border-white flex items-center justify-center space-x-2 text-sm">
                <svg
                  class="w-4 h-4 group-hover:rotate-12 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H9v-2h6v2zm3-4H6v-2h12v2zm0-4H6V8h12v2z" />
                </svg>
                <span>Hubungi Marketing</span>
              </button>
            </div>

            {/* Compact Trust Indicators */}
            <div class="relative">
              {/* Background Card */}
              <div class="absolute inset-0 bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-lg rounded-xl border border-white/25 shadow-xl"></div>

              {/* Content */}
              <div class="relative p-4 rounded-xl">
                <div class="flex items-center justify-between">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white mb-1">1000+</div>
                    <div class="text-blue-200 text-xs font-medium">
                      Rumah Dibangun
                    </div>
                  </div>
                  <div class="w-px h-8 bg-white/20"></div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white mb-1">15+</div>
                    <div class="text-blue-200 text-xs font-medium">
                      Tahun Pengalaman
                    </div>
                  </div>
                  <div class="w-px h-8 bg-white/20"></div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white mb-1">50+</div>
                    <div class="text-blue-200 text-xs font-medium">
                      Proyek Selesai
                    </div>
                  </div>
                </div>

                {/* Compact Achievement Indicators */}
                <div class="flex justify-center space-x-3 mt-3 pt-3 border-t border-white/20">
                  <div class="flex items-center space-x-1.5 text-blue-200 text-xs">
                    <svg
                      class="w-3.5 h-3.5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Developer Terpercaya</span>
                  </div>
                  <div class="flex items-center space-x-1.5 text-blue-200 text-xs">
                    <svg
                      class="w-3.5 h-3.5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Kualitas Terjamin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Ultra Compact Forgot Password Form */}
          <div class="w-full max-w-xs mx-auto">
            {/* Ultra Compact Premium Card */}
            <div class="relative group">
              {/* Multi-layer Background Effects */}
              <div class="absolute inset-0 bg-gradient-to-br from-white/18 via-white/10 to-white/5 rounded-lg blur-sm"></div>
              <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/15 via-transparent to-purple-500/12 rounded-lg"></div>
              <div class="absolute inset-0 backdrop-blur-2xl bg-white/8 rounded-lg border border-white/25 shadow-xl"></div>

              {/* Main Card Content */}
              <div class="relative p-4 rounded-lg">
                {/* Ultra Compact Mobile Logo */}
                <div class="lg:hidden mb-4 text-center">
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      <svg
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </div>
                    <span class="text-white font-bold text-sm">
                      PT. Akusara Barindo
                    </span>
                  </div>
                </div>

                {!isSubmitted() ? (
                  <>
                    {/* Ultra Compact Form Header */}
                    <div class="text-center mb-4">
                      <h2 class="text-xl lg:text-2xl font-bold text-white mb-1">
                        Reset Password
                      </h2>
                      <p class="text-blue-100 text-xs">Masukkan email Anda</p>
                    </div>

                    {/* Validation Message */}
                    {showValidationMessage() && (
                      <div class="mb-3 p-2 bg-red-500/20 border border-red-400/30 text-red-100 rounded-lg text-center backdrop-blur-sm">
                        <div class="flex items-center justify-center space-x-1">
                          <svg
                            class="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <span class="text-xs font-medium">
                            {showValidationMessage()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Ultra Compact Forgot Password Form */}
                    <form onSubmit={handleSubmit} class="space-y-3">
                      {/* Ultra Compact Email Field */}
                      <div class="space-y-1">
                        <label class="text-white/90 text-xs font-medium flex items-center space-x-1">
                          <svg
                            class="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                          <span>Email Address</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          class="w-full px-3 py-2 bg-white/95 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-300 outline-none text-neutral-900 placeholder-neutral-500 text-xs font-medium"
                          placeholder="email@domain.com"
                          value={email()}
                          onInput={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      {/* Ultra Compact Submit Button */}
                      <button
                        type="submit"
                        class="w-full bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 text-white py-2 px-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-transparent flex items-center justify-center space-x-1 text-xs"
                        onClick={handleButtonClick}
                      >
                        <span>Kirim Link Reset</span>
                        <svg
                          class="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      </button>

                      {/* Ultra Compact Divider */}
                      <div class="relative my-3">
                        <div class="absolute inset-0 flex items-center">
                          <div class="w-full border-t border-white/20"></div>
                        </div>
                        <div class="relative flex justify-center text-xs">
                          <span class="px-2 bg-transparent text-white/70">
                            atau
                          </span>
                        </div>
                      </div>

                      {/* Ultra Compact Action Links */}
                      <div class="flex flex-col gap-1.5 text-center">
                        <button
                          type="button"
                          class="text-blue-200 hover:text-white font-medium transition-colors duration-300 py-1 hover:bg-white/10 rounded-md text-xs"
                          onClick={() => navigate("/signin")}
                        >
                          Kembali ke Login
                        </button>
                        <button
                          type="button"
                          class="text-blue-200 hover:text-white font-medium transition-colors duration-300 py-1 hover:bg-white/10 rounded-md text-xs"
                          onClick={() => navigate("/signup")}
                        >
                          Buat Akun Baru
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  /* Success Message */
                  <div class="text-center space-y-4">
                    <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        class="w-8 h-8 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-2">
                      Email Terkirim!
                    </h3>
                    <p class="text-blue-100 text-xs leading-relaxed">
                      Kami telah mengirimkan link reset password ke email{" "}
                      <span class="font-semibold text-white">{email()}</span>.
                      Silakan cek inbox Anda dan ikuti instruksi di email
                      tersebut.
                    </p>
                    <div class="text-xs text-blue-200 mt-3">
                      Akan diarahkan ke halaman login dalam 3 detik...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Compact Mobile Hero Content */}
      <div class="lg:hidden relative z-10 px-3 py-4">
        <div class="text-center text-white space-y-3">
          <h1 class="text-2xl font-bold leading-tight">
            Lupa
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Password{" "}
            </span>
            Anda?
          </h1>
          <p class="text-blue-100 text-sm leading-relaxed">
            Reset password dengan mudah
          </p>

          {/* Ultra Compact Mobile Trust Indicators */}
          <div class="relative mt-3">
            {/* Enhanced Background Card */}
            <div class="absolute inset-0 bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-lg rounded-lg border border-white/25 shadow-lg"></div>

            {/* Content */}
            <div class="relative p-2.5 rounded-lg">
              <div class="flex justify-center space-x-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-white">1000+</div>
                  <div class="text-blue-200 text-xs">Rumah</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-white">15+</div>
                  <div class="text-blue-200 text-xs">Tahun</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-white">50+</div>
                  <div class="text-blue-200 text-xs">Proyek</div>
                </div>
              </div>

              {/* Ultra Compact Mobile Achievement Indicators */}
              <div class="flex justify-center space-x-2 mt-2 pt-2 border-t border-white/20">
                <div class="flex items-center space-x-1 text-blue-200 text-xs">
                  <svg
                    class="w-2.5 h-2.5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Terpercaya</span>
                </div>
                <div class="flex items-center space-x-1 text-blue-200 text-xs">
                  <svg
                    class="w-2.5 h-2.5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Berkualitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
