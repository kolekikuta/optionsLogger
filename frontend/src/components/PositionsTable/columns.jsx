import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import SortableHeader from "@/utils/SortableHeader";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function formatCurrency(value) {
    if (value == null || value === "" || isNaN(Number(value))) {
        return "-";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(value));
}

async function onDelete(positionId) {
    console.log("Deleting position with ID:", positionId);
    //await axios.delete(`${backendUrl}/api/positions/${positionId}`);
    //setRefreshKey((prevKey) => prevKey + 1);
}

function onEdit(entry) {
    console.log("Editing entry:", entry);
}



export const positionsColumns = [
  {
    accessorKey: "ticker",
    header: ({ column }) => <SortableHeader column={column} title="Ticker" />,
    cell: ({ getValue }) => <span className="pl-2">{getValue()}</span>,
  },

  {
    accessorKey: "entry_date",
    header: ({ column }) => <SortableHeader column={column} title="Entry Date" />,
    cell: ({ getValue }) => <span className="pl-2">{getValue()}</span>,
  },

  {
    accessorKey: "expiration_date",
    header: ({ column }) => <SortableHeader column={column} title="Expiration Date" />,
    cell: ({ getValue }) => (
      <span className="pl-2">{getValue() != null ? getValue() : "-"}</span>
    ),
  },

  {
    accessorKey: "exit_date",
    header: ({ column }) => <SortableHeader column={column} title="Exit Date" />,
    cell: ({ getValue }) => (
      <span className="pl-2">{getValue() != null ? getValue() : "-"}</span>
    ),
  },

  {
    accessorKey: "dte",
    header: ({ column }) => <SortableHeader column={column} title="DTE" />,
    cell: ({ getValue }) => {
      const dte = getValue();
      let styling = "text-white rounded-md px-2 ";

      if (dte > 30) styling += "bg-green-700";
      else if (dte <= 30 && dte >= 10) styling += "bg-yellow-700";
      else if (dte < 10 && dte != null) styling += "bg-red-700";

      return (
        <div className="pl-2">
          <span className={styling}>{dte != null ? dte : "-"}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "contract_type",
    header: ({ column }) => <SortableHeader column={column} title="Contract Type" />,
    cell: ({ getValue }) => {
      const value = getValue();
      const label = value.charAt(0).toUpperCase() + value.slice(1);

      let styling = "text-white rounded-md px-2 ";
      if (value === "call") styling += "bg-green-700";
      else if (value === "put") styling += "bg-red-700";
      else styling += "bg-purple-700";

      return (
        <div className="pl-2">
          <span className={styling}>{label}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "strike",
    header: "Strike",
    cell: ({ getValue }) => {
      const v = getValue();
      return v != null ? v : "-";
    },
  },

  {
    accessorKey: "entry_amount",
    header: "Entry Amount",
    cell: ({ getValue }) => getValue(),
  },

  {
    accessorKey: "entry_total",
    header: "Entry Total",
    cell: ({ getValue }) => formatCurrency(getValue()),
  },

  {
    accessorKey: "entry_price",
    header: "Entry Price",
    cell: ({ getValue }) => formatCurrency(getValue()),
  },

  {
    accessorKey: "exit_price",
    header: "Exit Price",
    cell: ({ getValue }) => formatCurrency(getValue()),
  },

  {
    accessorKey: "exit_premium",
    header: "Exit Premium",
    cell: ({ getValue }) => formatCurrency(getValue()),
  },

  {
    accessorKey: "exit_total",
    header: "Exit Total",
    cell: ({ getValue }) => {
      const v = getValue();
      return v != null ? formatCurrency(v) : "-";
    },
  },

  {
    accessorKey: "profit_loss",
    header: "Profit / Loss",
    cell: ({ row, getValue }) => {
      const pl = getValue();
      const plPercent = row.getValue("profit_loss_percent");
      let plStr = formatCurrency(pl);

      let styling = "text-white rounded-md px-2 ";
      if (pl != null && pl > 0) {
        plStr = "+" + plStr;
        styling += "bg-green-700";
      } else if (pl != null && pl < 0) {
        styling += "bg-red-700";
      }

      return (
        <span className={styling}>
          <span className="font-bold">{pl != null ? plStr : "-"}</span>
          <span className="ml-1">
            {plPercent != null ? `(${plPercent}%)` : ""}
          </span>
        </span>
      );
    },
  },

  {
    accessorKey: "profit_loss_percent",
    id: "profit_loss_percent",
    enableSorting: false,
  },

  {
    id: "actions",
    accessorKey: undefined,
    cell: ({ row }) => {
      const entry = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(entry)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onDelete(entry.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];