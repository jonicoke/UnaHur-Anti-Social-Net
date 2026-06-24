import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/authContext";

interface Props {
  children: ReactNode;
}

function RutaProtegida({ children }: Props) {
  const { usuario } = useAuth();
  return usuario ? <>{children}</> : <Navigate to="/login" replace />;
}

export default RutaProtegida;