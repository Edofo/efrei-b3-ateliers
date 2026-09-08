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