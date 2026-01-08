import axios from "axios";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/client";
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
import CreateDialog from "./CreateDialog";
import { motion, AnimatePresence } from "framer-motion";
import MoveDialog from "./MoveDialog";



/* ---------------- Main Component ---------------- */

export default function PositionsTable({ refreshKey, setRefreshKey }) {
  const supabase = createClient();

  const [session, setSession] = useState(null);
  const [positions, setPositions] = useState([]);
  const [sorting, setSorting] = useState([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [moveEntry, setMoveEntry] = useState(null);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /* ---------------- Auth ---------------- */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  /* ---------------- Fetch ---------------- */

  useEffect(() => {
    if (!session) return;

    axios
      .get(`${backendUrl}/api/positions`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      .then(res => setPositions(res.data));
  }, [session, refreshKey]);

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

  /* ---------------- Table ---------------- */

  const columns = useMemo(
    () => positionsColumns({ onEdit, onDelete, onMove }),
    [onEdit, onDelete]
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
              <AnimatePresence>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
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

      <CreateDialog refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
      <MoveDialog
        isOpen={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        entry={moveEntry}
        onSave={handleMoveSubmit}
      />
    </>
  );
}
