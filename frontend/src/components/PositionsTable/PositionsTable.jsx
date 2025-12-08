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
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import SortableHeader from "@/utils/SortableHeader";
import { parse } from "date-fns";

export default function PositionsTable({ refreshKey }) {
  const [positions, setPositions] = useState([]);
  const [sorting, setSorting] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("ticker", {
      header: ({ column }) => (
        <SortableHeader column={column} title="Ticker" />
    ),
      cell: (info) => (
        <span className="pl-2">{info.getValue()}</span>
      )
    }),
    columnHelper.accessor("entry_date", {
        header: ({ column }) => (
            <SortableHeader column={column} title="Entry Date" />
        ),
        cell: (info) => (
            <span className="pl-2">{info.getValue()}</span>
        )
    }),
    columnHelper.accessor("expiration_date", {
        header: ({ column }) => (
            <SortableHeader column={column} title="Expiration Date" />
        ),
        cell: (info) => (
            <span className="pl-2">{info.getValue() != null ? info.getValue() : "-"}</span>
        ),
    }),
    columnHelper.accessor("exit_date", {
        header: ({ column }) => (
            <SortableHeader column={column} title="Exit Date" />
        ),
        cell: (info) => (
            <span className="pl-2">{info.getValue() != null ? info.getValue() : "-"}</span>
        ),
    }),
    columnHelper.accessor("dte", {
        header: ({ column }) => (
            <SortableHeader column={column} title="DTE" />
        ),
        cell: (info) => {
            const dte = info.getValue();
            let styling = "text-white rounded-md px-2 ";
            if (dte > 30) {
                styling += " bg-green-700";
            } else if (dte <= 30 && dte >= 10) {
                styling += " bg-yellow-700";
            } else if (dte < 10 && dte !== null) {
                styling += " bg-red-700";
            }
            return (
                <div className="pl-2">
                    <span className={styling}>{info.getValue() != null ? info.getValue() : "-"}</span>
                </div>

            )
        },
    }),
    columnHelper.accessor("contract_type", {
        header: ({ column }) => (
            <SortableHeader column={column} title="Contract Type" />
        ),
        cell: (info) => {
            const value = info.getValue();
            const str = value.charAt(0).toUpperCase() + value.slice(1);
            let styling = "text-white rounded-md px-2 ";
            if (value === "call") {
                styling += "bg-green-700";
            } else if (value === "put") {
                styling += "bg-red-700";
            } else {
                styling += "bg-purple-700";
            }
            return (
                <div className="pl-2">
                    <span className={styling}>{str}</span>
                </div>

            )
        },
    }),
    columnHelper.accessor("strike", {
        header: "Strike",
        cell: ({ row }) => {
            return row.getValue("strike") != null ? row.getValue("strike") : "-";
        },
    }),
    columnHelper.accessor("entry_amount", {
        header: "Entry Amount",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("entry_total", {
        header: "Entry Total",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("entry_total"))
        }
    }),
    columnHelper.accessor("entry_price", {
        header: "Entry Price",
        cell: ({ row }) => {
            return formatCurrency(row.getValue("entry_price"))
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
    columnHelper.accessor("exit_total", {
        header: "Exit Total",
        cell: ({ row }) => {
            const value = row.getValue("exit_total");
            return value != null ? formatCurrency(value) : "-";
        },
    }),
    columnHelper.accessor("profit_loss", {
        header: "Profit / Loss",
        cell: ({ row }) => {
            const profit_loss = row.getValue("profit_loss");
            const profit_loss_percent = row.getValue("profit_loss_percent");
            let profit_loss_str = formatCurrency(profit_loss);

            let styling = "text-white rounded-md px-2 ";
            if (profit_loss != null && parseFloat(profit_loss) > 0) {
                profit_loss_str = `+${profit_loss_str}`;
                styling += "bg-green-700";
            } else if (profit_loss != null && parseFloat(profit_loss) < 0) {
                styling += "bg-red-700";
            }
            return (
                <span className={styling}>
                    <span className="font-bold">{profit_loss != null ? profit_loss_str : "-"}</span>
                    <span className="ml-1">{profit_loss_percent != null ? `(${profit_loss_percent}%)` : ""}</span>
                </span>

            );
        },
    }),
    columnHelper.accessor("profit_loss_percent", {
        id: "profit_loss_percent",
        header: () => null,
        cell: () => null,
        enableSorting: false,
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
  }, [refreshKey]);

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
      columnVisibility: {
        profit_loss_percent: false,
      },
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
