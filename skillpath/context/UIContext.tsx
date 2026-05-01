/* src/context/UIContext.tsx */
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type UIContextProps = {
  loaded: boolean;
  setLoaded: (v: boolean) => void;
};

const UIContext = createContext<UIContextProps | undefined>(undefined);
const PRELOADER_KEY = "preloader_shown_v7";

export const UIProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  /**
   * Lazy initializer – runs **once** on the client side.
   * If the key exists we start the app in “already‑loaded” mode.
   */
  const [loaded, setLoaded] = useState<boolean>(false);

  /**
   * Keep sessionStorage in sync – runs only in the browser.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (loaded) {
        window.sessionStorage.setItem(PRELOADER_KEY, "true");
      } else {
        window.sessionStorage.removeItem(PRELOADER_KEY);
      }
    } catch (e) {
      // Some browsers (private mode) throw on storage access.
      console.warn("[UIProvider] storage error:", e);
    }
  }, [loaded]);

  return (
    <UIContext.Provider value={{ loaded, setLoaded }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextProps => {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return ctx;
};
