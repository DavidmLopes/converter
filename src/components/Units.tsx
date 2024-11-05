import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { ArrowRightLeft } from "lucide-react";

const unitConversions: {
  [key: string]: {
    [key: string]: number;
  };
} = {
  length: {
    m: 1,
    cm: 100,
    km: 0.001,
    inch: 39.3701,
  },
  volume: {
    l: 1,
    ml: 1000,
    gal: 0.264172,
  },
  weight: {
    kg: 1,
    g: 1000,
    lb: 2.20462,
  },
};

export default function Units() {
  const [amount, setAmount] = useState<number | "">("");
  const [result, setResult] = useState<number | "">("");

  const [unitType, setUnitType] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");

  const changeAmount = (value: string) => {
    const numericValue = parseFloat(value);
    setAmount(value === "" ? "" : numericValue);
    setResult(
      value === ""
        ? ""
        : parseFloat(convertUnit(numericValue, fromUnit, toUnit, unitType)),
    );
  };

  const changeResult = (value: string) => {
    const numericValue = parseFloat(value);
    setResult(value === "" ? "" : numericValue);
    setAmount(
      value === ""
        ? ""
        : parseFloat(convertUnit(numericValue, toUnit, fromUnit, unitType)),
    );
  };

  const convertUnit = (
    amount: number,
    from: string,
    to: string,
    type: string,
  ) => {
    const baseValue = amount / unitConversions[type][from];
    return (baseValue * unitConversions[type][to]).toFixed(2);
  };

  const switchUnits = () => {
    const auxUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(auxUnit);
    const auxAmount = amount;
    setAmount(result);
    setResult(auxAmount);
  };

  const changeUnitType = (type: string) => {
    setUnitType(type);
    setFromUnit(Object.keys(unitConversions[type])[0]);
    setToUnit(Object.keys(unitConversions[type])[1]);
    changeAmount(amount.toString());
  };

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="unitType">Unit Type</Label>
        <Select value={unitType} onValueChange={changeUnitType}>
          <SelectTrigger id="unitType">
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
      <div className="space-y-1">
        <Label htmlFor="currencyAmout">Amount</Label>
        <Input
          id="currencyAmout"
          type="number"
          inputMode="decimal"
          value={amount}
          min={0}
          onChange={(e) => changeAmount(e.target.value)}
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="w-full space-y-1">
          <Label htmlFor="fromCurrency">From</Label>
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger id="fromCurrency">
              <SelectValue placeholder="Select currency" />
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
          onClick={() => switchUnits()}
        >
          <ArrowRightLeft />
        </Button>
        <div className="w-full space-y-1">
          <Label htmlFor="toCurrency">To</Label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger id="toCurrency">
              <SelectValue placeholder="Select currency" />
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
      <div className="space-y-1">
        <Label htmlFor="resultAmount">Result</Label>
        <Input
          id="resultAmount"
          type="number"
          inputMode="decimal"
          value={result}
          onChange={(e) => changeResult(e.target.value)}
        />
      </div>
    </>
  );
}
