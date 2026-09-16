// Generic starting-point templates — not legal advice. Review before use and
// adapt to the organisation's actual data processing activities.

export function privacyNoticeTemplate(organisationName: string): string {
  return `Privacy Notice — ${organisationName}

Last reviewed: [date]

1. Who we are
${organisationName} ("we", "us") is the data controller for the personal information we hold about you.

2. What information we collect
We may collect: your name, contact details, donation history, volunteering or membership records, and any information you give us when you contact us.

3. How we use your information
We use your information to: administer donations and Gift Aid claims, keep you updated about our work (where you've agreed to this), manage volunteering or membership, and meet our legal and regulatory obligations.

4. Legal basis
We rely on consent, legitimate interests, contract, and legal obligation as appropriate to each use above.

5. Sharing your information
We do not sell your data. We may share it with service providers who process it on our behalf (e.g. payment processors), and with regulators where required by law.

6. How long we keep it
See our data retention policy.

7. Your rights
You have the right to access, correct, delete, or restrict the use of your personal data, and to object to processing or ask us to transfer your data. Contact [contact details] to exercise these rights.

8. Complaints
You can complain to the Information Commissioner's Office (ICO) at ico.org.uk if you're unhappy with how we've handled your data.`;
}

export function dataRetentionPolicyTemplate(organisationName: string): string {
  return `Data Retention Policy — ${organisationName}

Last reviewed: [date]

Purpose
This policy sets out how long ${organisationName} keeps different categories of personal data, and why.

Retention schedule

Donor and Gift Aid records: 6 years after the end of the financial year they relate to (HMRC requirement).
Volunteer/trustee records: duration of involvement plus 6 years.
Safeguarding records: minimum 7 years, longer where required by safeguarding guidance or ongoing concerns.
Job applicant records (unsuccessful): 6 months, unless the applicant asks us to keep them longer.
General correspondence: 3 years, unless part of an ongoing matter.

Disposal
When the retention period ends, personal data is securely deleted or anonymised.

Review
This policy is reviewed annually or when relevant legislation changes.`;
}
