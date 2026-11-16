"use client";

import { useState } from "react";
import Currency from "@/components/converter/currency-converter";
import DarkModeToggle from "@/components/dark-mode-toggle";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrencyRates } from "@/hooks/use-currency-rates";
import Units from "@/components/converter/unit-converter";

export default function Converter() {
  const currency = useCurrencyRates();
  const [activeTab, setActiveTab] = useState("currency");
  return (
    <div className="flex min-h-svh items-center justify-center overflow-hidden p-2">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <CardTitle>
            <h1 className="text-2xl">Converter</h1>
          </CardTitle>
          <CardAction>
            <DarkModeToggle />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="currency">Currency</TabsTrigger>
              <TabsTrigger value="units">Units</TabsTrigger>
            </TabsList>
            {/* Both panels size the grid; opacity hides the entire inactive layer immediately. */}
            <div className="grid">
              <TabsContent
                value="currency"
                forceMount
                inert={activeTab !== "currency"}
                aria-hidden={activeTab !== "currency"}
                className="col-start-1 row-start-1 grid content-start gap-4 pt-2 transition-none data-[state=inactive]:invisible data-[state=inactive]:opacity-0"
              >
                <Currency {...currency} />
              </TabsContent>
              <TabsContent
                value="units"
                forceMount
                inert={activeTab !== "units"}
                aria-hidden={activeTab !== "units"}
                className="col-start-1 row-start-1 grid content-start gap-4 pt-2 transition-none data-[state=inactive]:invisible data-[state=inactive]:opacity-0"
              >
                <Units />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
