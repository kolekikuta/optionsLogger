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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button";
import { set } from "date-fns";


//PositionsTable.whyDidYouRender = true

const testPositions = [
    {
      id: 1,
      ticker: "AAPL",
      entry_date: "2024-11-01",
      expiration_date: "2024-12-20",
      exit_date: null,
      dte: 25,
      contract_type: "call",
      strike: 190,
      quantity: 1,
      entry_total: -230,
      entry_price: 2.30,
      entry_premium: 230,
      exit_price: null,
      exit_premium: null,
      exit_total: null,
      profit_loss: null,
      profit_loss_percent: null
    },
    {
      id: 2,
      ticker: "TSLA",
      entry_date: "2024-10-15",
      expiration_date: "2024-11-15",
      exit_date: "2024-10-28",
      dte: 0,
      contract_type: "put",
      strike: 220,
      quantity: 1,
      entry_total: -410,
      entry_price: 4.10,
      entry_premium: 410,
      exit_price: 2.80,
      exit_premium: 280,
      exit_total: 280,
      profit_loss: -130,
      profit_loss_percent: -31.7
    },
    {
      id: 3,
      ticker: "NVDA",
      entry_date: "2024-09-10",
      expiration_date: "2025-01-17",
      exit_date: null,
      dte: 90,
      contract_type: "call",
      strike: 900,
      quantity: 1,
      entry_total: -1200,
      entry_price: 12.00,
      entry_premium: 1200,
      exit_price: null,
      exit_premium: null,
      exit_total: null,
      profit_loss: null,
      profit_loss_percent: null
    }
  ];

export default function PositionsTable({ refreshKey, setRefreshKey }) {

  const supabase = createClient();
  const [session, setSession] = useState(null);

  const [positions, setPositions] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    }
    loadSession();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!session) return;

      const response = await axios.get(`${backendUrl}/api/positions`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      setPositions(response.data);
    };

    fetchPositions();
  }, [session, refreshKey]);




  async function handleEditSubmit() {
    if (!session) return;

    await axios.put(`${backendUrl}/api/positions/${editEntry.id}`,
      editEntry,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    setRefreshKey((prevKey) => prevKey + 1);
  }

  const onEdit = useCallback((entry) => {
    setEditEntry(entry);
    setIsEditOpen(true);
  }, []);

  const onDelete = useCallback((positionId) => {
    setDeleteId(positionId);
    setIsDeleteOpen(true);
  }, []);

  async function handleDeleteSubmit() {
    if (!session) return;

    try {
      await axios.delete(`${backendUrl}/api/positions/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to delete position", err);
    }
    setRefreshKey((prevKey) => prevKey + 1);
  }

  const columns = useMemo(() => positionsColumns({ onEdit, onDelete }), [ onEdit, onDelete ]);
  const data = useMemo(() => testPositions, []);

  const table = useReactTable({
      data: positions,
      columns: columns,
      getRowId: row => String(row.id),
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting,
        columnVisibility: {
          id: false,
          profit_loss_percent: false,
        },
      },
    });


  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
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
      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubmit}
            >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>

  );
}
