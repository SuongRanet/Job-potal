import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { Toaster } from "@/components/ui";
import { useAuth } from "@/store/auth";

export default function App() {
  const restore = useAuth((s) => s.restore);
  useEffect(() => {
    restore();
  }, [restore]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}
