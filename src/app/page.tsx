"use client";

import Currency from "@/components/Currency";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Units from "@/components/Units";
import { useEffect, useState } from "react";
import { ICurrency } from "@/models/currency.model";

// Move the fetch function to the parent
async function getRates() {
  const response = await fetch("https://api.fxratesapi.com/latest", {
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });
  const data = await response.json();
  return data.rates;
}

export default function Home() {
  const [currencyRates, setCurrencyRates] = useState<ICurrency>({});

  useEffect(() => {
    getRates().then(setCurrencyRates);
  }, []);

  return (
    <div className="flex min-h-svh items-center justify-center overflow-hidden p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Converter
            <DarkModeToggle />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="currency" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="currency">Currency</TabsTrigger>
              <TabsTrigger value="units">Units</TabsTrigger>
            </TabsList>
            <TabsContent value="currency" className="space-y-4 pt-2">
              <Currency currencyRates={currencyRates} />
            </TabsContent>
            <TabsContent value="units" className="space-y-4 pt-2">
              <Units />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
