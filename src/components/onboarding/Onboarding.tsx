import React, { useState } from 'react';
import Logo from '../common/Logo';
import { AnimatePresence } from 'framer-motion';
import { OnboardingContainer, ProgressContainer, ProgressBar, ProgressFill, FormContainer, LogoContainer } from './OnboardingContainer';
import { useOnboarding } from '../../context/OnboardingContext';
import WelcomeStep from './steps/WelcomeStep';
import EmergencyStep from './steps/EmergencyStep';
import ReturnsStep from './steps/ReturnsStep';
import DebtStep from './steps/DebtStep';
import FinancialStep from './steps/FinancialStep';
import CircumstancesStep from './steps/CircumstancesStep';
import Results from './Results';
import NavigationDebug from './NavigationDebug';
import { Program } from '../../types/onboarding';

const Onboarding: React.FC = () => {
  const { state, dispatch } = useOnboarding();
  const [showResults, setShowResults] = useState(false);

  const handleNext = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const determinePrograms = (): Program[] => {
    const programs: Program[] = [];

    if (state.returns === 'no') {
      programs.push({
        rank: '!',
        name: 'File Missing Returns First',
        benefit: 'Required before any relief program'
      });
      return programs;
    }

    // Check for Offer in Compromise
    if (state.financial === 'hardship' || 
        (state.financial === 'tight' && state.debt !== 'under10k')) {
      programs.push({
        rank: '1',
        name: 'Offer in Compromise',
        benefit: 'Potentially settle for less than you owe'
      });
    }

    // Check for Currently Not Collectible
    if (state.financial === 'hardship') {
      programs.push({
        rank: '2',
        name: 'Currently Not Collectible',
        benefit: 'Temporary suspension of collection'
      });
    }

    // Check for Installment Agreement
    if (state.debt === 'under10k') {
      programs.push({
        rank: '3',
        name: 'Guaranteed Installment Agreement',
        benefit: 'Automatic approval for payment plan'
      });
    } else if (state.debt === 'under50k') {
      programs.push({
        rank: '3',
        name: 'Streamlined Installment Agreement',
        benefit: 'Payment plan without financial disclosure'
      });
    } else {
      programs.push({
        rank: '3',
        name: 'Installment Agreement',
        benefit: 'Monthly payment plan based on ability'
      });
    }

    // Check special circumstances
    if (state.circumstances.includes('penalties')) {
      programs.push({
        rank: '★',
        name: 'Penalty Abatement',
        benefit: 'Remove penalties from your debt'
      });
    }

    if (state.circumstances.includes('spouse')) {
      programs.push({
        rank: '★',
        name: 'Innocent Spouse Relief',
        benefit: "Relief from spouse's tax liability"
      });
    }

    return programs;
  };

  const progress = ((state.currentStep - 1) / 6) * 100;

  return (
    <OnboardingContainer>
      <LogoContainer>
        <Logo variant="owl" size="small" />
        OwlTax
      </LogoContainer>
      
      <ProgressContainer>
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </ProgressBar>
      </ProgressContainer>

      <FormContainer>
        <AnimatePresence mode="wait">
          {showResults ? (
            <Results programs={determinePrograms()} />
          ) : (
            <>
              {state.currentStep === 1 && <WelcomeStep onNext={handleNext} />}
              {state.currentStep === 2 && (
                <EmergencyStep onNext={handleNext} onBack={handleBack} />
              )}
              {state.currentStep === 3 && (
                <ReturnsStep onNext={handleNext} onBack={handleBack} />
              )}
              {state.currentStep === 4 && (
                <DebtStep onNext={handleNext} onBack={handleBack} />
              )}
              {state.currentStep === 5 && (
                <FinancialStep onNext={handleNext} onBack={handleBack} />
              )}
              {state.currentStep === 6 && (
                <CircumstancesStep onNext={handleShowResults} onBack={handleBack} />
              )}
            </>
          )}
        </AnimatePresence>
      </FormContainer>
      
      {process.env.NODE_ENV === 'development' && <NavigationDebug />}
    </OnboardingContainer>
  );
};

export default Onboarding;