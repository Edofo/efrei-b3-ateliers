export interface Rental {
  type: string;
  days: number;
  km: number;
  dates: string[];
  driverUnder25: boolean;
  loyalCustomer: boolean;
  tailLift?: boolean;
  gearIncluded?: boolean;
  spareBattery?: boolean;
}

export interface Invoice {
  number: number;
  label: string;
  base: number;
  insurance: number;
  holidaySurcharge: number;
  discount: number;
  totalExclVat: number;
  vat: number;
  totalInclVat: number;
  deposit: number;
}

export interface Quote {
  label: string;
  totalExclVat: number;
  vat: number;
  totalInclVat: number;
  deposit: number;
}

export let lastInvoiceNumber = 0;
export let monthlyRevenue = 0;
let loyaltyDiscount = 0;

const PUBLIC_HOLIDAYS = ["2026-01-01", "2026-05-01", "2026-07-14", "2026-12-25"];

export function computeInvoice(rental: Rental): Invoice {
  lastInvoiceNumber = lastInvoiceNumber + 1;

  let base = 0;
  let insurance = 0;
  let deposit = 0;
  let label = "";

  if (rental.type === "car") {
    base = 45 * rental.days;
    if (rental.km > 200) {
      base = base + (rental.km - 200) * 0.25;
    }
    insurance = 12 * rental.days;
    if (rental.driverUnder25) {
      insurance = insurance + 8 * rental.days;
    }
    deposit = 800;
    label = "Car rental";
  } else if (rental.type === "van") {
    base = 70 * rental.days;
    if (rental.km > 150) {
      base = base + (rental.km - 150) * 0.35;
    }
    insurance = 18 * rental.days;
    if (rental.driverUnder25) {
      insurance = insurance + 8 * rental.days;
    }
    deposit = 1500;
    if (rental.tailLift) {
      base = base + 15 * rental.days;
    }
    label = "Van rental";
  } else if (rental.type === "motorbike") {
    base = 38 * rental.days;
    if (rental.km > 300) {
      base = base + (rental.km - 300) * 0.18;
    }
    insurance = 15 * rental.days;
    if (rental.driverUnder25) {
      insurance = insurance + 8 * rental.days;
    }
    deposit = 600;
    if (rental.gearIncluded) {
      base = base + 9 * rental.days;
    }
    label = "Motorbike rental";
  } else if (rental.type === "bike") {
    base = 12 * rental.days;
    insurance = 2 * rental.days;
    deposit = 150;
    if (rental.spareBattery) {
      base = base + 4 * rental.days;
    }
    label = "Electric bike rental";
  } else {
    throw new Error("Unknown vehicle type: " + rental.type);
  }

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
    label: label,
    base: Math.round(base * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    holidaySurcharge: Math.round(holidaySurcharge * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    totalExclVat: Math.round(total * 100) / 100,
    vat: vat,
    totalInclVat: Math.round((total + vat) * 100) / 100,
    deposit: deposit,
  };
}

export function computeQuote(rental: Rental): Quote {
  let base = 0;
  let insurance = 0;
  let deposit = 0;
  let label = "";

  if (rental.type === "car") {
    base = 45 * rental.days;
    if (rental.km > 200) {
      base = base + (rental.km - 200) * 0.25;
    }
    insurance = 12 * rental.days;
    if (rental.driverUnder25) {
      insurance = insurance + 8 * rental.days;
    }
    deposit = 800;
    label = "Car quote";
  } else if (rental.type === "van") {
    base = 70 * rental.days;
    if (rental.km > 150) {
      base = base + (rental.km - 150) * 0.35;
    }
    insurance = 18 * rental.days;
    if (rental.driverUnder25) {
      insurance = insurance + 8 * rental.days;
    }
    deposit = 1500;
    if (rental.tailLift) {
      base = base + 15 * rental.days;
    }
    label = "Van quote";
  } else if (rental.type === "motorbike") {
    base = 38 * rental.days;
    if (rental.km > 300) {
      base = base + (rental.km - 300) * 0.18;
    }
    insurance = 15 * rental.days;
    if (rental.driverUnder25) {
      insurance = insurance + 8 * rental.days;
    }
    deposit = 600;
    if (rental.gearIncluded) {
      base = base + 9 * rental.days;
    }
    label = "Motorbike quote";
  } else if (rental.type === "bike") {
    base = 12 * rental.days;
    insurance = 2 * rental.days;
    deposit = 150;
    if (rental.spareBattery) {
      base = base + 4 * rental.days;
    }
    label = "Electric bike quote";
  } else {
    throw new Error("Unknown vehicle type: " + rental.type);
  }

  let subtotal = base + insurance;
  let vat = Math.round(subtotal * 0.2 * 100) / 100;

  return {
    label: label,
    totalExclVat: Math.round(subtotal * 100) / 100,
    vat: vat,
    totalInclVat: Math.round((subtotal + vat) * 100) / 100,
    deposit: deposit,
  };
}

export function resetCounters(): void {
  lastInvoiceNumber = 0;
  monthlyRevenue = 0;
  loyaltyDiscount = 0;
}
