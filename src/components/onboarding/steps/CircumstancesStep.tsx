import React from 'react';
import StepCard from '../StepCard';
import { Option, OptionTitle, OptionDescription, RadioCustom } from '../Option';
import { useOnboarding } from '../../../context/OnboardingContext';
import { SpecialCircumstance } from '../../../types/onboarding';

interface CircumstancesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const CircumstancesStep: React.FC<CircumstancesStepProps> = ({ onNext, onBack }) => {
  const { state, dispatch } = useOnboarding();

  const handleToggle = (value: SpecialCircumstance) => {
    dispatch({ type: 'TOGGLE_CIRCUMSTANCE', payload: value });
  };

  const isSelected = (value: SpecialCircumstance) => 
    state.circumstances.includes(value);

  return (
    <StepCard
      stepNumber={6}
      title="Do any special circumstances apply?"
      subtitle="Select all that apply to your situation"
      onNext={onNext}
      onBack={onBack}
      nextText="Get My Options"
      nextDisabled={state.circumstances.length === 0}
    >
      <div>
        <Option
          selected={isSelected('penalties')}
          onClick={() => handleToggle('penalties')}
        >
          <OptionTitle>Mostly penalties (not actual tax)</OptionTitle>
          <OptionDescription>
            May qualify for penalty abatement
          </OptionDescription>
          <RadioCustom selected={isSelected('penalties')} />
        </Option>

        <Option
          selected={isSelected('spouse')}
          onClick={() => handleToggle('spouse')}
        >
          <OptionTitle>Joint return with ex-spouse</OptionTitle>
          <OptionDescription>
            Possible innocent spouse relief
          </OptionDescription>
          <RadioCustom selected={isSelected('spouse')} />
        </Option>

        <Option
          selected={isSelected('old')}
          onClick={() => handleToggle('old')}
        >
          <OptionTitle>Tax debt over 3 years old</OptionTitle>
          <OptionDescription>
            May be dischargeable in bankruptcy
          </OptionDescription>
          <RadioCustom selected={isSelected('old')} />
        </Option>

        <Option
          selected={isSelected('none')}
          onClick={() => handleToggle('none')}
        >
          <OptionTitle>None of these apply</OptionTitle>
          <OptionDescription>
            Continue with standard options
          </OptionDescription>
          <RadioCustom selected={isSelected('none')} />
        </Option>
      </div>
    </StepCard>
  );
};

export default CircumstancesStep;