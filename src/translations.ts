// src/translations.ts
export type Language = "en" | "ar";

export interface TranslatedValueCard {
  id: string;
  name: string;
  category: string;
  description: string;
  bgColor: string;
}

export const content = {
  en: {
    brandSub: "SMART TANK ASSESSMENT & RISK KEEPER",
    langToggle: "العربية",
    nav: [
      { label: "01 WORKFLOW", href: "#workflow" },
      { label: "02 METRICS", href: "#metrics" },
      { label: "03 ARCHITECTURE", href: "#architecture" },
      { label: "04 IMPACT", href: "#impact" },
    ],
    systemAccessBtn: "System Access",
    badge: "API 653 Compliant • Offline-First AI",
    h1: "Autonomous Tank Inspection.\nZero Cloud Dependency.",
    desc: "STARK transforms industrial tank inspections with on-device Computer Vision and API 653 calculations—shortening report turnaround from 48 hours to under 20 minutes with zero cloud dependency.",
    ctaPrimary: "Launch Live Demo",
    ctaSecondary: "Technical Architecture",
    stat1Label: "Field Offline Operation",
    stat1Val: "100%",
    stat2Label: "Standard Compliance",
    stat2Val: "API 653",
    stat3Label: "Inference Speed",
    stat3Val: "Real-time",
    featureTitle: "Core Capabilities",
    f1Title: "Edge Computer Vision",
    f1Desc: "YOLO-powered defect and corrosion detection running locally on rugged hardware without internet connectivity.",
    f2Title: "API 653 Automated Reporting",
    f2Desc: "Instant calculation of minimum required wall thickness (t_min), corrosion rates, and next inspection dates.",
    f3Title: "Secure Local Storage",
    f3Desc: "Encrypted on-device database ensuring total data sovereignty for critical energy infrastructure.",
    hudHackathon: "ENERGY HACKATHON 2026 • OFFLINE-FIRST EDGE OS",
    hudSysCore: "SYS_CORE: v2.6.4",
    hudAirGapped: "AIR-GAPPED READY",
    hudStandardLabel: "STANDARD",
    hudStandardVal: "API 653 DETERMINISTIC",
    hudNetworkLabel: "NETWORK STATUS",
    hudNetworkVal: "ZERO CLOUD UPLINK",
    hudTurnaroundLabel: "TURNAROUND",
    hudTurnaroundVal: "< 20 MINUTES",
    hudVerificationLabel: "VERIFICATION",
    hudVerificationVal: "HUMAN-IN-THE-LOOP",
    hudSubtext: "OPERATIONAL READY // STARK EDGE OS // FIELD VISION ENGINE",
    workflowPre: "OPERATIONAL ARCHITECTURE",
    workflowTitle: "From Field Capture to Certified Audit in Minutes.",
    workflowDesc: "Four deterministic stages running entirely on-site with zero cloud dependency.",
    inspectBtn: "Inspect Architecture & Inputs",
    stageLabel: "STAGE",
    engagedLabel: "ENGAGED",
    clickToEngage: "CLICK TO ENGAGE",
    modules: [
      {
        number: "01",
        title: "Field Image & UT\nIngestion",
        description: "Edge computer vision processes raw sensor feeds, crawler telemetry, and ultrasonic thickness (UT) gauge logs locally on-site.",
        bullets: [
          "Local Edge Inference (YOLO / TensorRT)",
          "Automatic Wall Grid Coordinate Lock",
          "Zero Data Transmission Outside Terminal"
        ]
      },
      {
        number: "02",
        title: "Historical Asset\nContext Integration",
        description: "Cross-references past inspection reports, baseline plate schedules, and historical corrosion records stored locally.",
        bullets: [
          "Corrosion Trend Interpolation",
          "Original vs. Measured Wall Tracking",
          "Multi-Year Degradation History"
        ]
      },
      {
        number: "03",
        title: "API 653 Formula\nRisk Calculation",
        description: "Deterministic evaluation of minimum acceptable thickness (t_min), corrosion rates, remaining safe life, and re-inspection intervals.",
        bullets: [
          "API 653 Section 4.3.3 Equation Engine",
          "Remaining Life (RL) Projection",
          "Critical Tank Shell Ring Course Assessment"
        ]
      },
      {
        number: "04",
        title: "Certified Inspector\nVerification & Sign-Off",
        description: "Generates an auditable compliance dossier, allowing certified inspectors to review, calibrate, and digitally stamp the report.",
        bullets: [
          "Tamper-Proof Audit Trail & Signature",
          "Instant Standardized Dossier Export",
          "Human-in-the-Loop Override Integrity"
        ]
      }
    ],
    // قسم القيمة المضافة
    impactTag: "04 Impact",
    impactTitle: "Strategic Value",
    impactDesc: "Measurable operational resilience for energy storage infrastructure.",
    deploySolutionBtn: "Deploy Solution",
    valueCardSubtitle: "API 653 COMPLIANCE READY • AIR-GAPPED VERIFICATION",
    strategicValues: [
      {
        id: "turnaround",
        name: "48h to 20m Acceleration",
        category: "Operational Efficiency",
        description: "Condenses days of paperwork and off-site data upload into deterministic, real-time reports certified directly at the tank wall.",
        bgColor: "#073B34"
      },
      {
        id: "sovereignty",
        name: "100% Data Sovereignty",
        category: "Industrial Security",
        description: "Keeps critical tank wall thickness, weld maps, and facility geometry strictly inside the facility perimeter with zero cloud footprint.",
        bgColor: "#084C42"
      },
      {
        id: "standards",
        name: "Deterministic API 653 Rigor",
        category: "Regulatory Compliance",
        description: "Eliminates heuristic AI hallucinations by combining neural defect segmentation with hardcoded, auditable API 653 mathematical formulas.",
        bgColor: "#0B5B4F"
      },
      {
        id: "downtime",
        name: "Preventive Unplanned Outages",
        category: "Asset Integrity",
        description: "Detects sub-surface corrosion and wall thinning years before scheduled turnaround windows, protecting terminal uptime.",
        bgColor: "#0E6E5F"
      }
    ],
    // قسم الخاتمة
    bannerPre: "DEVELOPED FOR THE MINISTRY OF ENERGY HACKATHON 2026",
    bannerH2Part1: "Deploy STARK to",
    bannerH2Part2: "Your Industrial Terminals.",
    bannerSub: "Deterministic calculations, edge computer vision, and cryptographic audit logs directly on ruggedized field units.",
    whitepaperBtn: "Review Technical Whitepaper",
    terminalAccessBtn: "Launch Terminal Access",
    footerCopyright: "© 2026 STARK (Smart Tank Assessment & Risk Keeper) • Team STARK-YIC",
    footerLocation: "Yanbu - Royal Commission for Jubail and Yanbu"
  },

  ar: {
    brandSub: "نظام الفحص الذكي وتقييم مخاطر الخزانات",
    langToggle: "English",
    nav: [
      { label: "01 مسار العمل", href: "#workflow" },
      { label: "02 المؤشرات", href: "#metrics" },
      { label: "03 المعايير والمقارنة", href: "#architecture" },
      { label: "04 القيمة المضافة", href: "#impact" },
    ],
    systemAccessBtn: "طلب تجربة النظام",
    badge: "معتمد وفق معيار API 653 • يعمل ذاتيًا دون إنترنت",
    h1: "فحص ميداني ذكي لخزانات الطاقة.\nبمعزل تام عن السحابة والإنترنت.",
    desc: "«ستارك» ينقل فحص الخزانات البترولية والصناعية إلى الميدان مباشرة؛ بالاعتماد على الرؤية الحاسوبية ومعادلات معيار API 653 الصارمة، ليختصر زمن إصدار التقارير من 48 ساعة إلى أقل من 20 دقيقة.",
    ctaPrimary: "معاينة النظام ميدانيًا",
    ctaSecondary: "المعمارية الهندسية",
    stat1Label: "تشغيل ميداني معزول (أوفلاين)",
    stat1Val: "100%",
    stat2Label: "الامتثال للمواصفات",
    stat2Val: "API 653",
    stat3Label: "سرعة المعالجة الميدانية",
    stat3Val: "لحظية (Real-time)",
    featureTitle: "الركائز الأساسية للمنظومة",
    f1Title: "رؤية حاسوبية طرفية",
    f1Desc: "نماذج YOLO لمعالجة الصور ورصد التآكل والشروخ مباشرة على أجهزة الفحص الميدانية دون الحاجة لأي اتصال بالإنترنت.",
    f2Title: "تقارير حسابية وفق معيار API 653",
    f2Desc: "حساب فوري لأدنى سُمك تشغيلي مسموح للجدران (t_min)، ومعدل التآكل السنوي، وتحديد موعد الفحص القادم بدقة.",
    f3Title: "حفظ محلي وحماية سيادية للبيانات",
    f3Desc: "قواعد بيانات محلية مشفرة بالكامل تضمن عدم خروج أي قراءة أو صورة لخزانات المنشأة الحيوية خارج الموقع.",
    hudHackathon: "هاكاثون الطاقة 2026 • نظام التشغيل الميداني المستقل",
    hudSysCore: "الإصدار: v2.6.4",
    hudAirGapped: "جاهز للعمل الميداني المعزول",
    hudStandardLabel: "المعيار الحسابي",
    hudStandardVal: "معادلات API 653 الهندسية",
    hudNetworkLabel: "الاتصال بالشبكة",
    hudNetworkVal: "مستقل تمامًا (صفر اعتماد سحابي)",
    hudTurnaroundLabel: "زمن استخراج التقرير",
    hudTurnaroundVal: "أقل من 20 دقيقة",
    hudVerificationLabel: "الاعتماد النهائي",
    hudVerificationVal: "إشراف المهندس الفاحص واعتماده",
    hudSubtext: "جاهز للعمل الميداني // محرك الفحص الذاتي // نظام ستارك",
    workflowPre: "مسار التفتيش الميداني",
    workflowTitle: "من التقاط القراءات إلى التقرير المعتمد في دقائق معدودة.",
    workflowDesc: "أربع مراحل متسلسلة تتم بالكامل في موقع الخزان، وتطابق أعلى المعايير الهندسية المعمول بها عالميًا.",
    inspectBtn: "استعراض تفاصيل المرحلة ومدخلاتها",
    stageLabel: "المرحلة",
    engagedLabel: "قيد التشغيل",
    clickToEngage: "اضغط لتفعيل المرحلة",
    modules: [
      {
        number: "01",
        title: "التقاط الصور\nوقراءات السُمك الميدانية",
        description: "معالجة فورية لصور الكاميرات وقراءات أجهزة السُمك فوق الصوتية (UT) في الموقع مباشرة دون انتظار رفع البيانات.",
        bullets: [
          "تحليل بصري محلي عبر تقنيات YOLO و TensorRT",
          "تثبيت وتحديد إحداثيات ألواح الجدار تلقائيًا",
          "عدم إرسال أي بايت خارج حدود المحطة أو المنشأة"
        ]
      },
      {
        number: "02",
        title: "ربط القراءات\nبسجل الخزان التاريخي",
        description: "مقارنة البيانات الحالية بالسماكات التصميمية الأساسية وتقارير الفحص السابقة المحفوظة محليًا لمعرفة مسار التآكل.",
        bullets: [
          "تتبع وتوقع وتيرة تآكل المعدن بدقة",
          "مقارنة السماكة الحالية بالسماكة الأصلية للألواح",
          "سجل تراكمي واضح لحالة كل حلقة في جدار الخزان"
        ]
      },
      {
        number: "03",
        title: "حساب السماكة والمخاطر\nوفق معادلات API 653",
        description: "تطبيق المعادلات الهندسية الصارمة لمعيار 653 لتحديد أدنى سُمك مسموح (t_min)، والعمر المتبقي، وتاريخ الفحص الدوري القادم.",
        bullets: [
          "محرك حسابي مطابق للفقرة 4.3.3 من مواصفة API 653",
          "حساب دقيق للعمر التشغيلي المتبقي (Remaining Life)",
          "تقييم دقيق لألواح الجدار وقيعان الخزانات الحساسة"
        ]
      },
      {
        number: "04",
        title: "اعتماد المهندس الفاحص\nوإصدار الشهادة",
        description: "توليد ملف تدقيق متكامل وموثق يُمكّن مهندس الفحص المعتمد من مراجعة النتائج، وإجراء التعديلات، وختم التقرير رقميًا.",
        bullets: [
          "سجل تدقيق رقمي مشفر غير قابل للتلاعب",
          "تصدير فوري لتقرير الفحص المعتمد بصيغ رسمية",
          "القرار النهائي والاعتماد بيد الفاحص البشري دائمًا"
        ]
      }
    ],
    // قسم القيمة المضافة
    impactTag: "04 القيمة المضافة",
    impactTitle: "العائد التشغيلي والاستراتيجي",
    impactDesc: "رفع الجاهزية التشغيلية وخفض تكاليف صيانة خزانات الطاقة الحيوية بأرقام ملموسة.",
    deploySolutionBtn: "تطبيق النظام في منشأتك",
    valueCardSubtitle: "مطابق لمعيار API 653 • تدقيق ميداني معزول بالكامل",
    strategicValues: [
      {
        id: "turnaround",
        name: "اختصار الوقت من 48 ساعة إلى 20 دقيقة",
        category: "الكفاءة التشغيلية",
        description: "تحويل أيام من الإجراءات اليدوية ونقل الملفات إلى تقارير لحظية ودقيقة تُعتمد وتُختم عند جدار الخزان مباشرة.",
        bgColor: "#073B34"
      },
      {
        id: "sovereignty",
        name: "سيادة وأمان تام لبيانات المنشأة بنسبة 100%",
        category: "الأمن الصناعي",
        description: "الحفاظ على مخططات السماكة، خرائط اللحامات، وهندسة الخزانات داخل النطاق الميداني للمحطة دون رفع أي بيانات للسحابة.",
        bgColor: "#084C42"
      },
      {
        id: "standards",
        name: "دقة هندسية حتمية وفق API 653",
        category: "الامتثال الرقابي",
        description: "منع أخطاء وهلوسات الذكاء الاصطناعي بربط الرؤية الحاسوبية بمعادلات هندسية رياضية صارمة وموثقة في كود المعيار.",
        bgColor: "#0B5B4F"
      },
      {
        id: "downtime",
        name: "حماية الخزانات من التوقفات الطارئة",
        category: "سلامة الأصول",
        description: "اكتشاف التآكل ونقص السماكة قبل مواعيد الفحص الدوري بسنوات، مما يحمي تدفق العمليات ويمنع التسربات الكارثية.",
        bgColor: "#0E6E5F"
      }
    ],
    // قسم الخاتمة
    bannerPre: "مشروع مُطوَّر لـ هاكاثون الطاقة 2026",
    bannerH2Part1: "جهّز محطاتك ومنشآتك بنظام",
    bannerH2Part2: "ستارك (STARK) للفحص الميداني الذكي.",
    bannerSub: "حسابات هندسية حتمية، رؤية حاسوبية طرفية، وسجلات فحص مشفرة تعمل مباشرة على أجهزة الفحص الميدانية المقاومة للصدمات.",
    whitepaperBtn: "الاطلاع على الملف التقني والمنهجية",
    terminalAccessBtn: "طلب تجربة النظام الميداني",
    footerCopyright: "© 2026 ستارك (STARK) لفحص وتقييم مخاطر الخزانات • فريق كلية ينبع الصناعية STARK-YIC",
    footerLocation: "ينبع الصناعية - الهيئة الملكية للجبيل وينبع"
  }
};
