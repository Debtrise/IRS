export type EmergencyStatus = 'yes' | 'no' | 'unsure';
export type ReturnsStatus = 'yes' | 'no' | 'partial';
export type DebtAmount = 'under10k' | 'under25k' | 'under50k' | 'over50k' | 'over100k';
export type FinancialSituation = 'hardship' | 'tight' | 'stable';
export type SpecialCircumstance = 
  | 'penalties' 
  | 'spouse' 
  | 'medical' 
  | 'disability' 
  | 'unemployment' 
  | 'divorce' 
  | 'firstTime' 
  | 'levy' 
  | 'lien'
  | 'old' 
  | 'none'
  | 'business'
  | 'covid'
  | 'retirement';

export interface OnboardingState {
  currentStep: number;
  emergency?: EmergencyStatus;
  returns?: ReturnsStatus;
  debt?: DebtAmount;
  financial?: FinancialSituation;
  circumstances: SpecialCircumstance[];
}

export interface Program {
  rank: string;
  name: string;
  benefit: string;
}