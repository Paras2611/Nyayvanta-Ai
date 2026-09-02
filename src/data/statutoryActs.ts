import { StatutorySection } from '../types/legal';

export const STATUTORY_KNOWLEDGE_BASE: StatutorySection[] = [
  // CONSUMER PROTECTION ACT, 2019
  {
    id: 'cpa-sec-2-7',
    actName: 'Consumer Protection Act',
    year: 2019,
    sectionNumber: 'Section 2(7)',
    title: 'Definition of "Consumer"',
    keyRuleVerbatim: 'A person who buys any goods or hires/avails of any services for a consideration which has been paid or promised or partly paid and partly promised... but does not include a person who obtains goods for resale or for any commercial purpose.',
    plainEnglishExplanation: 'You qualify as a protected consumer under Indian law if you paid or agreed to pay for goods or services for personal use. Commercial buyers buying for resale or direct commercial profit are excluded.',
    relevanceToCase: 'Establishes legal locus standi (eligibility) to file a complaint before the Consumer Commission.',
    statutoryReferenceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection'
  },
  {
    id: 'cpa-sec-2-11',
    actName: 'Consumer Protection Act',
    year: 2019,
    sectionNumber: 'Section 2(11)',
    title: 'Definition of "Deficiency in Service"',
    keyRuleVerbatim: '"Deficiency" means any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance which is required to be maintained by or under any law for the time being in force or has been undertaken to be performed by a person in pursuance of a contract or otherwise in relation to any service.',
    plainEnglishExplanation: 'If a service provider (airline, hotel, hospital, builder, telecom, warranty center) delivers substandard service or fails to perform contractual commitments, it constitutes a statutory deficiency.',
    relevanceToCase: 'Primary legal ground to claim refund, damages, and compensation for mental agony.',
    statutoryReferenceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection'
  },
  {
    id: 'cpa-sec-35',
    actName: 'Consumer Protection Act',
    year: 2019,
    sectionNumber: 'Section 35 & 34',
    title: 'Jurisdiction of District Commission (DCDRC)',
    keyRuleVerbatim: 'The District Commission shall have jurisdiction to entertain complaints where the value of the goods or services paid as consideration does not exceed fifty lakh rupees. A complaint can be filed within the local limits of the place of residence or work of the complainant, or where the cause of action arose.',
    plainEnglishExplanation: 'For disputes with paid consideration up to ₹50 Lakhs, consumers can file directly in their home district or where they reside (including online via E-Daakhil), without traveling to the company’s headquarters.',
    relevanceToCase: 'Determines the appropriate local forum and territorial jurisdiction for claim filing.',
    statutoryReferenceUrl: 'https://edaakhil.nic.in'
  },
  {
    id: 'cpa-sec-69',
    actName: 'Consumer Protection Act',
    year: 2019,
    sectionNumber: 'Section 69',
    title: 'Statutory Limitation Period',
    keyRuleVerbatim: 'The District Commission, the State Commission or the National Commission shall not admit a complaint unless it is filed within two years from the date on which the cause of action has arisen.',
    plainEnglishExplanation: 'A consumer complaint must be filed within 2 years from the date of the incident (e.g. date of defective product delivery or final refusal by the seller). Delay can only be condoned if sufficient cause is demonstrated.',
    relevanceToCase: 'Enforces statutory deadline to ensure the claim is not time-barred.',
    statutoryReferenceUrl: 'https://consumeraffairs.nic.in'
  },
  {
    id: 'cpa-sec-84',
    actName: 'Consumer Protection Act',
    year: 2019,
    sectionNumber: 'Section 84 & 85',
    title: 'Product Liability of Manufacturer / Service Provider',
    keyRuleVerbatim: 'A product manufacturer or service provider shall be liable in a product liability action for harm or damage caused by a defective product or deficient service even if the complainant did not enter into a direct privity of contract.',
    plainEnglishExplanation: 'Manufacturers and brand owners cannot escape liability by pointing fingers at third-party sellers if the product is inherently defective.',
    relevanceToCase: 'Useful when e-commerce sellers and manufacturers deflect blame to one another.',
    statutoryReferenceUrl: 'https://consumeraffairs.nic.in'
  },

  // TRANSFER OF PROPERTY ACT & TENANCY
  {
    id: 'tpa-sec-106',
    actName: 'Transfer of Property Act',
    year: 1882,
    sectionNumber: 'Section 106',
    title: 'Duration of Certain Leases and Notice to Terminate',
    keyRuleVerbatim: 'In the absence of a contract or local law or usage to the contrary, a lease of immovable property for any other purpose than agricultural or manufacturing shall be deemed to be a lease from month to month, terminable, on the part of either lessor or lessee, by fifteen days’ notice.',
    plainEnglishExplanation: 'Residential leases operate on month-to-month or agreed contractual terms, and landlords cannot arbitrarily lock out or forcefully evict tenants without providing the stipulated notice (typically 15 to 30 days).',
    relevanceToCase: 'Prevents sudden unlawful lockouts and protects tenant possession rights.',
    statutoryReferenceUrl: 'https://indiacode.nic.in'
  },
  {
    id: 'tpa-sec-108',
    actName: 'Transfer of Property Act',
    year: 1882,
    sectionNumber: 'Section 108(m) & (q)',
    title: 'Rights and Liabilities of Lessor and Lessee (Security Deposit & Repairs)',
    keyRuleVerbatim: 'The lessee is bound to keep the property in as good condition as it was at the commencement of the lease, reasonable wear and tear and irresistible force excepted; and on the determination of the lease, the lessor is bound to refund the security deposit after adjusting legitimate admitted arrears.',
    plainEnglishExplanation: 'Landlords are legally prohibited from deducting routine "normal wear and tear" (faded wall paint, normal weathering) from the tenant’s security deposit. Deductions require documented proof of actual structural or material damage caused by tenant negligence.',
    relevanceToCase: 'Central legal ground for recovery of withheld rental security deposits.',
    statutoryReferenceUrl: 'https://indiacode.nic.in'
  },
  {
    id: 'mta-sec-13',
    actName: 'Model Tenancy Act / State Tenancy Rules',
    year: 2021,
    sectionNumber: 'Section 11 & 13',
    title: 'Ceiling on Security Deposit & Eviction Safeguards',
    keyRuleVerbatim: 'The security deposit to be paid by the tenant shall not exceed two months’ rent in case of residential premises. The security deposit shall be refunded to the tenant on vacating premises after making due deductions of any liabilities.',
    plainEnglishExplanation: 'Modern tenancy jurisprudence caps arbitrary multi-month security deposit demands and mandates immediate refund upon handover of keys.',
    relevanceToCase: 'Provides evidentiary backing against excessive deposit retention in urban centers (e.g. Bangalore, Pune, NCR).',
    statutoryReferenceUrl: 'https://mohua.gov.in'
  },

  // INDIAN CONTRACT ACT, 1872
  {
    id: 'ica-sec-27',
    actName: 'Indian Contract Act',
    year: 1872,
    sectionNumber: 'Section 27',
    title: 'Agreement in Restraint of Trade Void',
    keyRuleVerbatim: 'Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.',
    plainEnglishExplanation: 'Under Indian law (upheld by Supreme Court in Niranjan Shankar Golikari & Percept D’Mark), post-employment non-compete clauses prohibiting an employee from joining a competitor or working in the same industry after resignation are completely VOID and unenforceable.',
    relevanceToCase: 'Protects employees against employer intimidation regarding post-exit non-compete clauses.',
    statutoryReferenceUrl: 'https://indiacode.nic.in'
  },
  {
    id: 'ica-sec-73',
    actName: 'Indian Contract Act',
    year: 1872,
    sectionNumber: 'Section 73',
    title: 'Compensation for Loss or Damage Caused by Breach of Contract',
    keyRuleVerbatim: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach.',
    plainEnglishExplanation: 'The injured party in a breached contract is entitled to actual direct financial damages incurred. Remote or speculative indirect losses are not recoverable without prior express contemplation.',
    relevanceToCase: 'Establishes quantum of damages in commercial, freelance, and supply contract defaults.',
    statutoryReferenceUrl: 'https://indiacode.nic.in'
  },
  {
    id: 'ica-sec-74',
    actName: 'Indian Contract Act',
    year: 1872,
    sectionNumber: 'Section 74',
    title: 'Compensation for Breach of Contract Where Penalty Stipulated',
    keyRuleVerbatim: 'When a contract has been broken, if a sum is named in the contract as the amount to be paid in case of such breach, the party complaining of the breach is entitled to receive reasonable compensation not exceeding the amount so named, whether or not actual damage or loss is proved.',
    plainEnglishExplanation: 'Indian courts distinguish between genuine pre-estimates of loss and excessive "penalties" (Kailash Nath Associates v. DDA). A party cannot blindly forfeit huge advance deposits without establishing reasonable loss.',
    relevanceToCase: 'Crucial when a vendor or employer attempts to forfeit 100% advance or demand exorbitant bond penalties.',
    statutoryReferenceUrl: 'https://indiacode.nic.in'
  },

  // EMPLOYMENT & LABOR LAWS
  {
    id: 'pga-sec-4',
    actName: 'Payment of Gratuity Act',
    year: 1972,
    sectionNumber: 'Section 4 & 7',
    title: 'Mandatory Payment of Gratuity on Termination / Resignation',
    keyRuleVerbatim: 'Gratuity shall be payable to an employee on the termination of his employment after he has rendered continuous service for not less than five years: (a) on his superannuation, or (b) on his retirement or resignation, or (c) on his death or disablement.',
    plainEnglishExplanation: 'Any establishment with 10+ employees MUST pay statutory gratuity (approx 15 days wages per year of service) within 30 days of exit if the employee completed 4 years and 240 days (effectively 5 years) of continuous service. Withholding attracts mandatory 10% statutory simple interest.',
    relevanceToCase: 'Enforces statutory gratuity release with mandatory interest penalties against defaulting employers.',
    statutoryReferenceUrl: 'https://clc.gov.in'
  },
  {
    id: 'ida-sec-25f',
    actName: 'Industrial Disputes Act / Shops Act',
    year: 1947,
    sectionNumber: 'Section 25F & S&E Notice Provisions',
    title: 'Conditions Precedent to Retrenchment / Termination Notice',
    keyRuleVerbatim: 'No workman employed in any industry who has been in continuous service for not less than one year shall be retrenched until: (a) the workman has been given one month’s notice in writing indicating the reasons or paid wages in lieu of notice; (b) retrenchment compensation equivalent to 15 days average pay for every completed year.',
    plainEnglishExplanation: 'Employers cannot terminate confirmed employees without either giving full contractual notice or paying salary in lieu thereof, plus legitimate accrued earned leave and statutory retrenchment benefits.',
    relevanceToCase: 'Directly applicable in sudden wrongful layoffs and unpaid severance disputes.',
    statutoryReferenceUrl: 'https://labour.gov.in'
  },

  // MSME ACT
  {
    id: 'msme-sec-15-16',
    actName: 'Micro, Small & Medium Enterprises Development (MSMED) Act',
    year: 2006,
    sectionNumber: 'Section 15, 16 & 18',
    title: 'Statutory 45-Day Payment Deadline & Compound Interest Penalty',
    keyRuleVerbatim: 'Where any buyer buys any goods or services from a micro or small enterprise, the buyer shall make payment on or before the agreed date, not exceeding 45 days. Delayed payment mandates payment of compound interest with monthly rests at three times of the bank rate notified by the RBI.',
    plainEnglishExplanation: 'If you are a registered MSME / freelance consultant with Udyam registration, corporate clients must pay within 45 days maximum. Delays incur statutory 3x RBI interest rate by law, enforceable via MSME Samadhaan.',
    relevanceToCase: 'High-leverage recovery mechanism for vendor and commercial contract defaults.',
    statutoryReferenceUrl: 'https://samadhaan.msme.gov.in'
  }
];
