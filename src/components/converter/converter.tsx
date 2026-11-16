"use client";

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
          <Tabs defaultValue="currency" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="currency">Currency</TabsTrigger>
              <TabsTrigger value="units">Units</TabsTrigger>
            </TabsList>
            <TabsContent value="currency" className="grid gap-4 pt-2">
              <Currency {...currency} />
            </TabsContent>
            <TabsContent value="units" className="grid gap-4 pt-2">
              <Units />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
