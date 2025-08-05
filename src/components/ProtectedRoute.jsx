import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children, type = "protected" }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <p>جارٍ التحقق...</p>;
  
  if (type === "protected") {
    // For protected routes - redirect to login if no session
    if (!session) return <Navigate to="/login" />;
    return children;
  } else if (type === "auth") {
    // For auth routes (login/signup) - redirect away if session exists
    if (session) return <Navigate to="/" />;
    return children;
  }

  return children;
}