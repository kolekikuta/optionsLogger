import axios from "axios";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { createClient } from "@/lib/client";
import { FoldersContext } from "@/layouts/DashboardLayout";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { positionsColumns } from "./columns";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import MoveDialog from "./MoveDialog";

/* ---------------- Main Component ---------------- */

export default function PositionsTable({ refreshKey, setRefreshKey }) {
  const supabase = createClient();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /* ---------------- Auth ---------------- */

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  /* ---------------- Context ---------------- */

  const { folders } = useContext(FoldersContext);

  /* ---------------- Caches (NO STATE) ---------------- */

  const positionsCacheRef = useRef([]);
  const folderPositionsMapRef = useRef({});
  const folderPositionSetRef = useRef({});

  /* ---------------- Fetch Once ---------------- */

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    async function fetchAll() {
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` };

        const [posRes, folderPosRes] = await Promise.all([
          axios.get(`${backendUrl}/api/positions`, { headers }),
          axios.get(`${backendUrl}/api/folders/positions`, { headers }),
        ]);

        if (cancelled) return;

        positionsCacheRef.current = posRes.data || [];
        folderPositionsMapRef.current = folderPosRes.data || {};

        // precompute Sets for fast lookup
        const setMap = {};
        for (const [fid, pids] of Object.entries(folderPositionsMapRef.current)) {
          setMap[fid] = new Set(pids.map(String));
        }
        folderPositionSetRef.current = setMap;
      } catch (err) {
        console.error("Error fetching positions:", err);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [session, refreshKey]);

  /* ---------------- Derived Positions (FAST) ---------------- */

  const positions = useMemo(() => {
    const all = positionsCacheRef.current;
    if (!all.length) return [];

    const openFolderIds = folders.filter(f => f.open).map(f => String(f.id));
    if (openFolderIds.length === 0) return all;

    const visibleIds = new Set();
    openFolderIds.forEach(fid => {
      const set = folderPositionSetRef.current[fid];
      if (!set) return;
      set.forEach(id => visibleIds.add(id));
    });

    console.log("Visible IDs:", visibleIds);

    return all.filter(p => visibleIds.has(p.id));
  }, [folders, refreshKey]);

  /* ---------------- Table State ---------------- */

  const [sorting, setSorting] = useState([]);

  /* ---------------- Dialog State ---------------- */

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveEntry, setMoveEntry] = useState(null);

  /* ---------------- Actions ---------------- */

  const onEdit = useCallback(entry => {
    setEditEntry(entry);
    setIsEditOpen(true);
  }, []);

  const onDelete = useCallback(id => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  }, []);

  const onMove = useCallback(entry => {
    setMoveEntry(entry);
    setIsMoveOpen(true);
  }, []);

  async function handleEditSubmit() {
    await axios.put(
      `${backendUrl}/api/positions/${editEntry.id}`,
      editEntry,
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    );
    setRefreshKey(k => k + 1);
  }

  async function handleDeleteSubmit() {
    await axios.delete(`${backendUrl}/api/positions/${deleteId}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setRefreshKey(k => k + 1);
  }

  async function handleMoveSubmit(entry, folderIds) {
    await axios.put(
      `${backendUrl}/api/positions/${entry.id}/folders`,
      { folder_ids: folderIds },
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    );
    setRefreshKey(k => k + 1);
  }

  /* ---------------- Columns ---------------- */

  const columns = useMemo(
    () => positionsColumns({ onEdit, onDelete, onMove }),
    [onEdit, onDelete, onMove]
  );

  const table = useReactTable({
    data: positions,
    columns,
    getRowId: row => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility: {
        id: false,
        profit_loss_percent: false,
      },
    },
  });

  /* ---------------- Render ---------------- */

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(group => (
              <TableRow key={group.id}>
                {group.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        entry={editEntry}
        onSave={handleEditSubmit}
        setEditEntry={setEditEntry}
      />

      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        handleDeleteSubmit={handleDeleteSubmit}
      />

      <MoveDialog
        isOpen={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        entry={moveEntry}
        onSave={handleMoveSubmit}
      />
    </>
  );
}
