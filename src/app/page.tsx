"use client";

import Currency from "@/components/Currency";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Units from "@/components/Units";

export default function Home() {
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
              <Currency />
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
