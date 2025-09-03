import { Navbar } from "../components";
import { useSettings } from "../contexts/SettingsContext";

const NavbarLayout = (props) => {
  const { settings } = useSettings();

  return (
    <div 
      class={`min-h-screen transition-colors duration-300 ${
        settings().theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <Navbar />
      <main class="pt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {props.children}
        </div>
      </main>
    </div>
  );
};

export default NavbarLayout;
