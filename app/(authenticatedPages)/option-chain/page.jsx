"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Activity } from "lucide-react";
import OptionsChainTable from "@/components/OptionChainTable";
import { useCookies } from "react-cookie";

const Header = ({ instrumentName, expiry }) => (
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
      <Activity className="text-primary" /> Options Chain Dashboard
    </h1>
    <p className="text-muted-foreground">
      {instrumentName} • Expiry: {expiry}
    </p>
  </div>
);

const StatCard = ({ title, value, subLabelLeft, subLabelRight }) => (
  <Card className="bg-muted/50 rounded-xl shadow-md">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {subLabelLeft && subLabelRight ? (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">{subLabelLeft}</span>
            <span className="text-red-600">{subLabelRight}</span>
          </div>
          <div className="text-lg font-bold text-foreground">{value}</div>
        </div>
      ) : (
        <div className="text-2xl font-bold text-foreground flex items-center gap-2">
          {value} <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
      )}
    </CardContent>
  </Card>
);

export default function OptionPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["access_token"]);

  const fetchOptionsChain = useCallback(async () => {
    try {
      const res = await axios.get("/api/option-chain", {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          Accept: "application/json",
        },
        params: {
          instrument_key: "NSE_INDEX|Nifty 50",
          expiry_date: "2025-07-10",
        },
      });

      const raw = res.data?.data || [];
      setData(raw);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [cookies.access_token]);

  useEffect(() => {
    let timeout;
    const recursiveFetch = async () => {
      await fetchOptionsChain();
      timeout = setTimeout(recursiveFetch, 300);
    };
    recursiveFetch();
    return () => clearTimeout(timeout);
  }, [fetchOptionsChain]);

  const firstRow = data?.[0];

  return (
    <SidebarInset className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 items-center gap-2 px-4 border-b">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        {loading ? (
          <div className="space-y-6">
            <Header instrumentName="Loading" expiry="..." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-muted/50 rounded-xl shadow-md">
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-muted/50 rounded-xl shadow-md">
              <CardContent className="p-6">
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : error || !firstRow ? (
          <Alert className="max-w-md bg-red-100 border-red-300 mx-auto mt-20">
            <AlertDescription className="text-red-700">
              Failed to load options chain data. {error || "No data found."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <Header
              instrumentName={firstRow.underlying_key}
              expiry={firstRow.expiry}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Spot Price"
                value={`₹${firstRow.underlying_spot_price?.toLocaleString(
                  "en-IN"
                )}`}
              />
              <StatCard
                title="Strike Price"
                value={`₹${firstRow.strike_price?.toLocaleString("en-IN")}`}
              />
              <StatCard title="PCR" value={firstRow.pcr?.toFixed(4)} />
            </div>

            <Card className="bg-muted/50 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /> Options Chain
                  <Badge variant="secondary" className="ml-auto">
                    Live Data
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <OptionsChainTable
                  data={data}
                  spotPrice={firstRow.underlying_spot_price}
                  expiry={firstRow.expiry}
                  instrumentName={firstRow.underlying_key}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
