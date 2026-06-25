import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface TemaContextType {
  oscuro: boolean;
  setOscuro: React.Dispatch<React.SetStateAction<boolean>>;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

interface TemaProviderProps {
  children: ReactNode;
}

export function TemaProvider({ children }: TemaProviderProps) {
  const [oscuro, setOscuro] = useState<boolean>(() => {
    return localStorage.getItem("tema") === "oscuro";
  });

  useEffect(() => {
    document.body.classList.toggle("tema-oscuro", oscuro);
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
  }, [oscuro]);

  return (
    <TemaContext.Provider value={{ oscuro, setOscuro }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema(): TemaContextType {
  const context = useContext(TemaContext);

  if (!context) {
    throw new Error("useTema debe usarse dentro de un TemaProvider");
  }

  return context;
}