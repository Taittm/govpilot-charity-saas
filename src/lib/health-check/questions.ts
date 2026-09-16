export type SectionKey =
  | "GOVERNANCE"
  | "SAFEGUARDING"
  | "FINANCIAL_CONTROLS"
  | "DATA_PROTECTION"
  | "FUNDRAISING"
  | "HR_VOLUNTEERING";

export type Question = {
  id: string;
  text: string;
  // Shown on the compliance kit when the answer isn't YES.
  remediation: string;
};

export type Section = {
  key: SectionKey;
  label: string;
  questions: Question[];
};

export const SECTIONS: Section[] = [
  {
    key: "GOVERNANCE",
    label: "Governance",
    questions: [
      {
        id: "gov-1",
        text: "Does the organisation have an up-to-date governing document (constitution / articles)?",
        remediation: "Locate or draft a current governing document and store it in the document vault.",
      },
      {
        id: "gov-2",
        text: "Has the trustee/director board met at least the minimum number of times required in the last 12 months?",
        remediation: "Schedule the outstanding board meetings and record minutes for each.",
      },
      {
        id: "gov-3",
        text: "Is there a documented conflicts-of-interest process, and is it actually used?",
        remediation: "Introduce a conflicts-of-interest register and ask the board to declare interests at each meeting.",
      },
      {
        id: "gov-4",
        text: "Are trustee/director terms, appointments, and retirements tracked and within the governing document's limits?",
        remediation: "Build a trustee register recording appointment and term-end dates for every board member.",
      },
    ],
  },
  {
    key: "SAFEGUARDING",
    label: "Safeguarding",
    questions: [
      {
        id: "safe-1",
        text: "Is there a written safeguarding policy covering children and/or vulnerable adults, reviewed in the last 12 months?",
        remediation: "Adopt or refresh a safeguarding policy and set a 12-month review reminder.",
      },
      {
        id: "safe-2",
        text: "Are DBS checks obtained for all roles that require them, before the person starts in that role?",
        remediation: "Audit current roles against DBS requirements and obtain outstanding checks via an umbrella body.",
      },
      {
        id: "safe-3",
        text: "Is there a named safeguarding lead who staff and volunteers know how to contact?",
        remediation: "Appoint a safeguarding lead and communicate their contact details to the whole team.",
      },
    ],
  },
  {
    key: "FINANCIAL_CONTROLS",
    label: "Financial controls",
    questions: [
      {
        id: "fin-1",
        text: "Are there at least two authorised signatories for payments, with dual authorisation above a set threshold?",
        remediation: "Update the bank mandate and payment process to require dual authorisation above an agreed threshold.",
      },
      {
        id: "fin-2",
        text: "Are annual accounts prepared and approved within the required deadline for the organisation's income tier?",
        remediation: "Confirm the correct accounts regime for the current financial year and diarise the preparation deadline.",
      },
      {
        id: "fin-3",
        text: "Is there a reserves policy, and are actual reserves in line with it?",
        remediation: "Agree a reserves policy with the board and compare current reserves against the target.",
      },
    ],
  },
  {
    key: "DATA_PROTECTION",
    label: "Data protection",
    questions: [
      {
        id: "dp-1",
        text: "Is the ICO data protection fee current and paid at the correct tier?",
        remediation: "Check the ICO register entry and renew or correct the fee tier.",
      },
      {
        id: "dp-2",
        text: "Is there a published privacy notice covering how personal data is collected and used?",
        remediation: "Adopt a privacy notice template and publish it where donors/beneficiaries can find it.",
      },
      {
        id: "dp-3",
        text: "Is there a process for handling data breaches and subject access requests within statutory timescales?",
        remediation: "Put a breach log and subject access request tracker in place with clear ownership.",
      },
    ],
  },
  {
    key: "FUNDRAISING",
    label: "Fundraising compliance",
    questions: [
      {
        id: "fund-1",
        text: "Are Gift Aid declarations correctly recorded and retained for all eligible donations?",
        remediation: "Audit Gift Aid declaration records and put a consistent retention process in place.",
      },
      {
        id: "fund-2",
        text: "If GASDS is claimed, is it tracked against the £8,000/year cap and the 10x-matched-claim rule?",
        remediation: "Set up a GASDS tracker to monitor the annual cap and the matched-claim ratio.",
      },
      {
        id: "fund-3",
        text: "Does fundraising activity follow the Fundraising Regulator's Code of Fundraising Practice?",
        remediation: "Review current fundraising materials and activity against the Code of Fundraising Practice.",
      },
    ],
  },
  {
    key: "HR_VOLUNTEERING",
    label: "HR & volunteering",
    questions: [
      {
        id: "hr-1",
        text: "Do all staff have a written contract or statement of terms?",
        remediation: "Issue written terms to any staff member currently without one.",
      },
      {
        id: "hr-2",
        text: "Is there a volunteer policy covering expenses, expectations, and how volunteers can raise concerns?",
        remediation: "Adopt a volunteer policy and share it with everyone currently volunteering.",
      },
      {
        id: "hr-3",
        text: "Is basic employment/volunteering insurance (e.g. employer's liability, public liability) in place and current?",
        remediation: "Check current insurance cover is adequate and in date; obtain quotes if not.",
      },
    ],
  },
];

export function findQuestion(questionId: string): { section: Section; question: Question } | undefined {
  for (const section of SECTIONS) {
    const question = section.questions.find((q) => q.id === questionId);
    if (question) return { section, question };
  }
  return undefined;
}
