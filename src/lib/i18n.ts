export type Lang = "ar" | "en";

export const translations = {
  nav: {
    home: { ar: "الرئيسية", en: "Home" },
    about: { ar: "عن الخدمة", en: "About" },
    how: { ar: "كيف تعمل", en: "How it works" },
    contact: { ar: "تواصل معنا", en: "Contact" },
    whatsapp: { ar: "واتساب", en: "WhatsApp" },
  },
  hero: {
    title: {
      ar: "ابحث عن سيارتك القادمة",
      en: "Find your next car",
    },
    desc: {
      ar: "أسعار واضحة · معاينة مباشرة",
      en: "Clear prices · In-person viewing",
    },
    ctaWa: { ar: "تواصل عبر واتساب", en: "Contact on WhatsApp" },
    ctaIg: { ar: "تابعنا على إنستغرام", en: "Follow on Instagram" },
    ctaBrowse: { ar: "تصفح السيارات", en: "Browse Cars" },
    badge: { ar: "AL MELAZ MOTORS", en: "AL MELAZ MOTORS" },
  },
  cars: {
    title: { ar: "السيارات", en: "Cars" },
    subtitle: {
      ar: "المتوفرة والمباعة — تصفّح واختر ما يناسبك",
      en: "Available and sold cars — browse and find what fits",
    },
    soon: { ar: "قريباً", en: "Coming Soon" },
    placeholder: {
      ar: "ستظهر هنا السيارات المتوفرة قريباً مع الصور والمواصفات والأسعار.",
      en: "Available cars with photos, specs and prices will appear here soon.",
    },
    inquire: { ar: "استفسر عبر واتساب", en: "Inquire on WhatsApp" },
    backHome: { ar: "العودة للرئيسية", en: "Back to Home" },
    viewDetails: { ar: "عرض التفاصيل", en: "View Details" },
    whatsapp: { ar: "واتساب", en: "WhatsApp" },
    noImage: { ar: "لا توجد صورة", en: "No image" },
    priceOnRequest: { ar: "السعر عند الطلب", en: "Price on request" },
    mileageUnit: { ar: "كم", en: "km" },
    resultsCount: { ar: "سيارة", en: "cars" },
    clearAll: { ar: "مسح الكل", en: "Clear all" },
    filtersTitle: { ar: "الفلاتر", en: "Filters" },
    badges: {
      featured: { ar: "مميزة", en: "Featured" },
      new: { ar: "جديد", en: "New" },
    },
    favorite: {
      add: { ar: "أضف للمفضلة", en: "Add to favorites" },
      remove: { ar: "إزالة من المفضلة", en: "Remove from favorites" },
    },
    labels: {
      brand: { ar: "الماركة", en: "Brand" },
      model: { ar: "الموديل", en: "Model" },
      trim: { ar: "الفئة", en: "Trim" },
      year: { ar: "السنة", en: "Year" },
      price: { ar: "السعر", en: "Price" },
      mileage: { ar: "الممشى", en: "Mileage" },
      color: { ar: "اللون", en: "Color" },
      origin: { ar: "المنشأ", en: "Origin" },
      city: { ar: "المدينة", en: "City" },
      transmission: { ar: "ناقل الحركة", en: "Transmission" },
      fuelType: { ar: "نوع الوقود", en: "Fuel type" },
      engineSize: { ar: "حجم المحرك", en: "Engine size" },
      drivetrain: { ar: "نظام الدفع", en: "Drivetrain" },
      condition: { ar: "الحالة", en: "Condition" },
    },
    status: {
      available: { ar: "متوفر", en: "Available" },
      sold: { ar: "مباع", en: "Sold" },
      reserved: { ar: "محجوز", en: "Reserved" },
      pending: { ar: "قيد المراجعة", en: "Pending" },
    },
    empty: {
      title: { ar: "لا توجد سيارات حالياً", en: "No cars available right now" },
      desc: {
        ar: "لم نعثر على سيارات مطابقة. تواصل معنا عبر واتساب وسنساعدك في إيجاد ما يناسبك.",
        en: "We couldn't find any matching cars. Contact us on WhatsApp and we'll help you find the right one.",
      },
    },
    error: {
      title: { ar: "تعذّر تحميل السيارات", en: "Couldn't load cars" },
      desc: {
        ar: "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.",
        en: "Something went wrong while fetching cars. Please try again.",
      },
      retry: { ar: "إعادة المحاولة", en: "Try again" },
    },
    pagination: {
      prev: { ar: "السابق", en: "Previous" },
      next: { ar: "التالي", en: "Next" },
      page: { ar: "صفحة", en: "Page" },
      of: { ar: "من", en: "of" },
      showing: { ar: "عرض", en: "Showing" },
      results: { ar: "سيارة", en: "cars" },
    },
    filters: {
      title: { ar: "تصفية السيارات", en: "Filter Cars" },
      mobileDesc: {
        ar: "اختر المعايير ثم اضغط تطبيق لعرض النتائج",
        en: "Choose criteria then tap apply to update results",
      },
      search: { ar: "بحث", en: "Search" },
      searchPlaceholder: { ar: "ابحث بالماركة أو الموديل...", en: "Search brand, model..." },
      sort: { ar: "ترتيب", en: "Sort" },
      bodyType: { ar: "نوع الهيكل", en: "Body type" },
      transmission: { ar: "ناقل الحركة", en: "Transmission" },
      fuelType: { ar: "نوع الوقود", en: "Fuel type" },
      condition: { ar: "الحالة", en: "Condition" },
      status: { ar: "حالة العرض", en: "Listing status" },
      all: { ar: "الافتراضي", en: "Default" },
      allBrands: { ar: "كل الماركات", en: "All brands" },
      allModels: { ar: "كل الموديلات", en: "All models" },
      allBodyTypes: { ar: "كل الأنواع", en: "All body types" },
      allColors: { ar: "كل الألوان", en: "All colors" },
      allOrigins: { ar: "كل المناشئ", en: "All origins" },
      allTransmissions: { ar: "كل ناقلات الحركة", en: "All transmissions" },
      allFuelTypes: { ar: "كل أنواع الوقود", en: "All fuel types" },
      allConditions: { ar: "كل الحالات", en: "All conditions" },
      allStatuses: { ar: "الكل", en: "All" },
      allCities: { ar: "كل المدن", en: "All cities" },
      min: { ar: "الحد الأدنى", en: "Min" },
      max: { ar: "الحد الأقصى", en: "Max" },
      reset: { ar: "مسح الفلاتر", en: "Clear filters" },
      apply: { ar: "تطبيق", en: "Apply" },
      applyFilters: { ar: "تطبيق الفلاتر", en: "Apply Filters" },
      close: { ar: "إغلاق", en: "Close" },
      loading: { ar: "جاري تحميل الفلاتر...", en: "Loading filters..." },
      modalDesc: {
        ar: "اختر المعايير ثم اضغط تطبيق الفلاتر لعرض النتائج",
        en: "Choose your criteria, then apply filters to update the listing",
      },
      active: { ar: "فلتر نشط", en: "active" },
      clearFilters: { ar: "مسح الفلاتر وعرض الكل", en: "Clear filters and show all" },
      sortOptions: {
        newest: { ar: "الأحدث", en: "Newest" },
        oldest: { ar: "الأقدم", en: "Oldest" },
        price_asc: { ar: "السعر: من الأقل للأعلى", en: "Price: low to high" },
        price_desc: { ar: "السعر: من الأعلى للأقل", en: "Price: high to low" },
        mileage_asc: { ar: "الممشى: من الأقل للأعلى", en: "Mileage: low to high" },
        mileage_desc: { ar: "الممشى: من الأعلى للأقل", en: "Mileage: high to low" },
        year_desc: { ar: "سنة أحدث", en: "Newer year" },
        year_asc: { ar: "سنة أقدم", en: "Older year" },
      },
    },
    detail: {
      backToCars: { ar: "العودة للسيارات", en: "Back to cars" },
      description: { ar: "الوصف", en: "Description" },
      specifications: { ar: "المواصفات", en: "Specifications" },
      relatedTitle: { ar: "سيارات مشابهة", en: "Similar cars" },
      relatedSubtitle: {
        ar: "قد تعجبك أيضاً هذه السيارات من نفس الماركة",
        en: "You may also like these cars from the same brand",
      },
      notFoundTitle: { ar: "السيارة غير موجودة", en: "Car not found" },
      notFoundDesc: {
        ar: "لم نتمكن من العثور على هذه السيارة. ربما تم بيعها أو أزيلت من العرض.",
        en: "We couldn't find this car. It may have been sold or removed from listing.",
      },
      browseCars: { ar: "تصفح السيارات", en: "Browse cars" },
      contactWhatsApp: { ar: "تواصل عبر واتساب", en: "Contact on WhatsApp" },
      galleryPrev: { ar: "الصورة السابقة", en: "Previous image" },
      galleryNext: { ar: "الصورة التالية", en: "Next image" },
      noDescription: {
        ar: "لا يوجد وصف متاح حالياً. تواصل معنا للمزيد من التفاصيل.",
        en: "No description available yet. Contact us for more details.",
      },
    },
  },
  services: {
    title: { ar: "خدماتنا", en: "Our Services" },
    subtitle: {
      ar: "كل ما تحتاجه لعرض أو شراء سيارتك",
      en: "Everything you need to list or find a car",
    },
    cards: [
      {
        t: { ar: "اعرض سيارتك عندنا", en: "List Your Car" },
        d: {
          ar: "نساعدك على عرض سيارتك بطريقة واضحة واحترافية للوصول إلى المهتمين.",
          en: "We help you showcase your car professionally to reach serious buyers.",
        },
      },
      {
        t: { ar: "تصفح السيارات المتوفرة", en: "Browse Available Cars" },
        d: {
          ar: "شاهد السيارات المتاحة، المواصفات، الصور، والأسعار بطريقة سهلة.",
          en: "Browse available cars, specifications, photos and prices easily.",
        },
      },
      {
        t: { ar: "مشاهدة السيارة على الواقع", en: "In-Person Car Viewing" },
        d: {
          ar: "تواصل معنا وسنرتب لك موعداً لمشاهدة السيارة مباشرة.",
          en: "Get in touch and we'll arrange an in-person viewing for you.",
        },
      },
    ],
  },
  how: {
    title: { ar: "كيف تعمل الخدمة", en: "How It Works" },
    subtitle: { ar: "4 خطوات", en: "4 steps" },
    steps: [
      { ar: "تواصل معنا", en: "Contact us" },
      { ar: "اختر سيارة أو أرسل بيانات سيارتك", en: "Pick a car or send your car details" },
      { ar: "نرتّب الموعد", en: "We schedule a visit" },
      { ar: "معاينة على أرض الواقع", en: "In-person viewing" },
    ],
  },
  ig: {
    title: { ar: "تابعنا على إنستغرام", en: "Follow Us on Instagram" },
    subtitle: {
      ar: "أحدث السيارات والعروض",
      en: "Latest cars and offers",
    },
    office: { ar: "الصفحة الرسمية", en: "Official page" },
    owner: { ar: "المهندس عبادة الخطيب", en: "Eng. Obada Alkhateeb" },
  },
  contact: {
    title: {
      ar: "جاهز للتواصل؟",
      en: "Ready to get started?",
    },
    desc: {
      ar: "تواصل معنا عبر واتساب",
      en: "Contact us on WhatsApp",
    },
    btn: { ar: "تواصل عبر واتساب", en: "Contact on WhatsApp" },
    phone: { ar: "رقم التواصل", en: "Phone" },
  },
  footer: {
    tag: { ar: "مكتب وتسويق سيارات", en: "Car Office & Brokerage" },
    rights: { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  },
  home: {
    search: {
      title: { ar: "ابحث عن سيارتك", en: "Find your car" },
      placeholder: {
        ar: "ابحث بالماركة أو الموديل أو السنة...",
        en: "Search brand, model or year...",
      },
      brand: { ar: "الشركة", en: "Company" },
      anyBrand: { ar: "كل الشركات", en: "Any company" },
      year: { ar: "السنة", en: "Year" },
      anyYear: { ar: "أي سنة", en: "Any year" },
      priceMin: { ar: "السعر من", en: "Min price" },
      priceMax: { ar: "السعر حتى", en: "Max price" },
      anyPrice: { ar: "أي سعر", en: "Any" },
      submit: { ar: "بحث", en: "Search" },
      advanced: { ar: "المزيد من الفلاتر", en: "More filters" },
    },
    brands: {
      title: { ar: "تصفح حسب الشركة", en: "Browse by Company" },
      subtitle: {
        ar: "اختر الشركة وابدأ البحث",
        en: "Pick a company and start browsing",
      },
      viewAll: { ar: "عرض كل الشركات", en: "View all companies" },
    },
    bodyTypes: {
      title: { ar: "تصفح حسب نوع الهيكل", en: "Browse by Body Type" },
      subtitle: { ar: "اختر النوع المناسب", en: "Choose your preferred type" },
    },
    featured: {
      title: { ar: "سيارات مميزة", en: "Featured Cars" },
      subtitle: { ar: "مختارات من المعرض", en: "Hand-picked from our showroom" },
      viewAll: { ar: "عرض الكل", en: "View all" },
    },
    latest: {
      title: { ar: "وصل حديثاً", en: "New Arrivals" },
      subtitle: {
        ar: "آخر السيارات المضافة",
        en: "Recently added cars",
      },
      viewAll: { ar: "تصفح الكل", en: "Browse all" },
    },
    why: {
      title: { ar: "لماذا الملاذ موتورز", en: "Why AL MELAZ MOTORS" },
      subtitle: {
        ar: "تجربة شراء واضحة وموثوقة",
        en: "A clear, trustworthy experience",
      },
      stats: {
        cars: { ar: "سيارة معروضة", en: "Cars listed" },
        brands: { ar: "شركة متوفرة", en: "Companies available" },
        support: { ar: "دعم ومتابعة", en: "Support" },
      },
      cards: [
        {
          t: { ar: "سيارات موثوقة", en: "Trusted cars" },
          d: {
            ar: "مواصفات واضحة وصور حقيقية.",
            en: "Clear specs and real photos.",
          },
        },
        {
          t: { ar: "أسعار واضحة", en: "Clear pricing" },
          d: {
            ar: "تفاصيل دقيقة بدون مفاجآت.",
            en: "Accurate details, no surprises.",
          },
        },
        {
          t: { ar: "تواصل مباشر", en: "Direct contact" },
          d: {
            ar: "واتساب لترتيب المعاينة.",
            en: "WhatsApp to arrange a viewing.",
          },
        },
      ],
    },
    faq: {
      title: { ar: "أسئلة شائعة", en: "FAQ" },
      subtitle: {
        ar: "إجابات سريعة",
        en: "Quick answers",
      },
      items: [
        {
          q: { ar: "كيف أشتري سيارة؟", en: "How do I buy a car?" },
          a: {
            ar: "اختر سيارة، ثم تواصل معنا عبر واتساب لترتيب المعاينة.",
            en: "Pick a car, then contact us on WhatsApp to arrange a viewing.",
          },
        },
        {
          q: { ar: "هل الأسعار قابلة للتفاوض؟", en: "Are prices negotiable?" },
          a: {
            ar: "تواصل معنا عبر واتساب لمناقشة السعر.",
            en: "Contact us on WhatsApp to discuss pricing.",
          },
        },
        {
          q: {
            ar: "هل يمكن معاينة السيارة قبل الشراء؟",
            en: "Can I inspect the car before buying?",
          },
          a: {
            ar: "نعم، نرتّب موعد معاينة على أرض الواقع.",
            en: "Yes, we arrange an in-person viewing.",
          },
        },
        {
          q: { ar: "هل تُضاف سيارات جديدة؟", en: "Do you add new cars?" },
          a: {
            ar: 'نعم. تابع "وصل حديثاً" أو إنستغرام.',
            en: 'Yes. Check "New Arrivals" or Instagram.',
          },
        },
      ],
    },
  },
};

export const links = {
  whatsapp: "https://wa.me/9639941885966",
  phone: "09941885966",
  igOffice: "https://www.instagram.com/al_melaz_motors/",
  igOwner: "https://www.instagram.com/obada.alkhateeb1/",
};
