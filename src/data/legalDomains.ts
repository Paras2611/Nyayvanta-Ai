import { DomainMetadata, UnsupportedDomainId } from '../types/legal';

export const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Puducherry',
  'Other / Central Jurisdiction'
];

export const SUPPORTED_DOMAINS: Record<string, DomainMetadata> = {
  consumer: {
    id: 'consumer',
    title: 'Consumer Complaints',
    shortTitle: 'Consumer',
    tagline: 'Deficiency in services, defective products, unfair trade practices, and refund disputes',
    primaryActs: [
      'Consumer Protection Act, 2019',
      'Consumer Protection (E-Commerce) Rules, 2020',
      'Legal Metrology Act, 2009'
    ],
    primaryForums: [
      'District Consumer Commission (DCDRC - Up to ₹50 Lakh)',
      'State Consumer Commission (SCDRC - ₹50 Lakh to ₹2 Crore)',
      'National Consumer Commission (NCDRC - Above ₹2 Crore)',
      'E-Daakhil Online Filing Portal (edaakhil.nic.in)',
      'National Consumer Helpline (NCH - 1915)'
    ],
    typicalIssues: [
      'Defective electronic goods with warranty refusal',
      'E-commerce seller refusing replacement / refund for wrong delivery',
      'Airline / Hotel cancellation refusal during deficiency of service',
      'Misleading advertisements and non-delivery of promised features',
      'Excessive billing by telecom or utility provider'
    ],
    icon: 'ShieldAlert',
    colorScheme: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      border: 'hover:border-emerald-500/50',
      accent: 'emerald'
    }
  },
  tenancy: {
    id: 'tenancy',
    title: 'Rental & Tenancy Disputes',
    shortTitle: 'Tenancy',
    tagline: 'Unlawful security deposit withholding, illegal eviction, lease deed breach, and repair obligations',
    primaryActs: [
      'Transfer of Property Act, 1882 (Sections 105–111)',
      'State-specific Rent Control Acts (e.g., Delhi, Maharashtra, Karnataka)',
      'Model Tenancy Act, 2021 (as adopted by States)'
    ],
    primaryForums: [
      'Rent Authority / Rent Court (under Tenancy Act)',
      'Civil Court (Small Causes Court / Civil Judge Senior Division)',
      'Legal Services Authority / DLSA Pre-Litigation Mediation',
      'Consumer Commission (for rental brokerage deficiency only)'
    ],
    typicalIssues: [
      'Landlord withholding 100% security deposit on baseless painting/repair claims',
      'Forced eviction without 30-day statutory notice or lock-in compliance',
      'Unreasonable rent hikes during active fixed-term lease period',
      'Failure of landlord/tenant to execute registered lease deed',
      'Severe structural leakage or withholding of essential amenities (water/electricity)'
    ],
    icon: 'Home',
    colorScheme: {
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      border: 'hover:border-blue-500/50',
      accent: 'blue'
    }
  },
  employment: {
    id: 'employment',
    title: 'Employment & Labor Disputes',
    shortTitle: 'Employment',
    tagline: 'Unpaid wages, withheld gratuity, notice period disputes, post-employment non-compete issues',
    primaryActs: [
      'Industrial Disputes Act, 1947 (Section 2A & 25F)',
      'Payment of Gratuity Act, 1972',
      'Payment of Wages Act, 1936',
      'State Shops & Commercial Establishments Acts',
      'Indian Contract Act, 1872 (Section 27 - Restraint of Trade)'
    ],
    primaryForums: [
      'Labour Commissioner / Conciliation Officer',
      'Controlling Authority under Payment of Gratuity Act',
      'Labour Court / Industrial Tribunal',
      'Civil Court / Commercial Division'
    ],
    typicalIssues: [
      'Withholding of Full & Final (F&F) settlement and experience letter',
      'Illegal attempt to enforce 2-year non-compete clause (void under Sec 27 ICA)',
      'Non-payment of gratuity after completing 5 continuous years of service',
      'Abrupt wrongful termination during probation without contractual notice pay',
      'Excessive notice period recovery deducted from earned wages'
    ],
    icon: 'Briefcase',
    colorScheme: {
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      border: 'hover:border-purple-500/50',
      accent: 'purple'
    }
  },
  contract: {
    id: 'contract',
    title: 'Commercial & Civil Contracts',
    shortTitle: 'Contract',
    tagline: 'Breach of agreement, forfeiture of advance payment, liquidated damages vs penalty, SLA defaults',
    primaryActs: [
      'Indian Contract Act, 1872 (Sections 2(h), 37, 73, 74, 75)',
      'Specific Relief Act, 1963 (Section 10, 14, 20)',
      'Micro, Small & Medium Enterprises Development (MSMED) Act, 2006 (Sec 15–18)',
      'Commercial Courts Act, 2015'
    ],
    primaryForums: [
      'Commercial Court / Designated Commercial Division',
      'MSME Facilitation Council (MSME Samadhaan Portal)',
      'Arbitral Tribunal (pursuant to valid Arbitration Clause under A&C Act 1996)',
      'Civil Judge (Senior Division) for monetary recovery'
    ],
    typicalIssues: [
      'Vendor failure to deliver software/goods after receiving 50% milestone advance',
      'Unjust forfeiture of earnest money deposit without actual proven loss (Sec 74 ICA)',
      'Service Provider SLA default with refusal to execute contract exit terms',
      'Disputes regarding un-stamped or defectively executed master service agreements',
      'MSME delayed payment beyond 45 days with mandatory compound interest claim'
    ],
    icon: 'FileText',
    colorScheme: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      border: 'hover:border-amber-500/50',
      accent: 'amber'
    }
  }
};

export interface UnsupportedDomainDetails {
  category: UnsupportedDomainId;
  label: string;
  reason: string;
  keywords: string[];
  safeRedirection: {
    appropriateForum: string;
    freeLegalAidAgency: string;
    helplineNumber: string;
    keyAdvice: string;
    officialPortal?: string;
  };
}

export const UNSUPPORTED_DOMAINS_MAP: Record<UnsupportedDomainId, UnsupportedDomainDetails> = {
  criminal: {
    category: 'criminal',
    label: 'Criminal Offences & IPC/BNS Proceedings',
    reason: 'Criminal law involves state prosecution, custodial liberty, and criminal procedure under Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC, which is outside LawLink MVP scope.',
    keywords: ['fir', 'police', 'arrest', 'bail', 'ipc', 'bns', 'theft', 'fraud', 'cheating', '420', 'custody', 'assault'],
    safeRedirection: {
      appropriateForum: 'Nearest Police Station (for Zero FIR / e-FIR) or Judicial Magistrate First Class',
      freeLegalAidAgency: 'National Legal Services Authority (NALSA) or District Legal Services Authority (DLSA)',
      helplineNumber: '112 (Emergency Police) / 15100 (NALSA Legal Aid)',
      keyAdvice: 'Do not rely on automated AI tools for criminal proceedings. You have a constitutional right to legal representation under Article 39A and Section 340 BNSS / 304 CrPC.',
      officialPortal: 'https://nalsa.gov.in'
    }
  },
  murder: {
    category: 'murder',
    label: 'Homicide, Murder & Serious Physical Violence',
    reason: 'Non-bailable serious criminal offences under Bharatiya Nyaya Sanhita (BNS) / Section 302 IPC require immediate emergency police and legal counsel intervention.',
    keywords: ['murder', 'killing', 'homicide', 'manslaughter', '302', 'weapon', 'poison'],
    safeRedirection: {
      appropriateForum: 'Emergency Police Dispatch / Sessions Court',
      freeLegalAidAgency: 'DLSA High Court Legal Services Committee',
      helplineNumber: '112 (National Emergency)',
      keyAdvice: 'Immediately contact emergency emergency police dispatch at 112 or consult a designated criminal defence advocate.',
      officialPortal: 'https://police.gov.in'
    }
  },
  sexual_offences: {
    category: 'sexual_offences',
    label: 'Sexual Offences & POSH / POCSO Matters',
    reason: 'Matters under POSH Act, POCSO Act, and criminal sexual offences require sensitive statutory protection, internal complaints committees (ICC), and specialized legal safeguards.',
    keywords: ['posh', 'pocso', 'sexual harassment', 'rape', 'molestation', 'stalking', 'outrage modesty'],
    safeRedirection: {
      appropriateForum: 'Internal Complaints Committee (ICC) / Local Complaints Committee (LCC) / Special POCSO Court',
      freeLegalAidAgency: 'National Commission for Women (NCW) & District Legal Services Authority',
      helplineNumber: '7827170170 (NCW 24/7 Helpline) / 1091 (Women Helpline) / 1098 (Childline)',
      keyAdvice: 'Reach out to statutory women & child protection bodies or the internal complaints committee for confidential, protected assistance.',
      officialPortal: 'http://ncw.nic.in'
    }
  },
  constitutional: {
    category: 'constitutional',
    label: 'Constitutional Litigation & Writ Petitions',
    reason: 'Writ petitions under Article 226 (High Courts) or Article 32 (Supreme Court) challenging legislation or executive fundamental right violations require specialized constitutional counsel.',
    keywords: ['article 32', 'article 226', 'writ petition', 'habeas corpus', 'mandamus', 'fundamental right', 'unconstitutional', 'pil', 'public interest litigation'],
    safeRedirection: {
      appropriateForum: 'High Court (Article 226) or Supreme Court of India (Article 32)',
      freeLegalAidAgency: 'Supreme Court Legal Services Committee (SCLSC) / High Court Legal Services Committee',
      helplineNumber: '15100 (NALSA National Helpline)',
      keyAdvice: 'Consult a High Court / Supreme Court advocate on record to draft and sponsor a constitutional writ or Public Interest Litigation (PIL).',
      officialPortal: 'https://sclsc.nic.in'
    }
  },
  tax: {
    category: 'tax',
    label: 'Taxation, GST & Customs Disputes',
    reason: 'Direct and indirect tax assessments under Income Tax Act 1961 and CGST Act 2017 are handled by specialized appellate tribunals (ITAT, CESTAT, GSTAT).',
    keywords: ['income tax', 'gst', 'tax notice', 'scrutiny', 'tds', 'customs duty', 'itat', 'gst tribunal', 'tax penalty', 'section 148'],
    safeRedirection: {
      appropriateForum: 'National Faceless Appeal Centre (CIT Appeals) / ITAT / GST Appellate Authority',
      freeLegalAidAgency: 'Institute of Chartered Accountants of India (ICAI) Grievance or Tax Bar Association Legal Clinic',
      helplineNumber: '1800-180-1961 (Income Tax Helpline) / 1800-103-4786 (GST Helpdesk)',
      keyAdvice: 'Engage a Chartered Accountant (CA) or certified Tax Advocate to handle response to statutory scrutiny notices within the statutory 30-day timeline.',
      officialPortal: 'https://incometax.gov.in'
    }
  },
  property_title: {
    category: 'property_title',
    label: 'Complex Land Title, Partition & Inheritance Disputes',
    reason: 'Ancestral land partition, revenue record mutation, and title suits involve complex state revenue codes and localized succession laws outside LawLink rental/contract scope.',
    keywords: ['land title', 'ancestral property', 'partition suit', 'patta', 'khata', 'mutation', 'adverse possession', 'land grab', 'revenue court'],
    safeRedirection: {
      appropriateForum: 'Civil Court (Civil Judge Senior Division) or Tehsildar / Sub-Divisional Magistrate (SDM) Revenue Court',
      freeLegalAidAgency: 'District Legal Services Authority (DLSA) Property Division',
      helplineNumber: '15100 (NALSA Helpline)',
      keyAdvice: 'Conduct a certified 30-year Encumbrance Certificate (EC) search and consult a property title verification advocate in your local revenue sub-district.',
      officialPortal: 'https://nalsa.gov.in'
    }
  },
  corporate: {
    category: 'corporate',
    label: 'Corporate Mergers, NCLT & Insolvency (IBC)',
    reason: 'Corporate insolvency resolution process (CIRP), oppression and mismanagement, and NCLT company law proceedings fall outside consumer/general contract scope.',
    keywords: ['nclt', 'nclat', 'insolvency', 'ibc', 'bankruptcy', 'cirp', 'section 7', 'section 9 ibc', 'shareholder dispute', 'board resolution'],
    safeRedirection: {
      appropriateForum: 'National Company Law Tribunal (NCLT) / Insolvency & Bankruptcy Board of India (IBBI)',
      freeLegalAidAgency: 'Company Secretaries Institute (ICSI) Helpdesk',
      helplineNumber: '011-23441400 (MCA Corporate Helpline)',
      keyAdvice: 'Consult an Insolvency Professional (IP) or Corporate Advocate registered with the NCLT Bar Association.',
      officialPortal: 'https://nclt.gov.in'
    }
  },
  family: {
    category: 'family',
    label: 'Family Law, Divorce, Maintenance & Child Custody',
    reason: 'Matrimonial disputes under Hindu Marriage Act, Special Marriage Act, Guardians and Wards Act, and Domestic Violence Act require confidential family court mediation.',
    keywords: ['divorce', 'alimony', 'child custody', 'maintenance 125', 'dv act', 'domestic violence', 'matrimonial', 'hindu marriage act', 'restitution of conjugal rights'],
    safeRedirection: {
      appropriateForum: 'Designated Family Court / Protection Officer under DV Act / Court Annexed Mediation Centre',
      freeLegalAidAgency: 'District Legal Services Authority (DLSA) Women & Family Legal Cell',
      helplineNumber: '15100 (NALSA) / 181 (Women in Distress Helpline)',
      keyAdvice: 'Family courts in India mandatorily refer matters to court-appointed certified counselors and mediators before trial proceedings.',
      officialPortal: 'https://districts.ecourts.gov.in'
    }
  },
  immigration: {
    category: 'immigration',
    label: 'Immigration, Visa & Citizenship Disputes',
    reason: 'Citizenship, passport impoundment, FRRO foreign registration, and visa deportation are governed by the Foreigners Act and Ministry of External Affairs protocols.',
    keywords: ['visa', 'passport impound', 'frro', 'deportation', 'citizenship', 'caa', 'nrc', 'overstay', 'extradition'],
    safeRedirection: {
      appropriateForum: 'Foreigners Regional Registration Office (FRRO) / Bureau of Immigration / High Court (Writ)',
      freeLegalAidAgency: 'Ministry of External Affairs Grievance Cell (MADAD)',
      helplineNumber: '011-26192534 (FRRO Support) / 1800-11-3090 (MEA)',
      keyAdvice: 'File an online grievance on the MEA MADAD portal or submit a formal representation to the Regional Passport Office (RPO).',
      officialPortal: 'https://boi.gov.in'
    }
  },
  regulatory: {
    category: 'regulatory',
    label: 'Specialized Regulatory Litigation (SEBI, TRAI, CCI, NGT)',
    reason: 'Enforcement actions by specialized regulators like SEBI, Competition Commission of India, or National Green Tribunal operate under discrete statutory tribunals.',
    keywords: ['sebi', 'sat', 'insider trading', 'competition commission', 'cci', 'ngt', 'national green tribunal', 'environmental clearance', 'rbi penalty'],
    safeRedirection: {
      appropriateForum: 'Securities Appellate Tribunal (SAT) / NGT / CCI Appellate Tribunal',
      freeLegalAidAgency: 'SCORES (SEBI Complaints Redress System) / Respective Regulatory Ombudsman',
      helplineNumber: '1800-266-7575 (SEBI Toll Free)',
      keyAdvice: 'Lodge a formal grievance on the statutory regulator portal (e.g. SEBI SCORES or RBI CMS) before initiating formal appellate litigation.',
      officialPortal: 'https://scores.sebi.gov.in'
    }
  }
};
