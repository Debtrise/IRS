import React from 'react';
import StepCard from '../StepCard';
import { Option, OptionTitle, OptionDescription, RadioCustom } from '../Option';
import { useOnboarding } from '../../../context/OnboardingContext';
import { EmergencyStatus } from '../../../types/onboarding';

interface EmergencyStepProps {
  onNext: () => void;
  onBack: () => void;
}

const EmergencyStep: React.FC<EmergencyStepProps> = ({ onNext, onBack }) => {
  const { state, dispatch } = useOnboarding();

  const handleSelect = (value: EmergencyStatus) => {
    dispatch({ type: 'SET_EMERGENCY', payload: value });
  };

  return (
    <StepCard
      stepNumber={2}
      title="Are you facing any immediate IRS collection actions?"
      subtitle="This helps us prioritize urgent relief options"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!state.emergency}
    >
      <div>
        <Option
          selected={state.emergency === 'yes'}
          onClick={() => handleSelect('yes')}
        >
          <OptionTitle>Yes, I need immediate help</OptionTitle>
          <OptionDescription>
            Wage garnishment, bank levy, or asset seizure is active or imminent
          </OptionDescription>
          <RadioCustom selected={state.emergency === 'yes'} />
        </Option>

        <Option
          selected={state.emergency === 'no'}
          onClick={() => handleSelect('no')}
        >
          <OptionTitle>No immediate threats</OptionTitle>
          <OptionDescription>
            I have time to explore my options
          </OptionDescription>
          <RadioCustom selected={state.emergency === 'no'} />
        </Option>
      </div>
    </StepCard>
  );
};

export default EmergencyStep;