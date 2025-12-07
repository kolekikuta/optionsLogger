import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/client';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default function PositionsTable() {
    const [positions, setPositions] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchPositions = async () => {
            const supabase = createClient();
            const {
                data : { session }
            } = await supabase.auth.getSession();

            if(!session) return;

            try {
                const response = await axios.get(`${backendUrl}/api/positions`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`
                        }
                    }
                );
                setPositions(response.data);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
    }
        fetchPositions();
    }, []);

    return (
        <>
            {positions && (
                positions.map((position) => (
                    <div key={position.id}>
                        <h3>{position.ticker} - {position.contract_type}</h3>
                        <p>Strike: {position.strike}</p>
                        <p>Quantity: {position.quantity}</p>
                        <p>Expiration: {position.expiration_date}</p>
                        <p>Entry Date: {position.entry_date}</p>
                        <p>Entry Price: {position.entry_price}</p>
                        <p>Entry Premium: {position.entry_premium}</p>
                        <hr />
                    </div>
                )
            ))}
        </>
    )


}