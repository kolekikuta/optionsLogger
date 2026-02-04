import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { createClient } from '@/lib/client';
import { getCached } from '@/lib/cache'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { SelectedTickerContext } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from '../ui/button';



export default function Charts() {
    const supabase = createClient();
    const [session, setSession] = useState(null);
    const [timeframe, setTimeframe] = useState("ALL");

    const [data, setData] = useState([]);
    const { selectedTicker } = useContext(SelectedTickerContext);


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        async function loadSession() {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        }
        loadSession();
    }, []);

    useEffect(() => {
        if (!session) return;
        const fetchData = async () => {
            const { start, end } = getDateRange(timeframe);
            const symbol = selectedTicker || "SPY";
            const key = `ticker-history:${symbol}:${start}:${end}`

            const rows = await getCached(
                key,
                async () => {
                    const response = await axios.get(`${backendUrl}/api/ticker/history`, {
                        params: { symbol, start, end },
                        headers: { Authorization: `Bearer ${session.access_token}` },
                    })
                    return response.data.map(row => ({ date: row.date, close: row.close }))
                },
                5 * 60 * 1000 // 5 minutes
            )

            // For the "ALL" timeframe, reduce the number of plotted points to improve readability
            // Show every 20th datapoint and always include the last datapoint
            const displayedRows = timeframe === "ALL"
                ? rows.filter((_, i) => i % 20 === 0 || i === rows.length - 1)
                : rows

            setData(displayedRows)
        }
        fetchData()
    }, [session, timeframe, selectedTicker]);


    const chartConfig = {
        close : {
            label: "Close",
            color: "#3b82f6",
        },
    }

    function getDateRange(timeframe) {
        const end = new Date();
        const start = new Date(end);

        switch (timeframe) {
            case "1d":
            start.setDate(end.getDate() - 1);
            break;
            case "1w":
            start.setDate(end.getDate() - 7);
            break;
            case "1m":
            start.setMonth(end.getMonth() - 1);
            break;
            case "3m":
            start.setMonth(end.getMonth() - 3);
            break;
            case "YTD":
            start.setMonth(0, 1);
            break;
            case "1Y":
            start.setFullYear(end.getFullYear() - 1);
            break;
            case "ALL":
            default:
            return {
                start: "1993-01-01",
                end: end.toISOString().slice(0, 10),
            };
        }
        return {
            start: start.toISOString().slice(0, 10),
            end: end.toISOString().slice(0, 10),
        };
    }

    const timeframes = ["1d", "1w", "1m", "3m", "YTD", "1Y", "ALL"];


    return (
        <Card className="w-full bg-black/5 mb-8">
            <CardHeader>
                <div className="flex justify-between">
                    <div>
                        <CardTitle>{selectedTicker || "SPY"}</CardTitle>
                    </div>
                    <div>
                        {timeframes.map(tf => (
                            <Button
                                key={tf}
                                variant={timeframe === tf ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setTimeframe(tf)}
                            >
                                {tf}
                            </Button>
                        ))}
                    </div>

                </div>



            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart
                    key={`${timeframe}-${selectedTicker || 'SPY'}`}
                    accessibilityLayer
                    data={data}
                    margin={{
                    left: 12,
                    right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        domain={["auto", "auto"]}
                        tickLine={false}
                        axisLine={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Line
                        dataKey="close"
                        type="linear"
                        stroke="var(--color-close)"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}