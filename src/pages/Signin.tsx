import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';

const SignIn = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [rememberMe, setRememberMe] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', {
      email: email(),
      password: password(),
      rememberMe: rememberMe()
    });
    // Add your authentication logic here
    // navigate('/dashboard');
  };

  // Using the actual housing aerial photo as background
  const backgroundStyle = {
    'background-image': 'url("/src/assets/upscalemedia-transformed.png")',
    'background-size': 'cover',
    'background-position': 'center'
  };

  return (
    <div class="min-h-screen relative" style={backgroundStyle}>
      {/* Overlay */}
      <div class="absolute inset-0 bg-black opacity-60"></div>
      
      {/* Content Container */}
      <div class="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div class="w-full max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left Side - Company Info */}
          <div class="hidden lg:block flex-1 max-w-xl pr-16">
            {/* Company Logo */}
            <div class="mb-12">
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-12 h-12 bg-gradient-to-br from-sky-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  AB
                </div>
                <span class="text-white font-bold text-2xl">PT. Akusara Barindo Jaya</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 class="text-5xl font-bold text-white mb-6 leading-tight">
              Wujudkan Hunian Impian Anda
            </h1>
            
            {/* Description */}
            <p class="text-lg text-white text-opacity-90 mb-8 leading-relaxed">
              Bergabunglah dengan PT. Akusara Barindo Jaya, developer perumahan terpercaya yang telah membangun ribuan hunian berkualitas di seluruh Indonesia. Akses portal khusus untuk klien, investor, dan mitra bisnis kami.
            </p>
            
            {/* CTA Buttons */}
            <div class="flex space-x-4">
              <button class="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Lihat Proyek Terbaru
              </button>
              <button class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-gradient-to-r from-sky-600 to-blue-800 hover:-translate-y-1 hover:bg-opacity-10 backdrop-blur-sm transition-all duration-300">
                Hubungi Marketing
              </button>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div class="backdrop-blur-xs rounded-2xl shadow-2xl/100 p-8 w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div class="lg:hidden mb-6 text-center">
              <div class="flex items-center justify-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-sky-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  AB
                </div>
                <span class="text-white font-bold text-xl">PT. Akusara Barindo Jaya</span>
              </div>
            </div>

            {/* Form Header */}
            <div class="text-center lg:text-left mb-8">
              <h2 class="text-6xl font-bold text-blue-600/75 dark:text-sky-500/75 mb-2 font-inter">Sign In</h2>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} class="space-y-6">

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  id="email"
                  class="w-full px-4 py-4 border-0 rounded-xl bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 outline-none text-gray-700 placeholder-gray-500"
                  placeholder="Email"
                  value={email()}
                  onInput={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <input
                  type="password"
                  id="password"
                  class="w-full px-4 py-4 border-0 rounded-xl bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 outline-none text-gray-700 placeholder-gray-500"
                  placeholder="Password"
                  value={password()}
                  onInput={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl font-inter focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                onClick={() => navigate('/dashboard')}
              >
                Sign In
              </button>

                <div class='flex justify-between font-inter text-white'>
                <button class='hover:text-white' onClick={() => navigate('/forgotpw')}>Forgot Password</button>
                <button class='hover:text-white' onClick={() => navigate('/signup')}>Create Account</button>
            </div>

            </form>
          </div>
        </div>
      </div>

      {/* Mobile Content for smaller screens */}
      <div class="lg:hidden relative z-10 px-4 py-8">
        <div class="text-center text-white mb-8">
          <h1 class="text-3xl font-bold mb-4">Wujudkan Hunian Impian Anda</h1>
          <p class="text-white text-opacity-90 mb-6">
            Developer perumahan terpercaya di seluruh Indonesia
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;