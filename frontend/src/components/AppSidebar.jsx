import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import { Folder, FolderOpen, Home, Settings, LogOut, CircleUserRound, Plus, FolderCog, Save } from "lucide-react"
import { Form, useLocation } from "react-router-dom"
import { useContext, useState } from "react"
import { FoldersContext, PositionsRefreshContext } from "@/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { createClient } from "@/lib/client"
import CreateDialog from "@/components/PositionsTable/CreateDialog"

// pull folder names and values from backend
// clicking on folder should change the positions shown in the main view


const pages = [
    {
        title: "Home",
        url: "/dashboard",
        icon: <Home size={16} />
    },
    {
        title: "Profile",
        url: "/dashboard",
        icon: <CircleUserRound size={16} />
    }
]


export default function AppSidebar() {
    const {folders, setFolders} = useContext(FoldersContext);
    const { refreshKey, setRefreshKey } = useContext(PositionsRefreshContext);
    const { setOpen } = useSidebar();
    const location = useLocation();
    const [newFolderName, setNewFolderName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleHomeClick = (e) => {
        if (location.pathname === "/dashboard") {
            e.preventDefault();
            setOpen(false);
        }
    };

    const toggleFolder = (id) => {
        setFolders((prev) =>
            prev.map((folder) =>
                folder.id === id ? { ...folder, open: !folder.open } : folder
            )
        );
    }

    async function handleCreateFolder(e) {
        e.preventDefault();

        if(!newFolderName.trim()) return;

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await axios.post(`${backendUrl}/api/folders/create`,
                { name: newFolderName },
                {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                }
            );
            setFolders(prev => [
                ...prev,
                {...res.data, open: false}
            ]);

            setNewFolderName("");
            setIsCreating(false);
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    }


    return (
        <Sidebar>
            <SidebarHeader>
                <h2 className="text-m font-semibold p-2">Options Logger</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {pages.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} onClick={item.title === "Home" ? handleHomeClick : undefined} className="flex items-center gap-2">
                                            {item.icon}
                                            {item.title}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Positions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <CreateDialog
                                    refreshKey={refreshKey}
                                    setRefreshKey={setRefreshKey}
                                    trigger={
                                        <SidebarMenuButton>
                                            <span className="flex items-center gap-2">
                                                <Plus size={16} />
                                                Create New Position
                                            </span>
                                        </SidebarMenuButton>
                                    }
                                />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Folders</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {folders.map((folder) => (
                                <SidebarMenuItem key={folder.id}>
                                    <SidebarMenuButton onClick={() => toggleFolder(folder.id)} className="flex items-center gap-2">
                                        {folder.open ? <FolderOpen size={16} /> : <Folder size={16} />}
                                        {folder.name}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                {isCreating ? (
                                    <form
                                        className="flex items-center gap-2"
                                        onSubmit={handleCreateFolder}>
                                        <input
                                            type="text"
                                            name="folder_name"
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            autoFocus
                                            className="flex-grow border-b border-gray-400 focus:outline-none"
                                        />
                                        <Button type="submit" variant="ghost" size="icon">
                                            <Save size={16} />
                                        </Button>
                                    </form>
                                ) : (

                                <SidebarMenuButton onClick={() => setIsCreating(true)}>
                                    <Plus size={16} />
                                    Create New Folder
                                </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/folders/manage" className="flex items-center gap-2">
                                        <FolderCog size={16} />
                                        Manage Folders
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/settings" className="flex items-center gap-2">
                                <Settings size={16} />
                                Settings
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Form method="post" action="/logout" >
                            <SidebarMenuButton asChild>
                                <button type="submit" className="w-full flex items-center gap-2 text-red-600 hover:bg-red-600/10">
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </SidebarMenuButton>
                        </Form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}