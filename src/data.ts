export interface ValueCard {
  id: string;
  name: string;
  category: string;
  bgColor: string;
  description: string;
  iconName: string;
}

export interface AreaItem {
  number: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface MetricItem {
  value: string;
  suffix?: string;
  prefix?: string;
  label: string;
  isText?: boolean;
}

export const NAV_LINKS = [
  { label: "01 WORKFLOW", href: "#workflow" },
  { label: "02 METRICS", href: "#metrics" },
  { label: "03 ARCHITECTURE", href: "#architecture" },
  { label: "04 IMPACT", href: "#impact" },
];

export const STANDARDS_MARQUEE = [
  "API 653 STANDARD",
  "EDGE COMPUTER VISION",
  "OFFLINE-FIRST OS",
  "AIR-GAPPED COMPLIANCE",
  "MINISTRY OF ENERGY 2026",
  "ASNT NDT LEVEL III",
  "CRYPTOGRAPHIC AUDIT",
  "ZERO CLOUD DEPENDENCY"
];

export const METRICS: MetricItem[] = [
  {
    prefix: "< ",
    value: "20",
    suffix: " Min",
    label: "Report Turnaround (from 48 Hours)"
  },
  {
    value: "100",
    suffix: "%",
    label: "Air-Gapped Offline Execution"
  },
  {
    value: "API 653",
    label: "Deterministic Engineering Logic",
    isText: true
  },
  {
    value: "Human-in-the-Loop",
    label: "Certified Engineer Verification",
    isText: true
  }
];

export const WORKFLOW_AREAS: AreaItem[] = [
  {
    number: "01",
    title: "Field Image\nIngestion",
    description:
      "Inspectors capture optical and thickness data directly on-site with local processing that operates flawlessly without internet connectivity.",
    bullets: [
      "Direct sensor input",
      "Zero bandwidth required",
      "Immediate metadata capture"
    ]
  },
  {
    number: "02",
    title: "Historical Asset\nContext",
    description:
      "Automated association with prior inspection timelines and tank shell logs to construct an unbroken degradation record.",
    bullets: [
      "Historical wall-loss trends",
      "Baseline alignment",
      "Instant asset retrieval"
    ]
  },
  {
    number: "03",
    title: "Risk Calculation\n& Priority",
    description:
      "Real-time calculation of minimum shell thickness (t_min), corrosion rates, and localized risk scoring (e.g. 82/100) based on API 653.",
    bullets: [
      "Deterministic corrosion rates",
      "Safe fill height margin",
      "Intervention scoring"
    ]
  },
  {
    number: "04",
    title: "Engineer Verification\n& Audit",
    description:
      "The certified engineer reviews, modifies, and signs the cryptographic inspection report on-device. AI flags, engineering calculates, human decides.",
    bullets: [
      "Human-in-the-loop signoff",
      "Cryptographic field stamps",
      "Auditable compliance log"
    ]
  }
];

export const STRATEGIC_VALUES: ValueCard[] = [
  {
    id: "field-reliability",
    name: "Field Reliability",
    category: "01 CONTINUOUS DEPLOYMENT",
    bgColor: "#073B34",
    description:
      "Continuous operation in remote terminals and zero-connectivity zones without operational downtime.",
    iconName: "shield"
  },
  {
    id: "cost-avoidance",
    name: "Cost Avoidance",
    category: "02 RISK MITIGATION",
    bgColor: "#09483F",
    description:
      "Early detection of pitting and corrosion prevents catastrophic asset failure and reduces unplanned shutdowns.",
    iconName: "alert"
  },
  {
    id: "operational-efficiency",
    name: "Operational Efficiency",
    category: "03 PROCESS VELOCITY",
    bgColor: "#065F46",
    description:
      "Eliminates redundant manual paperwork and reduces inspection reporting cycles by over 90%.",
    iconName: "zap"
  },
  {
    id: "asset-longevity",
    name: "Asset Longevity",
    category: "04 CRITICAL INFRASTRUCTURE",
    bgColor: "#047857",
    description:
      "Continuous tracking and compliance auditing safeguard national critical energy assets.",
    iconName: "activity"
  }
];

export const COMPARISON_DATA = {
  tag: "Core Philosophy",
  headline: "AI Discovers. Engineering Calculates. The Engineer Decides.",
  legacy: {
    title: "Fragmented Data & Delayed Decisions",
    tag: "Legacy Process",
    bullets: [
      "Data scattered across disparate systems",
      "Field photos detached from structural calculations",
      "Requires cloud uplinks in shielded terminal locations",
      "Days to weeks of turnaround latency"
    ]
  },
  stark: {
    title: "Unified Edge Intelligence",
    tag: "STARK Standard",
    bullets: [
      "Fully localized execution on ruggedized hardware",
      "API 653 formulas linked directly to detection coordinates",
      "Complete historical context with auditable lineage",
      "Actionable decisions made right at the asset"
    ]
  }
};
