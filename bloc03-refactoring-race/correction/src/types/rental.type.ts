import type { VEHICULES } from "../constants/vehicules.ts";

export interface Rental {
    type: keyof typeof VEHICULES;
    days: number; 
    km: number;
    dates: string[];
    driverUnder25: boolean;
    loyalCustomer: boolean;
    tailLift?: boolean;
    gearIncluded?: boolean;
    spareBattery?: boolean;
  }
