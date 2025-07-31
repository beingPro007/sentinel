"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Info,
  Trash2,
  LineChart,
  BookOpen,
} from "lucide-react";

import PayoffChart from "@/components/payoff-chart";
import StrategyMetrics from "@/components/strategy-metrics";
import GreeksTable from "@/components/greeks-table";
import PLTable from "@/components/pl-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";


import { useEffect } from "react";

export default function OptionsStrategyBuilder() {
  const [prebuiltStrategies, setPrebuiltStrategies] = useState([]);
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [activeTab, setActiveTab] = useState("ready-made");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch("/api/strategies").then(res => res.json()),
      fetch("/api/user-trades").then(res => res.json()),
      fetch("/api/current-price").then(res => res.json()),
    ]).then(([strategies, trades, priceObj]) => {
      setPrebuiltStrategies(strategies);
      setSelectedTrades(trades);
      setCurrentPrice(priceObj.price);
    });
  }, []);



  const addTrade = () => {
    const newTrade = {
      id: Date.now().toString(),
      type: "B",
      expiry: "10 Jul",
      strike: 25500,
      optionType: "CE",
      lots: 1,
      price: 100,
      selected: true,
    };
    setSelectedTrades([...selectedTrades, newTrade]);
  };

  const removeTrade = (id) => {
    setSelectedTrades(selectedTrades.filter((trade) => trade.id !== id));
  };

  const updateTrade = (id, field, value) => {
    setSelectedTrades(
      selectedTrades.map((trade) =>
        trade.id === id ? { ...trade, [field]: value } : trade
      )
    );
  };

  const clearTrades = () => {
    setSelectedTrades([]);
  };

  const filteredStrategies = prebuiltStrategies.filter((strategy) => {
    if (strategyFilter === "all") return true;
    return strategy.type === strategyFilter;
  });

  if (!prebuiltStrategies.length || !selectedTrades.length || currentPrice === null) {
    return <div className="p-8 text-center text-gray-400">Loading strategies...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="flex h-16 items-center gap-2 px-4 border-b">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>
      

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">New Strategy</CardTitle>
                <Button
                  variant="link"
                  size="sm"
                  onClick={clearTrades}
                  className="text-blue-600 p-0"
                >
                  Clear New Trades
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {selectedTrades.filter((t) => t.selected).length} trades
                selected
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trade Builder */}
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-600">
                  <div>B/S</div>
                  <div>Expiry</div>
                  <div>Strike</div>
                  <div>Type</div>
                  <div>Lots</div>
                  <div>Price</div>
                </div>

                {selectedTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="grid grid-cols-6 gap-2 items-center"
                  >
                    <Checkbox
                      checked={trade.selected}
                      onCheckedChange={(checked) =>
                        updateTrade(trade.id, "selected", checked)
                      }
                    />
                    <Badge
                      variant={trade.type === "B" ? "default" : "destructive"}
                      className="w-6 h-6 p-0 flex items-center justify-center"
                    >
                      {trade.type}
                    </Badge>
                    <Select
                      value={trade.expiry}
                      onValueChange={(value) =>
                        updateTrade(trade.id, "expiry", value)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10 Jul">10 Jul</SelectItem>
                        <SelectItem value="17 Jul">17 Jul</SelectItem>
                        <SelectItem value="24 Jul">24 Jul</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          updateTrade(trade.id, "strike", trade.strike - 50)
                        }
                      >
                        -
                      </Button>
                      <Input
                        value={trade.strike}
                        onChange={(e) =>
                          updateTrade(
                            trade.id,
                            "strike",
                            parseInt(e.target.value)
                          )
                        }
                        className="h-8 text-xs text-center border-0 p-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          updateTrade(trade.id, "strike", trade.strike + 50)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Select
                      value={trade.optionType}
                      onValueChange={(value) =>
                        updateTrade(trade.id, "optionType", value)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={trade.lots.toString()}
                      onValueChange={(value) =>
                        updateTrade(trade.id, "lots", parseInt(value))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center">
                      <Input
                        value={trade.price}
                        onChange={(e) =>
                          updateTrade(
                            trade.id,
                            "price",
                            parseFloat(e.target.value)
                          )
                        }
                        className="h-8 text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => removeTrade(trade.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full" onClick={addTrade}>
                + Add Trade
              </Button>

              <div className="flex items-center gap-2">
                <Label htmlFor="multiplier" className="text-sm">
                  Multiplier
                </Label>
                <Select
                  value={multiplier.toString()}
                  onValueChange={(value) => setMultiplier(parseInt(value))}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Trade All</Button>
            </CardContent>
          </Card>

          {/* Strategy Templates */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 text-xs">
                  <TabsTrigger value="ready-made">Ready-made</TabsTrigger>
                  <TabsTrigger value="positions">Positions</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>

                <TabsContent value="ready-made" className="mt-4">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Please click on a ready-made strategy to load it
                    </div>

                    <Button variant="link" className="text-blue-600 p-0 h-auto">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Learn Options Strategies
                    </Button>

                    <div className="flex gap-1 flex-wrap">
                      {["all", "bullish", "bearish", "neutral"].map(
                        (filter) => (
                          <Button
                            key={filter}
                            variant={
                              strategyFilter === filter ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setStrategyFilter(filter)}
                          >
                            {filter === "bullish" && (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            )}
                            {filter === "bearish" && (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {filter === "neutral" && (
                              <Minus className="w-3 h-3 mr-1" />
                            )}
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </Button>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {filteredStrategies.map((strategy, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <CardContent className="p-3">
                            <div className="text-center">
                              <div className="w-12 h-8 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                                {strategy.type === "bullish" && (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                )}
                                {strategy.type === "bearish" && (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                {strategy.type === "neutral" && (
                                  <Minus className="w-4 h-4 text-gray-600" />
                                )}
                              </div>
                              <div className="text-xs font-medium">
                                {strategy.name}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Charts and Analysis */}
        <div className="lg:col-span-3 space-y-6">
          <StrategyMetrics
            trades={selectedTrades}
            currentPrice={currentPrice}
          />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Button variant="default" size="sm">
                    Payoff Graph
                  </Button>
                  <Button variant="ghost" size="sm">
                    P&L Table
                  </Button>
                  <Button variant="ghost" size="sm">
                    Greeks
                  </Button>
                  <Button variant="ghost" size="sm">
                    Strategy Chart
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="add-booked-pl" />
                  <Label htmlFor="add-booked-pl" className="text-sm">
                    Add Booked P&L
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payoff-graph" className="w-full">
                <TabsContent value="payoff-graph">
                  <PayoffChart
                    trades={selectedTrades}
                    currentPrice={currentPrice}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PLTable trades={selectedTrades} currentPrice={currentPrice} />
            <GreeksTable trades={selectedTrades} />
          </div>
        </div>
      </div>
    </div>
  );
}
