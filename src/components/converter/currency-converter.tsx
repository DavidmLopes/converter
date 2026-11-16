"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Check, ChevronsUpDown } from "lucide-react";
import { useConversion } from "@/hooks/use-conversion";
import type { useCurrencyRates } from "@/hooks/use-currency-rates";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function Currency({
  rates: currencyRates,
  status,
  retry,
}: ReturnType<typeof useCurrencyRates>) {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");

  const { amount, result, changeAmount, changeResult, swap } = useConversion(
    fromCurrency,
    toCurrency,
    currencyRates,
  );

  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    swap();
  };

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="currencyAmount">Amount</Label>
        <Input
          id="currencyAmount"
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
                id="fromCurrency"
                role="combobox"
                disabled={status !== "ready"}
                aria-expanded={openFrom}
                className="w-full justify-between"
              >
                {fromCurrency}
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
          aria-label="Swap currencies"
          onClick={switchCurrencies}
        >
          <ArrowRightLeft />
        </Button>
        <div className="w-full space-y-1">
          <Label htmlFor="toCurrency">To</Label>
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="toCurrency"
                role="combobox"
                disabled={status !== "ready"}
                aria-expanded={openTo}
                className="w-full justify-between"
              >
                {toCurrency}
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
        <Label htmlFor="currencyResult">Result</Label>
        <Input
          id="currencyResult"
          type="number"
          inputMode="decimal"
          value={result}
          onChange={(e) => changeResult(e.target.value)}
        />
      </div>
      {status === "loading" && (
        <p role="status" className="sr-only">
          Loading exchange rates.
        </p>
      )}
      {status === "error" && (
        <div role="alert" className="text-sm text-destructive">
          Unable to load exchange rates.{" "}
          <button type="button" className="underline" onClick={retry}>
            Try again
          </button>
        </div>
      )}
    </>
  );
}
