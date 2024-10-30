import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { ArrowRightLeft } from "lucide-react";

const currencyRates: {
  [key: string]: number;
} = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 73.51,
};

export default function Currency() {
  const [amount, setAmount] = useState<number | "">("");
  const [result, setResult] = useState<number | "">("");

  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");

  const changeAmount = (value: string) => {
    const numericValue = parseFloat(value);
    setAmount(value === "" ? "" : numericValue);
    setResult(
      value === ""
        ? ""
        : parseFloat(convertCurrency(numericValue, fromCurrency, toCurrency)),
    );
  };

  const changeResult = (value: string) => {
    const numericValue = parseFloat(value);
    setResult(value === "" ? "" : numericValue);
    setAmount(
      value === ""
        ? ""
        : parseFloat(convertCurrency(numericValue, toCurrency, fromCurrency)),
    );
  };

  const convertCurrency = (amount: number, from: string, to: string) => {
    return ((amount / currencyRates[from]) * currencyRates[to]).toFixed(2);
  };

  const switchCurrencies = () => {
    const auxCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(auxCurrency);
    const auxAmount = amount;
    setAmount(result);
    setResult(auxAmount);
  };

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="currencyAmout">Amount</Label>
        <Input
          id="currencyAmout"
          type="number"
          value={amount}
          min={0}
          onChange={(e) => changeAmount(e.target.value)}
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="w-full space-y-1">
          <Label htmlFor="fromCurrency">From</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger id="fromCurrency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(currencyRates).map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="shrink-0"
          variant="outline"
          size="icon"
          onClick={() => switchCurrencies()}
        >
          <ArrowRightLeft />
        </Button>
        <div className="w-full space-y-1">
          <Label htmlFor="toCurrency">To</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger id="toCurrency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(currencyRates).map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
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
          value={result}
          onChange={(e) => changeResult(e.target.value)}
        />
      </div>
    </>
  );
}
