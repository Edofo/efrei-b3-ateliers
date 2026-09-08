import { computePrice } from "./computePrice.ts";
import { PUBLIC_HOLIDAYS } from "./constants/holidays.ts";
import type { Invoice } from "./types/invoice.type.ts";
import type { Quote } from "./types/quote.invoice.ts";
import type { Rental } from "./types/rental.type.ts";

export type { Rental };

export let lastInvoiceNumber = 0;
export let monthlyRevenue = 0;
let loyaltyDiscount = 0;

export function computeInvoice(rental: Rental): Invoice {
  lastInvoiceNumber = lastInvoiceNumber + 1;

  const { base, insurance, deposit, label } = computePrice(rental);

  let holidaySurcharge = 0;
  for (let i = 0; i < rental.dates.length; i++) {
    for (let j = 0; j < PUBLIC_HOLIDAYS.length; j++) {
      if (rental.dates[i] === PUBLIC_HOLIDAYS[j]) {
        holidaySurcharge = holidaySurcharge + base / rental.days / 2;
      }
    }
  }

  if (rental.loyalCustomer) {
    loyaltyDiscount = 0.1;
  }

  let subtotal = base + insurance + holidaySurcharge;
  let discount = subtotal * loyaltyDiscount;
  let total = subtotal - discount;
  let vat = Math.round(total * 0.2 * 100) / 100;

  monthlyRevenue = monthlyRevenue + total;

  return {
    number: lastInvoiceNumber,
    label,
    base: Math.round(base * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    holidaySurcharge: Math.round(holidaySurcharge * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    totalExclVat: Math.round(total * 100) / 100,
    vat,
    totalInclVat: Math.round((total + vat) * 100) / 100,
    deposit,
  };
}

export function computeQuote(rental: Rental): Quote {
  const { base, insurance, deposit, label } = computePrice(rental);
  
  let subtotal = base + insurance;
  let vat = Math.round(subtotal * 0.2 * 100) / 100;

  return {
    label,
    totalExclVat: Math.round(subtotal * 100) / 100,
    vat,
    totalInclVat: Math.round((subtotal + vat) * 100) / 100,
    deposit,
  };
}

export function resetCounters(): void {
  lastInvoiceNumber = 0;
  monthlyRevenue = 0;
  loyaltyDiscount = 0;
}
