import { salaryMap, loanInterestRates } from "./mockData";

export interface UserProfile {
  name: string;
  age: number;
  currentDegree: string;
  targetCountry: string;
  courseInterest: string;
  tuitionFee: number;
  livingExpenses: number;
  loanAmount: number;
}

export function calculateROI(profile: UserProfile) {
  const annualSalary = salaryMap[profile.targetCountry]?.[profile.courseInterest] || 60000;
  const monthlySalary = annualSalary / 12;
  const totalCost = profile.tuitionFee + profile.livingExpenses * 2;
  const loanWithInterest = profile.loanAmount * (1 + (loanInterestRates.unsecured / 100) * 10 / 2);
  const paybackMonths = loanWithInterest / (monthlySalary * 0.4);
  const paybackYears = Math.round((paybackMonths / 12) * 10) / 10;
  const monthlyEMI =
    (profile.loanAmount * (loanInterestRates.unsecured / 100 / 12)) /
    (1 - Math.pow(1 + loanInterestRates.unsecured / 100 / 12, -120));
  const roiRatio = annualSalary / totalCost;

  return {
    annualSalary,
    monthlySalary: Math.round(monthlySalary),
    totalCost,
    paybackYears,
    monthlyEMI: Math.round(monthlyEMI),
    roiRatio: Math.round(roiRatio * 100) / 100,
    netBenefit: Math.round(annualSalary * 5 - totalCost),
  };
}

export type RiskLevel = "Safe" | "Moderate" | "Risky";

export function calculateRiskScore(profile: UserProfile): {
  score: number;
  level: RiskLevel;
  color: string;
  explanation: string;
} {
  const { monthlyEMI, monthlySalary } = calculateROI(profile);
  const emiToSalaryRatio = monthlyEMI / monthlySalary;

  let score: number;
  let level: RiskLevel;
  let color: string;
  let explanation: string;

  if (emiToSalaryRatio < 0.25) {
    score = Math.min(95, Math.round(80 + ((0.25 - emiToSalaryRatio) / 0.25) * 15));
    level = "Safe";
    color = "green";
    explanation = `Your projected salary comfortably covers the loan EMI. The EMI is only ${Math.round(emiToSalaryRatio * 100)}% of your expected income — well within the safe threshold of 30%.`;
  } else if (emiToSalaryRatio < 0.45) {
    score = Math.round(50 + ((0.45 - emiToSalaryRatio) / 0.2) * 20);
    level = "Moderate";
    color = "yellow";
    explanation = `The EMI is ${Math.round(emiToSalaryRatio * 100)}% of your expected salary. This is manageable but leaves limited buffer for unexpected expenses.`;
  } else {
    score = Math.max(15, Math.round(40 - ((emiToSalaryRatio - 0.45) / 0.55) * 25));
    level = "Risky";
    color = "red";
    explanation = `The EMI is ${Math.round(emiToSalaryRatio * 100)}% of your projected salary — significantly above the safe limit. We recommend exploring cheaper universities or reducing the loan amount.`;
  }

  return { score, level, color, explanation };
}

// ─── Loan Approval Confidence Score ──────────────────────────────────────────
export function calculateApprovalScore(profile: UserProfile): {
  probability: number;
  label: "High" | "Moderate" | "Low";
  color: string;
  explanation: string;
} {
  const { level } = calculateRiskScore(profile);
  const { paybackYears, monthlyEMI, monthlySalary } = calculateROI(profile);
  const emiRatio = monthlyEMI / monthlySalary;

  let base: number;
  if (level === "Safe") base = 82;
  else if (level === "Moderate") base = 65;
  else base = 38;

  let adjustment = 0;
  if (paybackYears < 5) adjustment += 6;
  else if (paybackYears > 10) adjustment -= 8;
  if (emiRatio < 0.2) adjustment += 4;
  if (emiRatio > 0.5) adjustment -= 6;

  const probability = Math.min(95, Math.max(20, base + adjustment));

  let label: "High" | "Moderate" | "Low";
  let color: string;
  let explanation: string;

  if (probability >= 75) {
    label = "High";
    color = "#00d4aa";
    explanation = `Based on your financial profile and projected income, lenders are likely to approve this loan. Your EMI-to-salary ratio and payback period are within acceptable limits.`;
  } else if (probability >= 55) {
    label = "Moderate";
    color = "#f5c842";
    explanation = `Your loan approval chances are moderate. Lenders may require additional collateral or a strong co-applicant. Reducing loan amount could improve approval probability significantly.`;
  } else {
    label = "Low";
    color = "#ff4d6d";
    explanation = `Your current financial profile presents elevated risk to lenders. Consider increasing savings, reducing loan amount, or choosing a country with better salary-to-cost ratio.`;
  }

  return { probability, label, color, explanation };
}

// ─── What-If Simulation ───────────────────────────────────────────────────────
export interface WhatIfInputs {
  targetCountry: string;
  tuitionFee: number;
  loanAmount: number;
}

export interface SimulationResult {
  riskLevel: RiskLevel;
  riskScore: number;
  riskColor: string;
  approvalProbability: number;
  approvalLabel: "High" | "Moderate" | "Low";
  approvalColor: string;
  annualSalary: number;
  paybackYears: number;
  monthlyEMI: number;
  roiRatio: number;
  insight: string;
}

function profileToResult(profile: UserProfile): SimulationResult {
  const roi = calculateROI(profile);
  const risk = calculateRiskScore(profile);
  const approval = calculateApprovalScore(profile);
  return {
    riskLevel: risk.level,
    riskScore: risk.score,
    riskColor: risk.color,
    approvalProbability: approval.probability,
    approvalLabel: approval.label,
    approvalColor: approval.color,
    annualSalary: roi.annualSalary,
    paybackYears: roi.paybackYears,
    monthlyEMI: roi.monthlyEMI,
    roiRatio: roi.roiRatio,
    insight: "",
  };
}

export function runWhatIfSimulation(
  base: UserProfile,
  whatIf: WhatIfInputs
): { current: SimulationResult; alternative: SimulationResult } {
  const altProfile: UserProfile = {
    ...base,
    targetCountry: whatIf.targetCountry,
    tuitionFee: whatIf.tuitionFee,
    loanAmount: whatIf.loanAmount,
  };

  const current = profileToResult(base);
  const alternative = profileToResult(altProfile);

  const approvalChange = alternative.approvalProbability - current.approvalProbability;
  const riskChanged = alternative.riskLevel !== current.riskLevel;
  const savingsStr =
    whatIf.loanAmount < base.loanAmount
      ? ` and reduces your loan by $${(base.loanAmount - whatIf.loanAmount).toLocaleString()}`
      : "";

  const countryLabel = whatIf.targetCountry === base.targetCountry
    ? "this plan"
    : whatIf.targetCountry;

  if (approvalChange > 5) {
    const riskSentence = riskChanged
      ? ` Risk drops from ${current.riskLevel} → ${alternative.riskLevel}.`
      : "";
    alternative.insight = `Switching to ${countryLabel} increases approval probability by ${approvalChange}pp${savingsStr}.${riskSentence} This plan is significantly safer.`;
  } else if (approvalChange < -5) {
    alternative.insight = `This scenario reduces approval probability by ${Math.abs(approvalChange)}pp. Lender risk exposure increases${riskChanged ? ` and risk level worsens to ${alternative.riskLevel}` : ""}.`;
  } else {
    alternative.insight = `Similar approval odds to your current plan. Main difference is ${whatIf.tuitionFee < base.tuitionFee ? "lower" : "higher"} tuition cost.`;
  }

  return { current, alternative };
}

// ─── Explainability: "Why this score?" bullet points ─────────────────────────
export function getExplanationPoints(profile: UserProfile): {
  risk: string[];
  approval: string[];
} {
  const { monthlyEMI, monthlySalary, annualSalary, paybackYears, totalCost } =
    calculateROI(profile);
  const emiRatio = monthlyEMI / monthlySalary;
  const tuitionRatio = profile.tuitionFee / annualSalary;
  const loanCoverageRatio = profile.loanAmount / totalCost;

  const risk: string[] = [];
  const approval: string[] = [];

  // ── Risk bullets ──────────────────────────────────────────────────────────
  risk.push(
    `EMI consumes ${Math.round(emiRatio * 100)}% of expected monthly income ($${monthlyEMI.toLocaleString()} of $${monthlySalary.toLocaleString()})`
  );

  if (tuitionRatio > 0.5)
    risk.push(
      `Tuition ($${profile.tuitionFee.toLocaleString()}) is ${Math.round(tuitionRatio * 100)}% of annual salary — above safe 50% threshold`
    );
  else
    risk.push(
      `Tuition-to-salary ratio is ${Math.round(tuitionRatio * 100)}% — within acceptable range`
    );

  if (paybackYears > 8)
    risk.push(
      `Payback period of ${paybackYears} yrs exceeds the recommended 7-yr target`
    );
  else
    risk.push(`Loan payback projected in ${paybackYears} yrs — within safe range`);

  if (loanCoverageRatio > 0.9)
    risk.push(
      `Loan covers ${Math.round(loanCoverageRatio * 100)}% of total cost — no personal savings buffer`
    );
  else
    risk.push(
      `Personal contribution covers ${Math.round((1 - loanCoverageRatio) * 100)}% of total cost — reduces lender exposure`
    );

  // ── Approval bullets ──────────────────────────────────────────────────────
  approval.push(
    `EMI-to-income ratio of ${Math.round(emiRatio * 100)}% signals ${emiRatio < 0.3 ? "strong" : emiRatio < 0.45 ? "moderate" : "weak"} repayment capacity`
  );

  approval.push(
    paybackYears <= 7
      ? `Short payback period (${paybackYears} yrs) improves lender confidence`
      : `Long payback period (${paybackYears} yrs) raises lender concern on credit duration`
  );

  approval.push(
    profile.targetCountry === "US" || profile.targetCountry === "UK" || profile.targetCountry === "CA"
      ? `High-income destination (${profile.targetCountry}) strengthens repayment scenario`
      : `${profile.targetCountry === "DE" ? "Near-zero tuition (Germany)" : "Domestic market (India)"} improves cost-to-income ratio`
  );

  approval.push(
    `Projected annual salary of $${annualSalary.toLocaleString()} supports ${emiRatio < 0.3 ? "comfortable" : "marginal"} EMI servicing`
  );

  return { risk, approval };
}


// ─── Enhanced Smart Advisor ───────────────────────────────────────────────────
export function generateAdvice(profile: UserProfile): {
  decision: string;
  actionLabel: string;
  icon: string;
  rationale: string;
  reasoning: string[];
  actions: string[];
} {
  const { level } = calculateRiskScore(profile);
  const { paybackYears, annualSalary, monthlyEMI, monthlySalary, totalCost } =
    calculateROI(profile);
  const emiRatio = monthlyEMI / monthlySalary;
  const tuitionToSalaryRatio = profile.tuitionFee / annualSalary;

  const reasoning: string[] = [];

  if (tuitionToSalaryRatio > 0.5)
    reasoning.push(
      `High tuition ($${profile.tuitionFee.toLocaleString()}) vs expected salary ($${annualSalary.toLocaleString()}/yr)`
    );
  else
    reasoning.push(
      `Tuition-to-salary ratio is acceptable (${Math.round(tuitionToSalaryRatio * 100)}%)`
    );

  if (paybackYears > 8)
    reasoning.push(`Long payback period (${paybackYears} yrs) — above recommended 7-yr target`);
  else
    reasoning.push(`Payback period of ${paybackYears} yrs is within comfortable range`);

  if (emiRatio > 0.4)
    reasoning.push(
      `Moderate-high EMI burden — ${Math.round(emiRatio * 100)}% of expected monthly income`
    );
  else
    reasoning.push(
      `EMI is ${Math.round(emiRatio * 100)}% of salary — within the safe 30% threshold`
    );

  if (profile.targetCountry === "DE" || profile.targetCountry === "IN")
    reasoning.push("Low/no tuition country — strong cost advantage");
  if (profile.loanAmount > totalCost * 0.9)
    reasoning.push("Loan covers nearly full cost — no personal savings buffer");

  if (level === "Safe" && paybackYears < 7) {
    return {
      decision: "Proceed with Loan",
      actionLabel: "Recommended Action: Proceed with Loan",
      icon: "✅",
      rationale: `Based on your profile, taking an education loan makes strong financial sense. With a projected salary of $${annualSalary.toLocaleString()} in ${profile.targetCountry}, you can pay back the loan in ~${paybackYears} years while maintaining a healthy lifestyle.`,
      reasoning,
      actions: [
        "Compare loan offers from SBI, HDFC Credila, and Avanse",
        "Apply for scholarships to reduce loan dependency",
        "Get a co-applicant with stable income for better interest rates",
        "Maintain a good academic profile for merit-based aid",
      ],
    };
  } else if (level === "Moderate") {
    return {
      decision: "Optimize Plan",
      actionLabel: "Recommended Action: Optimize Your Plan",
      icon: "⚠️",
      rationale: `Your loan-to-salary ratio is borderline. While manageable, there's limited buffer for error. Consider negotiating better rates or increasing part-time income during studies.`,
      reasoning,
      actions: [
        "Consider a cheaper university in the same country",
        "Increase initial savings to reduce loan by 15–20%",
        "Apply for TA/RA positions to earn during studies",
        "Choose colleges with strong placement records",
      ],
    };
  } else if (level === "Risky" && profile.targetCountry !== "IN") {
    return {
      decision: "Reconsider Plan",
      actionLabel: "Recommended Action: Choose a Cheaper University",
      icon: "🔄",
      rationale: `High debt-to-income risk detected. Tier-2 universities can offer equal placements at 30–40% lower cost. Domestic options may also deliver strong ROI.`,
      reasoning,
      actions: [
        "Explore state universities instead of private institutions",
        "Consider Germany for near-zero tuition fees",
        "Look at domestic IITs/NITs for equal career opportunities",
        "Choose shorter course duration to reduce living costs",
      ],
    };
  } else {
    return {
      decision: "Delay & Strengthen",
      actionLabel: "Recommended Action: Delay & Strengthen Profile",
      icon: "📈",
      rationale: `Significant financial risk detected. 6–12 months of profile building can unlock scholarships and better loan terms — dramatically improving your financial outcome.`,
      reasoning,
      actions: [
        "Improve GRE/GMAT scores for scholarship eligibility",
        "Build 1–2 years of relevant work experience for stipends",
        "Apply for Padho Pardesh government subsidized loan scheme",
        "Consider online master's programs to cut costs by 60–70%",
      ],
    };
  }
}

export function calculateEMI(
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number
): number {
  const r = ratePerAnnum / 100 / 12;
  const emi =
    (principal * r * Math.pow(1 + r, tenureMonths)) /
    (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
}

export function getLoanEligibility(profile: UserProfile): {
  maxEligible: number;
  recommendedAmount: number;
  interestRate: number;
  scheme: string;
} {
  const { annualSalary } = calculateROI(profile);
  const totalCost = profile.tuitionFee + profile.livingExpenses * 2;
  const maxEligible = Math.min(totalCost, 5000000);
  const recommendedAmount = Math.min(profile.loanAmount, maxEligible);
  const interestRate =
    recommendedAmount > 400000 ? loanInterestRates.secured : loanInterestRates.unsecured;
  const scheme =
    annualSalary < 30000 ? "Padho Pardesh (Subsidized)" : "Standard Education Loan";

  return {
    maxEligible: Math.round(maxEligible),
    recommendedAmount: Math.round(recommendedAmount),
    interestRate,
    scheme,
  };
}
