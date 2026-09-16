// Static referral list — placeholder entries, not real endorsed suppliers.
// A real build should replace this with an actual vetted panel, or pull
// live from the professional bodies linked below.
export type ExaminerListing = {
  name: string;
  credential: string;
  handles: string;
  region: string;
  contact: string;
};

export const EXAMINER_DIRECTORY: ExaminerListing[] = [
  {
    name: "Ashcroft Charity Accounts (placeholder)",
    credential: "ACIE Independent Examiner",
    handles: "Independent examination, receipts & payments accounts",
    region: "Nationwide (remote)",
    contact: "hello@example-examiner.co.uk",
  },
  {
    name: "Priya Mehta ACA (placeholder)",
    credential: "ICAEW Chartered Accountant",
    handles: "Independent examination, accruals accounts, qualified examiner tier",
    region: "London & South East",
    contact: "priya@example-accountant.co.uk",
  },
  {
    name: "Thornfield Audit Partners (placeholder)",
    credential: "Registered auditor (ICAEW)",
    handles: "Statutory audit",
    region: "Midlands & Nationwide",
    contact: "audits@example-thornfield.co.uk",
  },
  {
    name: "Community Books CIC (placeholder)",
    credential: "ACIE Independent Examiner",
    handles: "Independent examination for small charities and CICs",
    region: "North West",
    contact: "info@example-communitybooks.org.uk",
  },
];

export const REFERRAL_DIRECTORIES = [
  { name: "ICAEW — Find a Chartered Accountant", url: "https://www.icaew.com/regulation/find-a-chartered-accountant" },
  { name: "ACCA — Member search", url: "https://www.accaglobal.com/gb/en/member/find-an-accountant.html" },
  { name: "Association of Charity Independent Examiners (ACIE)", url: "https://www.acie.org.uk/" },
];
