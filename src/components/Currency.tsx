"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowRightLeft, Check, ChevronsUpDown } from "lucide-react";
import { ICurrency } from "@/models/currency.model";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";

interface CurrencyProps {
  currencyRates: ICurrency;
}

export default function Currency({ currencyRates }: CurrencyProps) {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
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
          inputMode="decimal"
          value={amount}
          min={0}
          onChange={(e) => changeAmount(e.target.value)}
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="w-full space-y-1">
          <Label htmlFor="fromCurrency">From</Label>
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFrom}
                className="w-full justify-between"
              >
                {fromCurrency
                  ? Object.keys(currencyRates).find(
                      (currency) => currency === fromCurrency,
                    )
                  : "Select currency.."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search currency.." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {Object.keys(currencyRates).map((currency) => (
                      <CommandItem
                        key={currency}
                        value={currency}
                        onSelect={(currentValue) => {
                          setFromCurrency(currentValue);
                          setOpenFrom(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            fromCurrency === currency
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {currency}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTo}
                className="w-full justify-between"
              >
                {toCurrency
                  ? Object.keys(currencyRates).find(
                      (currency) => currency === toCurrency,
                    )
                  : "Select currency.."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search currency..." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {Object.keys(currencyRates).map((currency) => (
                      <CommandItem
                        key={currency}
                        value={currency}
                        onSelect={(currentValue) => {
                          setToCurrency(currentValue);
                          setOpenTo(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            toCurrency === currency
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {currency}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
