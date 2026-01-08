import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { useContext } from "react";
import { FoldersContext } from "@/layouts/DashboardLayout"
import axios from "axios";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

export default function MoveDialog({ isOpen, onClose, onSave, entry }) {
  const {folders, setFolders} = useContext(FoldersContext);
  const [selectedFolderIds, setSelectedFolderIds] = useState(new Set());
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchFolders() {
      if (!entry) return;
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      // fetch folders for this entry
      try {
        const res = await axios.get(`${backendUrl}/api/positions/${entry.id}/folders`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        const entryFolderIds = res.data.map(folder => folder.id);
        setSelectedFolderIds(new Set(entryFolderIds));
      } catch (error) {
        console.error("Error fetching folders for entry:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFolders();
  }, [isOpen, entry]);

  function handleSubmit(e) {
    e.preventDefault();
    onSave(entry, Array.from(selectedFolderIds));
    onClose();
  }


    return (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) onClose();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Move Position</DialogTitle>
              <DialogDescription>
                Add/remove position from a folder. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
              <form onSubmit={handleSubmit}>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-4 w-36 bg-muted rounded" />
                  </div>
                ) : (
                  folders.map(folder => (
                    <div key={folder.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`folder-${folder.id}`}
                        checked={selectedFolderIds.has(folder.id)}
                        onCheckedChange={(checked) => {
                          const newSet = new Set(selectedFolderIds);
                          checked ? newSet.add(folder.id) : newSet.delete(folder.id);
                          setSelectedFolderIds(newSet);
                        }}
                      />
                      <Label htmlFor={`folder-${folder.id}`}>
                        {folder.name}
                      </Label>
                    </div>
                  ))
                )}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={loading}>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    )
}


// dialog with checkbox list of folders
// on save, update folder assignment for position
