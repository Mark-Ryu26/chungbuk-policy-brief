import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { requireSupabase } from "../lib/supabase";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    requireSupabase()
      .auth.getSession()
      .then(({ data }) => setStatus(data.session ? "signed-in" : "signed-out"))
      .catch(() => setStatus("signed-out"));
  }, []);

  if (status === "loading") return <Loading />;
  if (status === "signed-out") return <Navigate to="/admin/login" replace />;
  return children;
}
