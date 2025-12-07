import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PositionsTable() {
  const [positions, setPositions] = useState([]);
  const [sorting, setSorting] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("ticker", {
      header: ({ column }) => {
        return (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Ticker
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("entry_date", {
        header: "Entry Date",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("expiration_date", {
        header: "Expiration Date",
        cell: (info) => {
            return info.getValue() != null ? info.getValue() : "-";
        },
    }),
    columnHelper.accessor("exit_date", {
        header: "Exit Date",
        cell: (info) => {
            return info.getValue() != null ? info.getValue() : "-";
        },
    }),
    columnHelper.accessor("dte", {
        header: "DTE",
        cell: (info) => {
            return info.getValue() != null ? info.getValue() : "-";
        },
    }),
    columnHelper.accessor("contract_type", {
        header: "Contract Type",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("strike", {
        header: "Strike",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("strike"))
        },
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
      cell: (info) => info.getValue(),
    }),


    columnHelper.accessor("entry_price", {
        header: "Entry Price",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("entry_price"))
        },
    }),
    columnHelper.accessor("entry_premium", {
        header: "Entry Premium",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("entry_premium"))
        },
    }),

    columnHelper.accessor("exit_price", {
        header: "Exit Price",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("exit_price"))
        },
    }),
    columnHelper.accessor("exit_premium", {
        header: "Exit Premium",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("exit_premium"))
        },
    }),
    columnHelper.accessor("profit_loss", {
        header: "Profit / Loss",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("profit_loss"))
        },
    })
  ];

  // ------------------------------
  // Fetch Positions
  // ------------------------------
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
  }, []);

  // ------------------------------
  // Create React Table instance
  // ------------------------------
  const table = useReactTable({
    data: positions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  function formatCurrency(value) {
    if (value == null || value === "" || isNaN(Number(value))) {
        return "-";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(value));
  }
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
    </>
  );
}
