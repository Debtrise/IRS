import React from 'react';
import StepCard from '../StepCard';
import { Option, OptionTitle, OptionDescription, RadioCustom } from '../Option';
import { useOnboarding } from '../../../context/OnboardingContext';
import styled from 'styled-components';
import { colors, spacing, radius, typography } from '../../../theme';

const InfoBox = styled.div`
  background: ${colors.status.info.light};
  border: 1px solid ${colors.status.info.border};
  border-radius: ${radius.md};
  padding: ${spacing.lg};
  margin-top: ${spacing.xl};
  font-size: ${typography.fontSize.sm};
  color: ${colors.status.info.text};
`;

interface ReturnsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const ReturnsStep: React.FC<ReturnsStepProps> = ({ onNext, onBack }) => {
  const { state, dispatch } = useOnboarding();

  const handleSelect = (value: 'yes' | 'no') => {
    dispatch({ type: 'SET_RETURNS', payload: value });
  };

  return (
    <StepCard
      stepNumber={3}
      title="Have you filed all required tax returns?"
      subtitle="Most IRS relief programs require all returns to be filed"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!state.returns}
    >
      <div>
        <Option
          selected={state.returns === 'yes'}
          onClick={() => handleSelect('yes')}
        >
          <OptionTitle>Yes, all returns are filed</OptionTitle>
          <OptionDescription>
            I'm up to date with all my tax filings
          </OptionDescription>
          <RadioCustom selected={state.returns === 'yes'} />
        </Option>

        <Option
          selected={state.returns === 'no'}
          onClick={() => handleSelect('no')}
        >
          <OptionTitle>No, I have unfiled returns</OptionTitle>
          <OptionDescription>
            I need to file one or more past returns
          </OptionDescription>
          <RadioCustom selected={state.returns === 'no'} />
        </Option>
      </div>

      <InfoBox>
        <strong>Important:</strong> You must file all required returns before qualifying for most relief programs. We can help you understand what needs to be filed.
      </InfoBox>
    </StepCard>
  );
};

export default ReturnsStep;