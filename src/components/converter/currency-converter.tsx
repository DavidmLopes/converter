"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Check, ChevronsUpDown, Info } from "lucide-react";
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
      <div className="grid gap-2">
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
        <div className="grid min-w-0 flex-1 gap-2">
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
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
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
                            "size-4",
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
        <div className="grid min-w-0 flex-1 gap-2">
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
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
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
                            "size-4",
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
      <div className="grid gap-2">
        <Label htmlFor="currencyResult">Result</Label>
        <Input
          id="currencyResult"
          type="number"
          inputMode="decimal"
          value={result}
          onChange={(e) => changeResult(e.target.value)}
        />
      </div>
      <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          Rates from{" "}
          <a
            href="https://fxratesapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm underline underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            FXRatesAPI
          </a>
          .<span className="block">Cached for one hour.</span>
        </p>
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
