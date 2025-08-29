import { A } from "@solidjs/router";

// Navigation Item Component
const NavigationItem = (props) => {
  const getNavigationPath = () => {
    switch (props.id) {
      case "dashboard":
        return "/dashboard";
      case "osp":
        return "/osp";
      case "security":
        return "/security";
      case "finance":
        return "/finance";
      case "settings":
        return "/settings";
      default:
        return "/dashboard";
    }
  };

  return (
    <A
      href={getNavigationPath()}
      class={`flex items-center mx-1 rounded-xl cursor-pointer transition-all duration-300 relative group
        hover:bg-slate-800/50 hover:translate-x-1 hover:shadow-md no-underline
        ${props.isOpen ? "px-3 py-3" : "px-2 py-3 justify-center"}
        ${
          props.active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
            : "text-blue-100/90 hover:text-white"
        }`}
    >
      <div class="w-6 h-6 flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {props.icon}
      </div>
      <div
        class={`transition-all duration-300 overflow-hidden ${
          props.isOpen
            ? "ml-3 opacity-100 max-w-none"
            : "ml-0 opacity-0 max-w-0"
        }`}
      >
        <div class="font-medium text-sm leading-tight whitespace-nowrap">
          {props.title}
        </div>
        {props.isOpen && props.subtitle && (
          <div
            class={`text-xs mt-0.5 leading-tight whitespace-nowrap transition-colors duration-300 ${
              props.active ? "text-blue-200/80" : "text-blue-300/60"
            }`}
          >
            {props.subtitle}
          </div>
        )}
      </div>

      {/* Tooltip for collapsed state */}
      {!props.isOpen && (
        <div class="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-slate-700">
          <div class="font-medium text-sm">{props.title}</div>
          <div class="text-xs text-blue-200 mt-0.5">{props.subtitle}</div>
          {/* Arrow */}
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
        </div>
      )}
    </A>
  );
};

export default NavigationItem;
