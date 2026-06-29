import { createContext, useContext, useState, type ReactNode } from "react";

interface FeedCreateContextType {
  abierto: boolean;
  abrirFeed: () => void;
  cerrarFeed: () => void;
}

const FeedCreateContext = createContext<FeedCreateContextType | null>(null);

interface FeedCreateProviderProps {
  children: ReactNode;
}

export function FeedCreateProvider({ children }: FeedCreateProviderProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <FeedCreateContext.Provider
      value={{
        abierto,
        abrirFeed: () => setAbierto(true),
        cerrarFeed: () => setAbierto(false),
      }}
    >
      {children}
    </FeedCreateContext.Provider>
  );
}

export function useFeedCreate() {
  const context = useContext(FeedCreateContext);

  if (!context) {
    throw new Error("useFeedCreate debe usarse dentro de FeedCreateProvider");
  }

  return context;
}