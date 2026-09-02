import { CaseIntakePayload, SupportedDomainId } from '../types/legal';

export interface PrebuiltSampleCase {
  id: string;
  name: string;
  domainId: SupportedDomainId | 'unsupported_criminal' | 'unsupported_family';
  badgeLabel: string;
  summary: string;
  isUnsupported: boolean;
  unsupportedCategory?: string;
  intakeData: CaseIntakePayload;
}

export const PREBUILT_SAMPLE_CASES: PrebuiltSampleCase[] = [
  {
    id: 'sample-consumer-1',
    name: 'Defective 65" 4K Smart TV & Warranty Refusal',
    domainId: 'consumer',
    badgeLabel: 'Consumer Dispute (DCDRC)',
    summary: 'Purchased ₹74,999 TV on Flipkart. Screen developed horizontal black lines within 3 months. Authorized Brand Service Center claimed "internal panel stress" without inspection and refused warranty replacement.',
    isUnsupported: false,
    intakeData: {
      domainId: 'consumer',
      stateOfIncident: 'Karnataka',
      disputeTitle: 'Defective Television Panel - Denial of Warranty & Replacement',
      disputeDescription: 'I purchased a 65-inch 4K UHD Smart TV on 14th November 2024 for ₹74,999 from an authorized e-commerce seller with a 1-year comprehensive manufacturer warranty. On 10th February 2025, the display developed persistent black banding and screen flickering. An authorized technician visited on 16th February, took photos, and the brand subsequently issued a service rejection stating "panel physical stress / user mishandling" despite zero external scratches or impact. Both seller and manufacturer have refused repair, replacement, or refund.',
      complainantRole: 'Individual Consumer / Buyer',
      oppositePartyName: 'Apex Electronics India Pvt Ltd & Retail E-Commerce Seller',
      oppositePartyType: 'Manufacturer & Authorized Marketplace Platform',
      disputedAmountINR: 74999,
      incidentDate: '2025-02-16',
      noticeAlreadySent: false,
      agreementExists: true,
      documentText: `TAX INVOICE & WARRANTY REGISTRATION
Invoice No: BLR-EC-8839210 | Date of Purchase: 14-Nov-2024
Customer: Rahul Sharma, Indiranagar, Bengaluru, Karnataka
Item: Apex Vision 65" Ultra HD 4K OLED Smart TV (Model: APX-65-OLED)
Total Paid Amount: INR 74,999.00 (Incl. 18% GST)
Payment Mode: Online UPI Transaction ID: UPI/4318992011/ICICI

WARRANTY CLAUSE 4.1:
"The manufacturer warrants this product against defects in materials and workmanship under normal consumer use for a period of ONE (1) YEAR from the date of retail purchase. In the event of a covered defect, manufacturer will at its option (a) repair the product at no charge using new parts, (b) replace with a new unit, or (c) refund the purchase price."

SERVICE JOB SHEET #JS-2025-0216-09:
Technician Observation: Screen horizontal banding observed across active display. No external bezel crack detected. Serial number matches invoice.
Brand Decision Note (20-Feb-2025): "Warranty claim declined as per internal technical assessment of panel stress. Repair estimate for panel replacement: INR 48,500.00."`,
      domainSpecificAnswers: {
        productType: 'Consumer Electronics / Smart Appliance',
        warrantyValid: true,
        sellerContacted: true,
        deficiencyCategory: 'Defective Goods & Deficiency in Warranty Service',
        purchasePlatform: 'Online Authorized Marketplace'
      }
    }
  },
  {
    id: 'sample-tenancy-1',
    name: 'Unlawful Security Deposit Retention (₹1.8 Lakhs)',
    domainId: 'tenancy',
    badgeLabel: 'Tenancy Dispute (Bengaluru)',
    summary: 'Tenant vacated a 2BHK flat in Koramangala after serving 30-day notice following 2-year tenancy. Landlord withheld entire ₹1,80,000 security deposit citing "routine wall painting and deep cleaning".',
    isUnsupported: false,
    intakeData: {
      domainId: 'tenancy',
      stateOfIncident: 'Karnataka',
      disputeTitle: 'Illegal Withholding of Residential Rental Security Deposit',
      disputeDescription: 'I rented a 2BHK residential apartment in Koramangala, Bengaluru for a monthly rent of ₹36,000 and paid an interest-free refundable security deposit of ₹1,80,000 (5 months rent). After completing the 22-month tenancy, I served a written 30-day notice via email and WhatsApp on 1st January 2025 as per Clause 7 of the Rental Agreement. The apartment was handed over in clean condition on 31st January 2025 with video walkthrough evidence. However, the landlord has refused to refund any amount, arbitrarily claiming ₹1,20,000 for repainting the entire building and ₹60,000 for kitchen wear-and-tear.',
      complainantRole: 'Exiting Residential Tenant',
      oppositePartyName: 'Mr. V. Krishnamurthy (Landlord / Property Owner)',
      oppositePartyType: 'Individual Property Owner',
      disputedAmountINR: 180000,
      incidentDate: '2025-01-31',
      noticeAlreadySent: true,
      agreementExists: true,
      documentText: `RESIDENTIAL LEASE AGREEMENT (11-MONTH RENEWABLE)
Execution Date: 01-March-2023 | Premises: Flat 302, Green Meadows, 5th Block Koramangala, Bengaluru - 560095
Lessor: Mr. V. Krishnamurthy | Lessee: Ananya Sen

CLAUSE 3: SECURITY DEPOSIT
"The Lessee has paid a sum of Rs. 1,80,000/- (Rupees One Lakh Eighty Thousand only) as interest-free refundable Security Deposit. The said deposit shall be refunded by the Lessor to the Lessee simultaneously upon the Lessee peacefully vacating and handing over vacant physical possession of the Schedule Premises, after deducting any legitimate unpaid electricity/water utility bills or actual physical damages caused by the Lessee, normal wear and tear excepted."

CLAUSE 7: TERMINATION & NOTICE
"Either party may terminate this agreement by providing one (1) calendar month written notice in advance or rent in lieu thereof."

EVICTION / VACATION HANDOVER NOTE (Dated 31-Jan-2025):
Keys handed over to owner representative. Electricity meter reading: 4321 kWh (bill paid in full). Landlord WhatsApp text: "I have engaged painters and carpenters; the deposit will not be refunded due to total repainting requirement."`,
      domainSpecificAnswers: {
        rentalAmountMonthly: 36000,
        securityDepositPaid: 180000,
        noticePeriodGivenDays: 30,
        keysHandedOver: true,
        registeredAgreement: false,
        tenancyDurationMonths: 22
      }
    }
  },
  {
    id: 'sample-employment-1',
    name: 'Withheld F&F, Gratuity & Unlawful Non-Compete Notice',
    domainId: 'employment',
    badgeLabel: 'Employment & Labor Dispute',
    summary: 'Senior Developer with 5.5 years service resigned with 90-day notice. Employer withheld ₹3.4 Lakhs F&F settlement + ₹2.1 Lakhs Gratuity and issued legal threat citing 2-year non-compete clause.',
    isUnsupported: false,
    intakeData: {
      domainId: 'employment',
      stateOfIncident: 'Maharashtra',
      disputeTitle: 'Withholding of Full & Final Settlement, Gratuity & Unlawful Non-Compete Threat',
      disputeDescription: 'I worked as a Lead Software Architect at a SaaS company in Pune from 1st July 2019 to 15th January 2025 (5.5 continuous years). I submitted my resignation on 15th October 2024 and completed my contractual 90-day notice period in full with approved knowledge transfer sign-off. On my last working day, HR withheld my pending 2 months salary (₹2,20,000), leave encashment (₹1,20,000), and statutory gratuity (approx ₹2,10,000). Furthermore, because I accepted an offer at a FinTech enterprise, company legal counsel served a notice threatening civil injunction under Clause 14 (2-Year Non-Compete).',
      complainantRole: 'Exiting Full-Time Employee (Lead Engineer)',
      oppositePartyName: 'CloudScale Technologies India Private Limited',
      oppositePartyType: 'Private Limited IT Corporate Employer',
      disputedAmountINR: 550000,
      incidentDate: '2025-01-15',
      noticeAlreadySent: true,
      agreementExists: true,
      documentText: `EMPLOYMENT CONTRACT & NON-DISCLOSURE AGREEMENT
Employer: CloudScale Technologies India Pvt Ltd, Magarpatta Cybercity, Pune
Employee: Siddharth Nair | Designation: Lead Software Architect | DOJ: 01-July-2019 | LWD: 15-Jan-2025

CLAUSE 9: FULL & FINAL SETTLEMENT
"Upon successful separation and completion of notice period or handover requirements, the Company shall disburse all unpaid salary dues, bonus, and accrued leave encashment within 30 to 45 days from the Last Working Day."

CLAUSE 14: RESTRICTIVE COVENANT / NON-COMPETE (DISPUTED)
"For a period of twenty-four (24) months following the termination or resignation of employment for any reason, the Employee shall not directly or indirectly engage in, accept employment with, consult for, or provide software engineering services to any entity operating in the cloud or financial technology domain anywhere in India."

HR RELIEVING STATUS EMAIL (18-Jan-2025):
"Dear Siddharth, your F&F settlement and Gratuity are on hold pending verification of your new employer details to assess compliance with Clause 14 Restraint of Trade provisions."`,
      domainSpecificAnswers: {
        totalServiceYears: 5.5,
        noticePeriodServedFully: true,
        gratuityEligible: true,
        pfContributionActive: true,
        employmentType: 'Full-Time Confirmed Employee'
      }
    }
  },
  {
    id: 'sample-contract-1',
    name: 'B2B Software Vendor Breach & Forfeited Milestone Advance',
    domainId: 'contract',
    badgeLabel: 'Commercial Contract Dispute',
    summary: 'Retail SME paid ₹4,50,000 (60% milestone advance) for enterprise inventory ERP software. Vendor failed delivery deadline by 4 months, delivered unusable code, and refused refund citing boilerplate "no-refund" clause.',
    isUnsupported: false,
    intakeData: {
      domainId: 'contract',
      stateOfIncident: 'Delhi (NCT)',
      disputeTitle: 'Breach of Master Services Agreement & Recovery of Advance Consideration',
      disputeDescription: 'Our business signed a Master Services Agreement (MSA) on 1st August 2024 with a bespoke software agency to develop a multi-branch warehouse inventory management portal for a total contract value of ₹7,50,000. We disbursed 60% advance milestone payments totaling ₹4,50,000 upon contract signing and UI wireframe approval. The agreed Go-Live deadline was 30th November 2024. As of February 2025, the vendor has failed to provide functional backend APIs, missed 6 sprint demos, and abandoned communication. When we demanded termination and refund of the ₹4,50,000 advance under Section 73/74 ICA, they claimed advance fees are non-refundable.',
      complainantRole: 'Client Enterprise (Micro/Small Enterprise)',
      oppositePartyName: 'DevMatrix Solutions LLP',
      oppositePartyType: 'Limited Liability Partnership / Vendor Agency',
      disputedAmountINR: 450000,
      incidentDate: '2024-11-30',
      noticeAlreadySent: true,
      agreementExists: true,
      documentText: `MASTER SERVICES AGREEMENT (MSA)
Effective Date: 01-August-2024 | Client: Metro Retail Logistics Pvt Ltd | Service Provider: DevMatrix Solutions LLP

SECTION 2: PROJECT TIMELINE & MILESTONES
- Milestone 1 (UI/UX Wireframes): 15-Aug-2024 (Paid ₹1,50,000)
- Milestone 2 (Backend Core DB & API Integration): 30-Sep-2024 (Paid ₹3,000,000)
- Milestone 3 (Final UAT & Deployment): 30-Nov-2024 (Final ₹3,000,000 on acceptance)
Time is of the essence for all milestones.

SECTION 8: DEFAULT & REMEDIES
"If either party fails to cure a material breach within fifteen (15) days of written notice, the non-defaulting party may terminate this Agreement immediately. In the event of termination for Service Provider default, Service Provider shall promptly refund all unearned advance fees for uncompleted milestones."

SECTION 12: DISPUTE RESOLUTION & JURISDICTION
"Any dispute arising out of or in connection with this contract shall be subject to the exclusive jurisdiction of the competent courts in New Delhi."`,
      domainSpecificAnswers: {
        contractType: 'B2B Master Services Agreement / Vendor Delivery',
        timeIsEssence: true,
        advancePaidPercentage: 60,
        cureNoticeGiven: true,
        arbitrationClausePresent: false
      }
    }
  },
  {
    id: 'sample-unsupported-criminal',
    name: '🚨 Police Refusal to Register FIR in Cheating / Criminal Threat (Unsupported Scope)',
    domainId: 'unsupported_criminal',
    badgeLabel: 'Unsupported: Criminal Law (IPC/BNSS)',
    summary: 'Police refusing to register FIR under Section 420 / 506 IPC for criminal conspiracy and physical threat. Demonstrates LawLink’s strict scope restriction and safe legal aid redirection.',
    isUnsupported: true,
    unsupportedCategory: 'criminal',
    intakeData: {
      domainId: 'consumer', // fallback
      stateOfIncident: 'Uttar Pradesh',
      disputeTitle: 'Refusal of Local Police Station to Register FIR for Criminal Intimidation & Fraud',
      disputeDescription: 'An individual took ₹10 Lakhs in cash promising a government tender, issued a forged allotment letter, and when confronted, brought armed individuals to threaten my family. The local police station is refusing to lodge an FIR under Section 420 and 506 IPC / BNS. I want legal advice on how to file a criminal writ or section 156(3) magistrate application.',
      complainantRole: 'Complainant / Victim of Criminal Offence',
      oppositePartyName: 'Accused Individual & Local Police Sub-Inspector',
      oppositePartyType: 'Individual Accused & Law Enforcement Agency',
      disputedAmountINR: 1000000,
      incidentDate: '2025-01-10',
      noticeAlreadySent: false,
      agreementExists: false,
      domainSpecificAnswers: {}
    }
  },
  {
    id: 'sample-unsupported-family',
    name: '🚨 Contested Divorce & Child Custody Dispute (Unsupported Scope)',
    domainId: 'unsupported_family',
    badgeLabel: 'Unsupported: Family Law (HMA)',
    summary: 'Contested divorce petition, interim maintenance under Section 125 CrPC, and interim child custody dispute under Hindu Marriage Act. Demonstrates LawLink’s strict scope restriction.',
    isUnsupported: true,
    unsupportedCategory: 'family',
    intakeData: {
      domainId: 'consumer', // fallback
      stateOfIncident: 'Delhi (NCT)',
      disputeTitle: 'Contested Divorce, Interim Maintenance & Custody of 4-Year Old Child',
      disputeDescription: 'My spouse has filed for contested divorce under Section 13(1)(ia) of the Hindu Marriage Act alleging cruelty and seeking sole permanent custody of our 4-year-old child and ₹75,000 monthly interim maintenance under Section 125 CrPC / Section 24 HMA.',
      complainantRole: 'Respondent Spouse in Family Court',
      oppositePartyName: 'Petitioner Spouse',
      oppositePartyType: 'Individual Spouse',
      disputedAmountINR: 75000,
      incidentDate: '2024-12-01',
      noticeAlreadySent: false,
      agreementExists: false,
      domainSpecificAnswers: {}
    }
  }
];
