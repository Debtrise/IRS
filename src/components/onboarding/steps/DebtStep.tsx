import React from 'react';
import StepCard from '../StepCard';
import { Option, OptionTitle, OptionDescription, RadioCustom } from '../Option';
import { useOnboarding } from '../../../context/OnboardingContext';
import { DebtAmount } from '../../../types/onboarding';

interface DebtStepProps {
  onNext: () => void;
  onBack: () => void;
}

const DebtStep: React.FC<DebtStepProps> = ({ onNext, onBack }) => {
  const { state, dispatch } = useOnboarding();

  const handleSelect = (value: DebtAmount) => {
    dispatch({ type: 'SET_DEBT', payload: value });
  };

  return (
    <StepCard
      stepNumber={4}
      title="How much do you owe in total?"
      subtitle="Include all tax years, penalties, and interest"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!state.debt}
    >
      <div>
        <Option
          selected={state.debt === 'under10k'}
          onClick={() => handleSelect('under10k')}
        >
          <OptionTitle>Under $10,000</OptionTitle>
          <OptionDescription>
            Qualifies for guaranteed installment agreement
          </OptionDescription>
          <RadioCustom selected={state.debt === 'under10k'} />
        </Option>

        <Option
          selected={state.debt === 'under50k'}
          onClick={() => handleSelect('under50k')}
        >
          <OptionTitle>$10,000 - $50,000</OptionTitle>
          <OptionDescription>
            Eligible for streamlined options
          </OptionDescription>
          <RadioCustom selected={state.debt === 'under50k'} />
        </Option>

        <Option
          selected={state.debt === 'over50k'}
          onClick={() => handleSelect('over50k')}
        >
          <OptionTitle>Over $50,000</OptionTitle>
          <OptionDescription>
            Full financial disclosure required
          </OptionDescription>
          <RadioCustom selected={state.debt === 'over50k'} />
        </Option>
      </div>
    </StepCard>
  );
};

export default DebtStep;