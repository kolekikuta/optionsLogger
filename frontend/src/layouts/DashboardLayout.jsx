import { useEffect, useState } from "react"
import React from "react"
import axios from "axios"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import AppSidebar from "@/components/AppSidebar"
import { createClient } from "@/lib/client"

export const FoldersContext = React.createContext(null);
export const PositionsRefreshContext = React.createContext(null);

export default function DashboardLayout() {
  const [folders, setFolders] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchFolders() {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const res = await axios.get(`${backendUrl}/api/folders`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setFolders(res.data.map(f => ({ ...f, open: false })));
    }
    fetchFolders();
  }, []);


  return (
    <>
      <FoldersContext.Provider value={{ folders, setFolders }}>
        <PositionsRefreshContext.Provider value={{ refreshKey, setRefreshKey }}>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-14 items-center gap-2 px-4">
              <SidebarTrigger />
            </header>
            <main>
              <Outlet />
            </main>
          </SidebarInset>
        </PositionsRefreshContext.Provider>
      </FoldersContext.Provider>
    </>
  )
}
