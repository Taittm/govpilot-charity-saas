// UK tax year runs 6 April to 5 April. Label format matches HMRC convention: "2026/27".

export function taxYearLabelFor(date: Date): string {
  const startYear = date.getMonth() > 3 || (date.getMonth() === 3 && date.getDate() >= 6) ? date.getFullYear() : date.getFullYear() - 1;
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, "0")}`;
}

export function taxYearBounds(label: string): { start: Date; end: Date } {
  const startYear = Number(label.split("/")[0]);
  return {
    start: new Date(startYear, 3, 6), // 6 April
    end: new Date(startYear + 1, 3, 5, 23, 59, 59, 999), // 5 April following year
  };
}

export function currentTaxYearLabel(reference: Date = new Date()): string {
  return taxYearLabelFor(reference);
}

// The last 5 relevant tax years (current + 4 prior), most recent first —
// used for the "claimed Gift Aid in the current year or 2 of the last 4"
// eligibility check.
export function recentTaxYearLabels(reference: Date = new Date(), count = 5): string[] {
  const current = taxYearLabelFor(reference);
  const startYear = Number(current.split("/")[0]);
  return Array.from({ length: count }, (_, i) => {
    const y = startYear - i;
    return `${y}/${String((y + 1) % 100).padStart(2, "0")}`;
  });
}
