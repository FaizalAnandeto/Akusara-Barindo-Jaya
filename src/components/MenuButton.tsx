// Menu Button Component
const MenuButton = (props) => {
  return (
    <button
      class={`fixed top-6 z-50 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
        props.isOpen ? "left-[310px]" : "left-[80px]"
      }`}
      onClick={props.onClick}
    >
      <div class="w-6 h-6 flex flex-col justify-center items-center">
        <div
          class={`w-5 h-0.5 bg-white transition-all duration-300 ${
            props.isOpen ? "rotate-45 translate-y-1.5" : "mb-1"
          }`}
        ></div>
        <div
          class={`w-5 h-0.5 bg-white transition-all duration-300 ${
            props.isOpen ? "opacity-0" : "mb-1"
          }`}
        ></div>
        <div
          class={`w-5 h-0.5 bg-white transition-all duration-300 ${
            props.isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        ></div>
      </div>
    </button>
  );
};

export default MenuButton;
