import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, transitions } from '../../theme';
import { mockScenarios, getMockScenario } from '../../utils/mockData';
import { useOnboarding } from '../../context/OnboardingContext';

const ToggleContainer = styled.div`
  position: fixed;
  bottom: ${spacing.xl};
  right: ${spacing.xl};
  z-index: 100;
`;

const ToggleButton = styled.button`
  background: ${colors.primary[600]};
  color: ${colors.white};
  border: none;
  border-radius: ${radius.full};
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${shadows.lg};
  transition: all ${transitions.base};
  
  &:hover {
    background: ${colors.primary[700]};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MockPanel = styled(motion.div)`
  position: absolute;
  bottom: calc(100% + ${spacing.md});
  right: 0;
  background: ${colors.white};
  border-radius: ${radius.xl};
  box-shadow: ${shadows.xl};
  width: 320px;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  padding: ${spacing.lg};
  border-bottom: 1px solid ${colors.border.light};
`;

const PanelTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.xs} 0;
`;

const PanelSubtitle = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin: 0;
`;

const ScenarioList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.md};
`;

const ScenarioItem = styled.button`
  width: 100%;
  text-align: left;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  margin-bottom: ${spacing.sm};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    background: ${colors.primary[50]};
    border-color: ${colors.primary[300]};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ScenarioName = styled.div`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ScenarioDescription = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
`;

const ProgramScores = styled.div`
  margin-top: ${spacing.sm};
  display: flex;
  gap: ${spacing.xs};
  flex-wrap: wrap;
`;

const ScoreBadge = styled.span<{ score: number }>`
  font-size: ${typography.fontSize.xs};
  padding: 2px 8px;
  border-radius: ${radius.full};
  background: ${props => 
    props.score >= 80 ? colors.success[100] :
    props.score >= 60 ? colors.warning[100] :
    colors.error[100]
  };
  color: ${props => 
    props.score >= 80 ? colors.success[700] :
    props.score >= 60 ? colors.warning[700] :
    colors.error[700]
  };
`;

const PanelFooter = styled.div`
  padding: ${spacing.md};
  border-top: 1px solid ${colors.border.light};
  display: flex;
  gap: ${spacing.sm};
`;

const ActionButton = styled.button`
  flex: 1;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${transitions.base};
  border: 1px solid ${colors.border.main};
  background: ${colors.white};
  color: ${colors.text.primary};
  
  &:hover {
    background: ${colors.gray[50]};
  }
  
  &.primary {
    background: ${colors.primary[600]};
    color: ${colors.white};
    border-color: transparent;
    
    &:hover {
      background: ${colors.primary[700]};
    }
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${colors.warning[500]};
  color: ${colors.white};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.bold};
  padding: 2px 6px;
  border-radius: ${radius.full};
`;

export const MockModeToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useOnboarding();
  
  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = getMockScenario(scenarioId);
    if (scenario) {
      dispatch({ type: 'LOAD_MOCK_DATA', payload: scenario.data });
      setIsOpen(false);
    }
  };
  
  const handleRandomData = () => {
    const { generateRandomAnswers } = require('../../utils/mockData');
    const randomData = generateRandomAnswers();
    dispatch({ type: 'LOAD_MOCK_DATA', payload: randomData });
    setIsOpen(false);
  };
  
  const handleReset = () => {
    dispatch({ type: 'RESET' });
    setIsOpen(false);
  };
  
  return (
    <ToggleContainer>
      <AnimatePresence>
        {isOpen && (
          <MockPanel
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <PanelHeader>
              <PanelTitle>Mock Data Mode</PanelTitle>
              <PanelSubtitle>Select a test scenario or generate random data</PanelSubtitle>
            </PanelHeader>
            
            <ScenarioList>
              {mockScenarios.map(scenario => (
                <ScenarioItem
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario.id)}
                >
                  <ScenarioName>{scenario.name}</ScenarioName>
                  <ScenarioDescription>{scenario.description}</ScenarioDescription>
                  {scenario.programData?.qualificationScores && (
                    <ProgramScores>
                      {Object.entries(scenario.programData.qualificationScores).map(([program, score]) => (
                        <ScoreBadge key={program} score={score}>
                          {program.toUpperCase()}: {score}%
                        </ScoreBadge>
                      ))}
                    </ProgramScores>
                  )}
                </ScenarioItem>
              ))}
            </ScenarioList>
            
            <PanelFooter>
              <ActionButton onClick={handleRandomData}>
                Random Data
              </ActionButton>
              <ActionButton onClick={handleReset}>
                Reset Form
              </ActionButton>
              <ActionButton className="primary" onClick={() => setIsOpen(false)}>
                Close
              </ActionButton>
            </PanelFooter>
          </MockPanel>
        )}
      </AnimatePresence>
      
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        <Badge>TEST</Badge>
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </ToggleButton>
    </ToggleContainer>
  );
};

export default MockModeToggle;