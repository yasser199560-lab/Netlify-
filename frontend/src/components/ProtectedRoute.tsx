import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Role } from "../types";

interface Props {
  allowedRoles: Role[];
}

// Client-side guard mirroring the backend's authorize() middleware.
// This is a UX convenience (hide/redirect nav) — the REAL enforcement
// always happens on the server, since a client check can be bypassed.
export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
