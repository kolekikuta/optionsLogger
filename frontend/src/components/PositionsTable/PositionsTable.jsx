import axios from "axios";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/client";
import {
  createColumnHelper,
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


import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";


import { positionsColumns } from "./columns";


import EditDialog from "./EditDialog";




export default function PositionsTable({ refreshKey, setRefreshKey }) {
  const [positions, setPositions] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const columnHelper = createColumnHelper();

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
      entry_amount: 1,
      entry_total: -230,
      entry_price: 2.30,
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
      entry_amount: 1,
      entry_total: -410,
      entry_price: 4.10,
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
      entry_amount: 1,
      entry_total: -1200,
      entry_price: 12.00,
      exit_price: null,
      exit_premium: null,
      exit_total: null,
      profit_loss: null,
      profit_loss_percent: null
    }
  ];

  useEffect(() => {
    const fetchPositions = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      try {
        const response = await axios.get(`${backendUrl}/api/positions`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, [refreshKey]);




  function handleEditSubmit(e) {
    console.log("Edited Entry:", editEntry);
  }

  const onEdit = useCallback((entry) => {
    console.log("Editing entry:", entry);
    //setEditEntry(entry);
    setIsEditOpen(true);
  }, []);

  const onDelete = useCallback((positionId) => {
    console.log("Deleting position with ID:", positionId);
    //await axios.delete(`${backendUrl}/api/positions/${positionId}`);
    //setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const columns = useMemo(() => positionsColumns({ onEdit, onDelete }), []);
  // ------------------------------
  // Create React Table instance
  // ------------------------------




  const table = useReactTable({
      data: testPositions,
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
      />
    </>
  );
}
