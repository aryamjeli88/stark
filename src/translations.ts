export interface TranslationStructure {
  nav: {
    systemBadge: string;
    offlineMode: string;
    requestDemo: string;
    langToggle: string;
    navLinks: {
      workflow: string;
      metrics: string;
      standards: string;
      value: string;
    };
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
    version: string;
    primaryCta: string;
    secondaryCta: string;
    stats: {
      stat1Value: string;
      stat1Label: string;
      stat1Sub: string;
      stat2Value: string;
      stat2Label: string;
      stat2Sub: string;
    };
  };
  mission: {
    tag: string;
    text: string;
  };
  featureCards: {
    card1Title: string;
    card1Desc: string;
    card1Tag: string;
    card2Title: string;
    card2Desc: string;
    card2Tag: string;
  };
}

export const translations: Record<'ar' | 'en', TranslationStructure> = {
  ar: {
    nav: {
      systemBadge: 'نظام ستارك',
      offlineMode: 'معتمد وفق معيار API 653 يعمل ذاتيًا دون إنترنت',
      requestDemo: 'طلب تجربة النظام',
      langToggle: 'ENGLISH',
      navLinks: {
        workflow: 'مسار العمل',
        metrics: 'المؤشرات',
        standards: 'المعايير والمقارنة',
        value: 'القيمة المضافة'
      }
    },
    hero: {
      badge: 'جاهز للعمل الميداني المباشر',
      titleLine1: 'فحص ميداني ذكي لخزانات',
      titleLine2: 'الطاقة',
      titleLine3: 'بمعزل تام عن السحابة والإنترنت',
      description: '«ستارك» ينقل فحص الخزانات البترولية والصناعية إلى الميدان مباشرةً؛ بالاعتماد على الرؤية الحاسوبية ومعادلات معيار API 653 الصارمة، ليختصر زمن إصدار التقارير من 48 ساعة إلى أقل من 20 دقيقة',
      version: 'الإصدار V2.6.4',
      primaryCta: 'معاينة النظام ميدانيًّا',
      secondaryCta: 'المعمارية الهندسية',
      stats: {
        stat1Value: 'معادلات API 653 الهندسية',
        stat1Label: 'المعيار الحسابي',
        stat1Sub: 'حسابات دقيقة للسمك المتبقي والعمر التشغيلي',
        stat2Value: 'أقل من 20 دقيقة',
        stat2Label: 'زمن استخراج التقرير',
        stat2Sub: 'معالجة فورية شاملة في الموقع'
      }
    },
    mission: {
      tag: 'الرسالة التشغيلية الأساسية',
      text: '«ستارك» ينقل فحص الخزانات البترولية والصناعية إلى الميدان مباشرةً؛ بالاعتماد على الرؤية الحاسوبية ومعادلات معيار API 653 الصارمة، ليختصر زمن إصدار التقارير من 48 ساعة إلى أقل من 20 دقيقة دون أي اتصال سحابي'
    },
    featureCards: {
      card1Title: 'حسابات API 653 محددة هندسيًّا',
      card1Desc: 'بالكامل مع معالجة الرؤية الحاسوبية على الطرفية، دون الحاجة لأي اتصال سحابي في المحطات النائية',
      card1Tag: 'جاهز للعمل الميداني // محرك الفحص الذاتي // نظام ستارك',
      card2Title: 'استجابة وتحليل فوري',
      card2Desc: 'رصد للعيوب والتآكل والتسريبات في أجزاء من الثانية مع تقديم توصيات صيانة حاسمة',
      card2Tag: 'تحليل الحافة // خوارزميات فائقة السرعة'
    }
  },
  en: {
    nav: {
      systemBadge: 'STARK SYSTEM',
      offlineMode: 'API 653 COMPLIANT • OFFLINE-FIRST AI',
      requestDemo: 'Request Access',
      langToggle: 'العربية',
      navLinks: {
        workflow: '01 Workflow',
        metrics: '02 Metrics',
        standards: '03 Standards & Comparison',
        value: '04 Value Proposition'
      }
    },
    hero: {
      badge: 'FIELD-READY SYSTEM',
      titleLine1: 'Autonomous Tank',
      titleLine2: 'Inspection',
      titleLine3: 'Zero Cloud Dependency',
      description: 'STARK transforms industrial tank inspections with on-device Computer Vision and API 653 calculations, shortening report turnaround from 48 hours to under 20 minutes with zero cloud dependency.',
      version: 'System Version V2.6.4',
      primaryCta: 'Explore Live Field Demo',
      secondaryCta: 'Technical Architecture',
      stats: {
        stat1Value: 'API 653 Standards',
        stat1Label: 'Calculation Engine',
        stat1Sub: 'Precision remaining-life assessments',
        stat2Value: '< 20 Mins',
        stat2Label: 'Report Turnaround',
        stat2Sub: 'Complete on-site automated generation'
      }
    },
    mission: {
      tag: 'CORE MISSION STATEMENT',
      text: 'STARK transforms industrial tank inspections with on-device Computer Vision and API 653 calculations—shortening report turnaround from 48 hours to under 20 minutes with zero cloud dependency.'
    },
    featureCards: {
      card1Title: 'API 653 Deterministic Engine',
      card1Desc: 'Fully integrated with edge Computer Vision, built for remote industrial sites without internet connection.',
      card1Tag: 'OFFLINE-FIRST ENGINE // STARK FRAMEWORK',
      card2Title: 'Real-Time Edge Analysis',
      card2Desc: 'Sub-second defect detection and corrosion mapping paired with automated maintenance action items.',
      card2Tag: 'EDGE AI // HIGH SPEED CALCULATIONS'
    }
  }
};

export const content = translations;