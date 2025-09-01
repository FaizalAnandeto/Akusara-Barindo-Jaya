import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  ParentComponent,
  Accessor,
  Setter,
} from "solid-js";

export interface SettingsState {
  language: "en" | "id";
  theme: "light" | "dark";
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  defaultPage: "dashboard" | "security" | "finance" | "settings";
}

export interface SettingsContextType {
  settings: Accessor<SettingsState>;
  setLanguage: (language: "en" | "id") => void;
  setTheme: (theme: "light" | "dark") => void;
  updateNotifications: (
    notifications: Partial<SettingsState["notifications"]>
  ) => void;
  setDefaultPage: (page: SettingsState["defaultPage"]) => void;
}

const SettingsContext = createContext<SettingsContextType>();

export const SettingsProvider: ParentComponent = (props) => {
  // Load settings from localStorage or use defaults
  const loadSettings = (): SettingsState => {
    try {
      const saved = localStorage.getItem("akusara-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("Loaded settings from localStorage:", parsed);
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to load settings from localStorage:", error);
    }

    const defaultSettings: SettingsState = {
      language: "id" as const,
      theme: "light" as const,
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      defaultPage: "dashboard" as const,
    };
    
    console.log("Using default settings:", defaultSettings);
    return defaultSettings;
  };

  const [settings, setSettings] = createSignal<SettingsState>(loadSettings());

  // Save settings to localStorage
  const saveSettings = (newSettings: SettingsState) => {
    try {
      localStorage.setItem("akusara-settings", JSON.stringify(newSettings));
    } catch (error) {
      console.warn("Failed to save settings to localStorage:", error);
    }
  };

  // Apply theme to document
  const applyTheme = (theme: "light" | "dark") => {
    console.log("Applying theme:", theme);
    console.log("Current HTML classes before:", document.documentElement.className);
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
    
    console.log("Current HTML classes after:", document.documentElement.className);
    console.log("Theme applied successfully:", theme);
  };

  // Initialize theme on load
  console.log("Initial settings loaded:", settings());
  applyTheme(settings().theme);

  // React to theme changes
  createEffect(() => {
    console.log("Theme effect triggered, current theme:", settings().theme);
    applyTheme(settings().theme);
  });

  const setLanguage = (language: "en" | "id") => {
    const newSettings = { ...settings(), language };
    setSettings(newSettings);
    saveSettings(newSettings);
    console.log(
      `Language changed to: ${language === "id" ? "Indonesian" : "English"}`
    );

    // In a real app, you would trigger i18n updates here
    document.documentElement.lang = language === "id" ? "id-ID" : "en-US";
  };

  const setTheme = (theme: "light" | "dark") => {
    console.log("setTheme called with:", theme);
    const newSettings = { ...settings(), theme };
    setSettings(newSettings);
    saveSettings(newSettings);
    applyTheme(theme);
    console.log(`Theme changed to: ${theme}`);
    
    // Force a slight delay to ensure DOM updates
    setTimeout(() => {
      console.log("Final HTML classes:", document.documentElement.className);
    }, 100);
  };

  const updateNotifications = (
    notifications: Partial<SettingsState["notifications"]>
  ) => {
    const newSettings = {
      ...settings(),
      notifications: { ...settings().notifications, ...notifications },
    };
    setSettings(newSettings);
    saveSettings(newSettings);
    console.log("Notifications updated:", notifications);
  };

  const setDefaultPage = (defaultPage: SettingsState["defaultPage"]) => {
    const newSettings = { ...settings(), defaultPage };
    setSettings(newSettings);
    saveSettings(newSettings);
    console.log(`Default page changed to: ${defaultPage}`);
  };

  const contextValue: SettingsContextType = {
    settings,
    setLanguage,
    setTheme,
    updateNotifications,
    setDefaultPage,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {props.children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
