import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OnboardingState, EmergencyStatus, ReturnsStatus, DebtAmount, FinancialSituation, SpecialCircumstance } from '../types/onboarding';

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SET_EMERGENCY'; payload: EmergencyStatus }
  | { type: 'SET_RETURNS'; payload: ReturnsStatus }
  | { type: 'SET_DEBT'; payload: DebtAmount }
  | { type: 'SET_FINANCIAL'; payload: FinancialSituation }
  | { type: 'TOGGLE_CIRCUMSTANCE'; payload: SpecialCircumstance }
  | { type: 'RESET' }
  | { type: 'LOAD_MOCK_DATA'; payload: Partial<OnboardingState> }
  | { type: 'SET_STEP'; payload: number };

const initialState: OnboardingState = {
  currentStep: 1,
  circumstances: [],
};

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function onboardingReducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) };
    case 'PREVIOUS_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case 'SET_EMERGENCY':
      return { ...state, emergency: action.payload };
    case 'SET_RETURNS':
      return { ...state, returns: action.payload };
    case 'SET_DEBT':
      return { ...state, debt: action.payload };
    case 'SET_FINANCIAL':
      return { ...state, financial: action.payload };
    case 'TOGGLE_CIRCUMSTANCE':
      if (action.payload === 'none') {
        return { ...state, circumstances: ['none'] };
      }
      const circumstances = state.circumstances.includes(action.payload)
        ? state.circumstances.filter(c => c !== action.payload)
        : [...state.circumstances.filter(c => c !== 'none'), action.payload];
      return { ...state, circumstances };
    case 'RESET':
      return initialState;
    case 'LOAD_MOCK_DATA':
      return { ...state, ...action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    default:
      return state;
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}