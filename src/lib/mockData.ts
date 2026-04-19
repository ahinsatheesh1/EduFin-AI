export const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", avgTuition: 45000, currency: "USD", visaType: "F-1" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", avgTuition: 30000, currency: "GBP", visaType: "Student Visa" },
  { code: "CA", name: "Canada", flag: "🇨🇦", avgTuition: 25000, currency: "CAD", visaType: "Study Permit" },
  { code: "AU", name: "Australia", flag: "🇦🇺", avgTuition: 32000, currency: "AUD", visaType: "Student Visa 500" },
  { code: "DE", name: "Germany", flag: "🇩🇪", avgTuition: 5000, currency: "EUR", visaType: "Student Visa" },
  { code: "IN", name: "India", flag: "🇮🇳", avgTuition: 8000, currency: "INR", visaType: "N/A" },
];

export const salaryMap: Record<string, Record<string, number>> = {
  US: {
    "Computer Science": 110000,
    "Data Science": 105000,
    "MBA": 120000,
    "Engineering": 95000,
    "Medicine": 180000,
    "Law": 115000,
    "Finance": 100000,
    "Design": 80000,
    "Public Policy": 75000,
  },
  UK: {
    "Computer Science": 65000,
    "Data Science": 62000,
    "MBA": 80000,
    "Engineering": 58000,
    "Medicine": 90000,
    "Law": 75000,
    "Finance": 70000,
    "Design": 48000,
    "Public Policy": 50000,
  },
  CA: {
    "Computer Science": 90000,
    "Data Science": 85000,
    "MBA": 95000,
    "Engineering": 80000,
    "Medicine": 130000,
    "Law": 90000,
    "Finance": 82000,
    "Design": 65000,
    "Public Policy": 68000,
  },
  AU: {
    "Computer Science": 88000,
    "Data Science": 82000,
    "MBA": 90000,
    "Engineering": 75000,
    "Medicine": 120000,
    "Law": 85000,
    "Finance": 80000,
    "Design": 62000,
    "Public Policy": 65000,
  },
  DE: {
    "Computer Science": 60000,
    "Data Science": 58000,
    "MBA": 70000,
    "Engineering": 62000,
    "Medicine": 80000,
    "Law": 65000,
    "Finance": 58000,
    "Design": 45000,
    "Public Policy": 50000,
  },
  IN: {
    "Computer Science": 25000,
    "Data Science": 24000,
    "MBA": 30000,
    "Engineering": 20000,
    "Medicine": 35000,
    "Law": 22000,
    "Finance": 25000,
    "Design": 18000,
    "Public Policy": 20000,
  },
};

export const universities: Record<string, Array<{ name: string; rank: number; tuition: number; matchScore: number; specialties: string[] }>> = {
  US: [
    { name: "MIT", rank: 1, tuition: 58000, matchScore: 92, specialties: ["Computer Science", "Engineering", "Data Science"] },
    { name: "Stanford University", rank: 3, tuition: 56000, matchScore: 89, specialties: ["Computer Science", "MBA", "Engineering"] },
    { name: "Carnegie Mellon", rank: 25, tuition: 54000, matchScore: 85, specialties: ["Computer Science", "Design", "Engineering"] },
    { name: "University of Texas Austin", rank: 67, tuition: 40000, matchScore: 78, specialties: ["Engineering", "Finance", "Data Science"] },
    { name: "Purdue University", rank: 99, tuition: 32000, matchScore: 72, specialties: ["Engineering", "Computer Science"] },
  ],
  UK: [
    { name: "University of Oxford", rank: 2, tuition: 38000, matchScore: 90, specialties: ["Law", "Public Policy", "Finance"] },
    { name: "Imperial College London", rank: 8, tuition: 34000, matchScore: 86, specialties: ["Engineering", "Medicine", "Data Science"] },
    { name: "University of Manchester", rank: 32, tuition: 26000, matchScore: 80, specialties: ["MBA", "Finance", "Engineering"] },
    { name: "University of Edinburgh", rank: 22, tuition: 28000, matchScore: 77, specialties: ["Computer Science", "Medicine"] },
  ],
  CA: [
    { name: "University of Toronto", rank: 21, tuition: 30000, matchScore: 88, specialties: ["Computer Science", "MBA", "Data Science"] },
    { name: "UBC", rank: 34, tuition: 27000, matchScore: 82, specialties: ["Engineering", "Finance"] },
    { name: "McGill University", rank: 46, tuition: 24000, matchScore: 79, specialties: ["Medicine", "Law"] },
  ],
  AU: [
    { name: "University of Melbourne", rank: 33, tuition: 35000, matchScore: 83, specialties: ["MBA", "Finance", "Law"] },
    { name: "ANU", rank: 30, tuition: 32000, matchScore: 81, specialties: ["Public Policy", "Computer Science"] },
    { name: "UNSW Sydney", rank: 45, tuition: 29000, matchScore: 76, specialties: ["Engineering", "Data Science"] },
  ],
  DE: [
    { name: "TU Munich", rank: 37, tuition: 0, matchScore: 87, specialties: ["Engineering", "Computer Science"] },
    { name: "LMU Munich", rank: 63, tuition: 0, matchScore: 81, specialties: ["Data Science", "Medicine"] },
    { name: "Heidelberg University", rank: 65, tuition: 1500, matchScore: 74, specialties: ["Medicine", "Public Policy"] },
  ],
  IN: [
    { name: "IIT Bombay", rank: 118, tuition: 5000, matchScore: 91, specialties: ["Engineering", "Computer Science", "Data Science"] },
    { name: "IIM Ahmedabad", rank: 1, tuition: 12000, matchScore: 88, specialties: ["MBA", "Finance"] },
    { name: "AIIMS Delhi", rank: 1, tuition: 1000, matchScore: 85, specialties: ["Medicine"] },
    { name: "NLSIU Bangalore", rank: 1, tuition: 6000, matchScore: 82, specialties: ["Law"] },
  ],
};

export const loanInterestRates = {
  secured: 8.5,
  unsecured: 11,
  governmentScheme: 7.5,
};

export const chatResponses: Record<string, string> = {
  loan: "Education loans in India can be availed from nationalized banks like SBI, or NBFCs like HDFC Credila and Avanse. Loan amounts typically range from ₹7.5 lakh to ₹1 crore. Collateral is required above ₹40 lakh. Interest rates start from 8.5% for secured loans.",
  visa: "For the US, you need an F-1 student visa. Key requirements: valid I-20 form, SEVIS fee, DS-160 form, and proof of financial support. Interview is typically scheduled at the US Consulate in your city.",
  gre: "GRE is required by most US grad programs. The current format has Verbal, Quantitative (170 each), and Analytical Writing (6.0) sections. An average score of 320+ is competitive for top 50 US universities.",
  ielts: "IELTS Academic is widely accepted. Most universities require a band score of 6.5–7.5. British Council and IDP conduct tests. You can retake in 3 days after your test date.",
  emi: "Your EMI depends on the loan amount, interest rate, and tenure. Use our EMI calculator above! A rule of thumb: EMI should not exceed 30–40% of your expected monthly take-home salary.",
  scholarship: "Several scholarships are available for Indian students: Fulbright (US), Commonwealth (UK), DAAD (Germany), and Endeavour (Australia). Many universities also offer merit-based aid. Apply early — most deadlines are 6–9 months before enrollment.",
  document: "Common documents for loan application: admission letter, fee structure, academic marksheets, income proof of co-applicant, KYC (Aadhaar, PAN), bank statements (last 6 months), and property documents if collateral is pledged.",
  default: "Hi! I'm your EduFin AI Mentor. I can help you with questions about education loans, visa applications, GRE/IELTS preparation, scholarships, EMI planning, and more. What would you like to know?",
};
