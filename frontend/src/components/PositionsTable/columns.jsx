import SortableHeader from "@/utils/SortableHeader";
import ActionMenu from "./ActionMenu";
import ProgressBar from "./ProgressBar";
import DTE from "./dte";


function formatCurrency(value) {
    if (value == null || value === "" || isNaN(Number(value))) {
        return "-";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(value));
}

export const positionsColumns = ({ onEdit, onDelete, onMove }) => [
    {
        accessorKey: "id",
        enableSorting: false,
        header: () => null
    },

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
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const entryDate = row.getValue("entry_date");
      const expirationDate = row.getValue("expiration_date");
      const exitDate = row.getValue("exit_date");

      return (
        <ProgressBar
          entry={entryDate}
          expiration={expirationDate}
          exit={exitDate}/>
      );
    },
  },

  {
    accessorKey: "dte",
    header: ({ column }) => <SortableHeader column={column} title="DTE" />,
    cell: ({ row }) => {
      const dte = row.getValue("dte");
      const entryDate = row.getValue("entry_date");
      const expirationDate = row.getValue("expiration_date");
      const exitDate = row.getValue("exit_date");

      return (
        <DTE entry={entryDate} expiration={expirationDate} exit={exitDate} dte={dte} />
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
    accessorKey: "quantity",
    header: "Quantity",
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
    enableHiding: false,
    cell: ({ row }) => (
        <ActionMenu
          entry={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />

    ),
  },
];