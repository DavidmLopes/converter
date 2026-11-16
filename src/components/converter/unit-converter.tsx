"use client";

import { useState } from "react";
import { useConversion } from "@/hooks/use-conversion";
import { unitConversions } from "@/lib/conversion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

export default function Units() {
  const [unitType, setUnitType] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");

  const { amount, result, changeAmount, changeResult, swap } = useConversion(
    fromUnit,
    toUnit,
    unitConversions[unitType],
  );

  const switchUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    swap();
  };

  const changeUnitType = (type: string) => {
    changeAmount(amount.toString());
    setUnitType(type);
    const [from, to] = Object.keys(unitConversions[type]);
    setFromUnit(from);
    setToUnit(to);
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="unitType">Unit Type</Label>
        <Select value={unitType} onValueChange={changeUnitType}>
          <SelectTrigger id="unitType" className="w-full">
            <SelectValue placeholder="Select unit type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(unitConversions).map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unitAmount">Amount</Label>
        <Input
          id="unitAmount"
          type="number"
          inputMode="decimal"
          value={amount}
          min={0}
          onChange={(e) => changeAmount(e.target.value)}
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="grid min-w-0 flex-1 gap-2">
          <Label htmlFor="fromUnit">From</Label>
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger id="fromUnit" className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(unitConversions[unitType]).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="shrink-0"
          variant="outline"
          size="icon"
          aria-label="Swap units"
          onClick={switchUnits}
        >
          <ArrowRightLeft />
        </Button>
        <div className="grid min-w-0 flex-1 gap-2">
          <Label htmlFor="toUnit">To</Label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger id="toUnit" className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(unitConversions[unitType]).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unitResult">Result</Label>
        <Input
          id="unitResult"
          type="number"
          inputMode="decimal"
          value={result}
          onChange={(e) => changeResult(e.target.value)}
        />
      </div>
    </>
  );
}
