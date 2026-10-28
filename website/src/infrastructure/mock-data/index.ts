import type {
  Application,
  DegreeLevel,
  Notification,
  Opportunity,
  Student,
  University,
  User,
} from "@/domain/model";

export const universities: University[] = [
  ["uni-01", "Boğaziçi University", "جامعة بوغازيتشي", "Turkey", "تركيا", "Istanbul", "إسطنبول", 1, "A leading research university overlooking the Bosphorus.", "جامعة بحثية رائدة تطل على مضيق البوسفور."],
  ["uni-02", "Middle East Technical University", "جامعة الشرق الأوسط التقنية", "Turkey", "تركيا", "Ankara", "أنقرة", 2, "Internationally recognized for engineering and sciences.", "جامعة معروفة عالمياً بالهندسة والعلوم."],
  ["uni-03", "Technical University of Munich", "الجامعة التقنية في ميونخ", "Germany", "ألمانيا", "Munich", "ميونخ", 3, "A world-class university for technology and innovation.", "جامعة عالمية رائدة في التقنية والابتكار."],
  ["uni-04", "Khalifa University", "جامعة خليفة", "United Arab Emirates", "الإمارات العربية المتحدة", "Abu Dhabi", "أبوظبي", 4, "A research-led university advancing science and technology.", "جامعة بحثية رائدة في مجالات العلوم والتكنولوجيا."],
  ["uni-05", "University of Malaya", "جامعة مالايا", "Malaysia", "ماليزيا", "Kuala Lumpur", "كوالالمبور", 5, "A vibrant campus in the heart of Southeast Asia.", "حرم جامعي نابض بالحياة في قلب جنوب شرق آسيا."],
  ["uni-06", "Universiti Teknologi Malaysia", "جامعة ماليزيا للتكنولوجيا", "Malaysia", "ماليزيا", "Johor Bahru", "جوهور بهرو", 6, "A leading destination for engineering and technology.", "وجهة رائدة لدراسة الهندسة والتكنولوجيا."],
  ["uni-07", "University of Manchester", "جامعة مانشستر", "United Kingdom", "المملكة المتحدة", "Manchester", "مانشستر", 7, "A global community with a proud history of discovery.", "مجتمع عالمي بتاريخ عريق من الاكتشافات."],
  ["uni-08", "University of Edinburgh", "جامعة إدنبرة", "United Kingdom", "المملكة المتحدة", "Edinburgh", "إدنبرة", 8, "One of the world’s top universities for research.", "إحدى الجامعات الرائدة عالمياً في البحث العلمي."],
  ["uni-09", "University of Toronto", "جامعة تورنتو", "Canada", "كندا", "Toronto", "تورونتو", 9, "A diverse, welcoming community at the center of Canada.", "مجتمع متنوع ومرحّب في قلب كندا."],
  ["uni-10", "McGill University", "جامعة ماكغيل", "Canada", "كندا", "Montreal", "مونتريال", 10, "A historic university with a global outlook.", "جامعة عريقة برؤية عالمية."],
  ["uni-11", "Eötvös Loránd University", "جامعة إيوتفوش لوراند", "Hungary", "المجر", "Budapest", "بودابست", 11, "A historic academic home in the heart of Budapest.", "صرح أكاديمي عريق في قلب بودابست."],
  ["uni-12", "American University in Cairo", "الجامعة الأمريكية بالقاهرة", "Egypt", "مصر", "Cairo", "القاهرة", 12, "A leading English-language university in the region.", "جامعة رائدة باللغة الإنجليزية في المنطقة."],
].map(([id, nameEn, nameAr, countryEn, countryAr, cityEn, cityAr, ranking, descEn, descAr]) => ({
  id: String(id),
  name: { en: String(nameEn), ar: String(nameAr) },
  country: { en: String(countryEn), ar: String(countryAr) },
  city: { en: String(cityEn), ar: String(cityAr) },
  ranking: Number(ranking),
  logo: `https://placehold.co/96x96/0b2a4a/ffffff?text=${String(nameEn).slice(0, 2)}`,
  website: `https://www.${String(nameEn).toLowerCase().replace(/[^a-z]+/g, "")}.edu`,
  description: { en: String(descEn), ar: String(descAr) },
}));

const programs: {
  titleEn: string;
  titleAr: string;
  fieldEn: string;
  fieldAr: string;
  degree: DegreeLevel;
  universityId: string;
  type?: "program" | "scholarship";
  funding?: string;
  fundingAr?: string;
  amount?: number;
  days?: number;
}[] = [
  { titleEn: "Computer Science and Artificial Intelligence", titleAr: "علوم الحاسوب والذكاء الاصطناعي", fieldEn: "Computer Science", fieldAr: "علوم الحاسوب", degree: "Master", universityId: "uni-03", days: 5 },
  { titleEn: "Global Excellence Scholarship", titleAr: "منحة التميز العالمية", fieldEn: "Engineering", fieldAr: "الهندسة", degree: "Master", universityId: "uni-03", type: "scholarship", funding: "Full tuition + €12,000 stipend", fundingAr: "الرسوم كاملة + مخصص ١٢٬٠٠٠ يورو", amount: 12000, days: 12 },
  { titleEn: "Medicine and Biomedical Sciences", titleAr: "الطب والعلوم الطبية الحيوية", fieldEn: "Medicine", fieldAr: "الطب", degree: "Bachelor", universityId: "uni-04", days: 88 },
  { titleEn: "Sustainable Energy Engineering", titleAr: "هندسة الطاقة المستدامة", fieldEn: "Engineering", fieldAr: "الهندسة", degree: "PhD", universityId: "uni-02", days: 150 },
  { titleEn: "ASEAN Future Leaders Award", titleAr: "جائزة قادة المستقبل", fieldEn: "Business", fieldAr: "إدارة الأعمال", degree: "Bachelor", universityId: "uni-05", type: "scholarship", funding: "Full tuition", fundingAr: "الرسوم الدراسية كاملة", amount: 18000, days: 3 },
  { titleEn: "Business Analytics", titleAr: "تحليلات الأعمال", fieldEn: "Business", fieldAr: "إدارة الأعمال", degree: "Master", universityId: "uni-05", days: 200 },
  { titleEn: "Education and Digital Learning", titleAr: "التربية والتعلم الرقمي", fieldEn: "Education", fieldAr: "التربية", degree: "Master", universityId: "uni-07", days: 55 },
  { titleEn: "Manchester Access Scholarship", titleAr: "منحة مانشستر للفرص", fieldEn: "Education", fieldAr: "التربية", degree: "Bachelor", universityId: "uni-07", type: "scholarship", funding: "£8,000 per year", fundingAr: "٨٬٠٠٠ جنيه سنوياً", amount: 8000, days: 90 },
  { titleEn: "Public Health and Epidemiology", titleAr: "الصحة العامة وعلم الأوبئة", fieldEn: "Medicine", fieldAr: "الطب", degree: "Master", universityId: "uni-08", days: 9 },
  { titleEn: "Computational Neuroscience", titleAr: "علم الأعصاب الحاسوبي", fieldEn: "Computer Science", fieldAr: "علوم الحاسوب", degree: "PhD", universityId: "uni-08", days: 110 },
  { titleEn: "International Scholars Program", titleAr: "برنامج الباحثين الدوليين", fieldEn: "Engineering", fieldAr: "الهندسة", degree: "Bachelor", universityId: "uni-09", type: "scholarship", funding: "Up to C$20,000", fundingAr: "حتى ٢٠٬٠٠٠ دولار كندي", amount: 20000, days: 180 },
  { titleEn: "Civil and Infrastructure Engineering", titleAr: "الهندسة المدنية والبنية التحتية", fieldEn: "Engineering", fieldAr: "الهندسة", degree: "Master", universityId: "uni-09", days: 250 },
  { titleEn: "Economics and Public Policy", titleAr: "الاقتصاد والسياسات العامة", fieldEn: "Business", fieldAr: "إدارة الأعمال", degree: "Master", universityId: "uni-10", days: 45 },
  { titleEn: "McGill Graduate Fellowship", titleAr: "زمالة ماكغيل للدراسات العليا", fieldEn: "Medicine", fieldAr: "الطب", degree: "PhD", universityId: "uni-10", type: "scholarship", funding: "C$16,500 annual stipend", fundingAr: "مخصص سنوي ١٦٬٥٠٠ دولار كندي", amount: 16500, days: 125 },
  { titleEn: "Data Science and Statistics", titleAr: "علوم البيانات والإحصاء", fieldEn: "Computer Science", fieldAr: "علوم الحاسوب", degree: "Master", universityId: "uni-11", days: 7 },
  { titleEn: "Central European Merit Award", titleAr: "جائزة التميز لأوروبا الوسطى", fieldEn: "Business", fieldAr: "إدارة الأعمال", degree: "Bachelor", universityId: "uni-11", type: "scholarship", funding: "50% tuition waiver", fundingAr: "إعفاء ٥٠٪ من الرسوم", amount: 6000, days: 70 },
  { titleEn: "Computer Engineering", titleAr: "هندسة الحاسوب", fieldEn: "Engineering", fieldAr: "الهندسة", degree: "Bachelor", universityId: "uni-01", days: 160 },
  { titleEn: "Research Excellence Grant", titleAr: "منحة التفوق البحثي", fieldEn: "Computer Science", fieldAr: "علوم الحاسوب", degree: "PhD", universityId: "uni-01", type: "scholarship", funding: "Full tuition + research grant", fundingAr: "الرسوم كاملة + منحة بحثية", amount: 14000, days: 210 },
  { titleEn: "Electrical and Electronics Engineering", titleAr: "الهندسة الكهربائية والإلكترونية", fieldEn: "Engineering", fieldAr: "الهندسة", degree: "Master", universityId: "uni-06", days: 280 },
  { titleEn: "Innovation and Entrepreneurship", titleAr: "الابتكار وريادة الأعمال", fieldEn: "Business", fieldAr: "إدارة الأعمال", degree: "Master", universityId: "uni-06", days: 155 },
  { titleEn: "AUC Tomorrow’s Leaders Scholarship", titleAr: "منحة قادة الغد بالجامعة الأمريكية", fieldEn: "Education", fieldAr: "التربية", degree: "Bachelor", universityId: "uni-12", type: "scholarship", funding: "Full tuition + living allowance", fundingAr: "الرسوم كاملة + بدل معيشة", amount: 15000, days: 25 },
  { titleEn: "Environmental Science", titleAr: "العلوم البيئية", fieldEn: "Engineering", fieldAr: "الهندسة", degree: "Bachelor", universityId: "uni-12", days: 225 },
  { titleEn: "Machine Learning Systems", titleAr: "أنظمة تعلم الآلة", fieldEn: "Computer Science", fieldAr: "علوم الحاسوب", degree: "PhD", universityId: "uni-03", days: 135 },
  { titleEn: "International Student Bursary", titleAr: "منحة دعم الطلبة الدوليين", fieldEn: "Business", fieldAr: "إدارة الأعمال", degree: "Master", universityId: "uni-05", type: "scholarship", funding: "Up to RM 25,000", fundingAr: "حتى ٢٥٬٠٠٠ رينغيت", amount: 5500, days: 0 },
];

export const opportunities: Opportunity[] = programs.map((item, index) => {
  const university = universities.find((entry) => entry.id === item.universityId)!;
  const days = item.days ?? 95;
  const deadline = new Date(Date.UTC(2026, 9, 28 + days)).toISOString().slice(0, 10);
  return {
    id: `opp-${String(index + 1).padStart(2, "0")}`,
    slug: `opportunity-${String(index + 1).padStart(2, "0")}`,
    type: item.type ?? "program",
    title: { en: item.titleEn, ar: item.titleAr },
    universityId: item.universityId,
    field: { en: item.fieldEn, ar: item.fieldAr },
    degree: item.degree,
    country: university.country,
    city: university.city,
    funding: { en: item.funding ?? "Merit-based support available", ar: item.fundingAr ?? "تتوفر فرص دعم حسب الجدارة" },
    amount: item.amount ?? 0,
    currency: item.universityId === "uni-05" ? "MYR" : item.universityId === "uni-03" ? "EUR" : "USD",
    tuition: 9500 + (index % 5) * 2500,
    duration: item.degree === "Bachelor" ? "4 years" : item.degree === "PhD" ? "3 years" : "2 years",
    language: "English",
    seats: 8 + (index % 15),
    deadline,
    opensAt: "2026-07-01",
    status: days === 0 ? "CLOSED" : "OPEN",
    description: {
      en: `Build your future through a rigorous ${item.fieldEn.toLowerCase()} curriculum, expert mentorship and a welcoming international community.`,
      ar: `ابنِ مستقبلك عبر منهج متميز في ${item.fieldAr} وإرشاد أكاديمي ومجتمع دولي مرحّب.`,
    },
    requirements: [
      { en: "Academic transcripts and certificates", ar: "السجل الأكاديمي والشهادات" },
      { en: "Statement of purpose", ar: "بيان الغرض من الدراسة" },
      { en: "Proof of English proficiency", ar: "إثبات إجادة اللغة الإنجليزية" },
    ],
    rules: {
      minimumGpa: item.degree === "PhD" ? 3.3 : 3.0,
      acceptedDegrees: item.degree === "PhD" ? ["Master"] : item.degree === "Master" ? ["Bachelor"] : ["Bachelor"],
      requiredFields: item.degree === "PhD" ? [item.fieldEn] : [],
      language: "English",
      minimumLanguageScore: 6.5,
      maximumAge: item.degree === "Bachelor" ? 25 : 35,
      nationalities: [],
    },
  };
});

const firstNames = ["Sara", "Omar", "Lina", "Yousef", "Mariam", "Khalid", "Noor", "Ziad", "Salma", "Tariq"];
const firstNamesAr = ["سارة", "عمر", "لينا", "يوسف", "مريم", "خالد", "نور", "زياد", "سلمى", "طارق"];
const countries = ["Jordan", "Egypt", "Iraq", "Lebanon", "Palestine", "Morocco", "Tunisia", "Syria", "Yemen", "Saudi Arabia"];
const countriesAr = ["الأردن", "مصر", "العراق", "لبنان", "فلسطين", "المغرب", "تونس", "سوريا", "اليمن", "السعودية"];

export const students: Student[] = Array.from({ length: 30 }, (_, index) => ({
  id: `student-${String(index + 1).padStart(3, "0")}`,
  name: {
    en: `${firstNames[index % firstNames.length]} ${["Haddad", "Nasser", "Khalil", "Mansour", "Saleh"][index % 5]}`,
    ar: `${firstNamesAr[index % firstNamesAr.length]} ${["الحداد", "ناصر", "خليل", "منصور", "صالح"][index % 5]}`,
  },
  email: index === 0 ? "student@example.com" : `${firstNames[index % firstNames.length].toLowerCase()}.${index + 1}@example.com`,
  country: countries[index % countries.length],
  countryName: { en: countries[index % countries.length], ar: countriesAr[index % countriesAr.length] },
  nationality: countries[index % countries.length],
  degree: (["Bachelor", "Master", "PhD"] as const)[index % 3],
  field: ["Computer Science", "Engineering", "Business", "Medicine", "Education"][index % 5],
  gpa: Number((2.7 + (index % 14) * 0.1).toFixed(1)),
  age: 20 + (index % 14),
  languageScores: { English: 6 + (index % 4) * 0.5, Arabic: 8 },
  phone: `+962 7${String(index + 1).padStart(2, "0")} 000 00${String(index % 10)}`,
}));

const applicationStatuses: Application["status"][] = [
  "SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "DOCUMENTS_REQUESTED", "REJECTED",
  "WAITLISTED", "SUBMITTED", "UNDER_REVIEW", "DRAFT", "WITHDRAWN",
];
export const applications: Application[] = Array.from({ length: 40 }, (_, index) => {
  const status = applicationStatuses[index % applicationStatuses.length];
  return {
    id: `application-${String(index + 1).padStart(3, "0")}`,
    reference: `MNH-2026-${String(index + 123).padStart(6, "0")}`,
    studentId: students[index % students.length].id,
    opportunityId: opportunities[index % opportunities.length].id,
    status,
    submittedAt: new Date(Date.UTC(2026, 5 + (index % 5), 1 + (index % 25))).toISOString(),
    assignedReviewer: `reviewer-${(index % 3) + 1}`,
    history: [
      { status: "SUBMITTED", date: "2026-06-02", note: "Application received" },
      ...(status === "SUBMITTED" ? [] : [{ status, date: "2026-06-08", note: "Status updated by the review team" }]),
    ],
    documents: [
      { name: "academic-transcript.pdf", type: "Transcript", size: 840_000 },
      { name: "motivation-letter.pdf", type: "Motivation letter", size: 420_000 },
    ],
  };
});

export const users: User[] = [
  { id: "super-admin", name: "Manhal Admin", email: "admin@manhal.edu", role: "SUPER_ADMIN", active: true },
  { id: "admin-1", name: "Operations Admin", email: "operations@manhal.edu", role: "ADMIN", active: true },
  { id: "admin-2", name: "Admissions Admin", email: "admissions@manhal.edu", role: "ADMIN", active: true },
  { id: "reviewer-1", name: "Rana Abbas", email: "rana@manhal.edu", role: "REVIEWER", active: true },
  { id: "reviewer-2", name: "Omar Saleh", email: "omar@manhal.edu", role: "REVIEWER", active: true },
  { id: "reviewer-3", name: "Layla Haddad", email: "layla@manhal.edu", role: "REVIEWER", active: true },
  ...students.map((student, index) => ({
    id: `user-${student.id}`,
    name: student.name.en,
    email: student.email,
    role: "STUDENT" as const,
    studentId: student.id,
    active: true,
    ...(index === 0 ? {} : {}),
  })),
];

export const notifications: Notification[] = Array.from({ length: 25 }, (_, index) => ({
  id: `notification-${String(index + 1).padStart(2, "0")}`,
  userId: `user-${students[index % students.length].id}`,
  title: { en: "Application update", ar: "تحديث على الطلب" },
  body: { en: "Your application is moving forward. View the latest status in your account.", ar: "طلبك يتقدم. اطّلع على آخر المستجدات في حسابك." },
  date: new Date(Date.UTC(2026, 9, 20 - index)).toISOString(),
  read: index > 5,
}));

export function getUniversity(id: string) {
  return universities.find((university) => university.id === id);
}

export function getOpportunity(slug: string) {
  return opportunities.find((opportunity) => opportunity.slug === slug);
}
