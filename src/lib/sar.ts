import { addMonths } from "@/lib/date-utils";

// UK GDPR Art. 12(3): a subject access request must be responded to within
// one calendar month of receipt. Calculated as the corresponding date in
// the next month (clamped to that month's last day for month-end receipt
// dates — see addMonths in date-utils.ts).
export function calculateSarDueDate(receivedOn: Date): Date {
  return addMonths(receivedOn, 1);
}
