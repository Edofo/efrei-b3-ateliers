import type { Rental } from "./types/rental.type.ts";
import { VEHICULES } from "./constants/vehicules.ts";

export const computePrice = (rental: Rental) => {

    if (!VEHICULES[rental.type]) {
        throw new Error(`Unknown vehicle type: ${rental.type}`);
    }

   const { BASE_PRICE, KM_PRICE, KM_THRESHOLD, INSURANCE_PRICE, INSURANCE_PRICE_UNDER_25, DEPOSIT, LABEL, TAIL_LIFT_PRICE, GEAR_PRICE, SP_BATTERY_PRICE } = VEHICULES[rental.type];

    let base = BASE_PRICE * rental.days;
    
    if (rental.km > KM_THRESHOLD) {
        base = base + (rental.km - KM_THRESHOLD) * KM_PRICE;
    }

    let insurance = INSURANCE_PRICE * rental.days;
    if (rental.driverUnder25) {
        insurance = insurance + INSURANCE_PRICE_UNDER_25 * rental.days;
    }

    const deposit = DEPOSIT;

    if (rental.tailLift) {
        base = base + TAIL_LIFT_PRICE * rental.days;
    }

    if (rental.gearIncluded) {
        base = base + GEAR_PRICE * rental.days;
    }

    if (rental.spareBattery) {
        base = base + SP_BATTERY_PRICE * rental.days;
    }

    let label = LABEL;

    return { base, insurance, deposit, label };

}