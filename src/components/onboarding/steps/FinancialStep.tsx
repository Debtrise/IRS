import React from 'react';
import StepCard from '../StepCard';
import { Option, OptionTitle, OptionDescription, RadioCustom } from '../Option';
import { useOnboarding } from '../../../context/OnboardingContext';
import { FinancialSituation } from '../../../types/onboarding';

interface FinancialStepProps {
  onNext: () => void;
  onBack: () => void;
}

const FinancialStep: React.FC<FinancialStepProps> = ({ onNext, onBack }) => {
  const { state, dispatch } = useOnboarding();

  const handleSelect = (value: FinancialSituation) => {
    dispatch({ type: 'SET_FINANCIAL', payload: value });
  };

  return (
    <StepCard
      stepNumber={5}
      title="What's your current financial situation?"
      subtitle="This helps determine which programs fit your circumstances"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!state.financial}
    >
      <div>
        <Option
          selected={state.financial === 'hardship'}
          onClick={() => handleSelect('hardship')}
        >
          <OptionTitle>Experiencing financial hardship</OptionTitle>
          <OptionDescription>
            Unable to pay basic living expenses
          </OptionDescription>
          <RadioCustom selected={state.financial === 'hardship'} />
        </Option>

        <Option
          selected={state.financial === 'tight'}
          onClick={() => handleSelect('tight')}
        >
          <OptionTitle>Tight budget but managing</OptionTitle>
          <OptionDescription>
            Can afford some payment but not full amount
          </OptionDescription>
          <RadioCustom selected={state.financial === 'tight'} />
        </Option>

        <Option
          selected={state.financial === 'stable'}
          onClick={() => handleSelect('stable')}
        >
          <OptionTitle>Financially stable</OptionTitle>
          <OptionDescription>
            Can make regular payments
          </OptionDescription>
          <RadioCustom selected={state.financial === 'stable'} />
        </Option>
      </div>
    </StepCard>
  );
};

export default FinancialStep;