import { OnboardingState, SpecialCircumstance } from '../types/onboarding';

export interface MockScenario {
  id: string;
  name: string;
  description: string;
  data: Partial<OnboardingState>;
  programData?: {
    recommendedPrograms?: string[];
    qualificationScores?: Record<string, number>;
  };
}

export const mockScenarios: MockScenario[] = [
  {
    id: 'qualified-oic',
    name: 'Qualified for OIC',
    description: 'User with financial hardship qualifying for Offer in Compromise',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'over50k',
      financial: 'hardship',
      circumstances: ['medical', 'unemployment'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['oic', 'cnc'],
      qualificationScores: {
        'oic': 85,
        'cnc': 75,
        'ia': 60,
        'penalty': 40
      }
    }
  },
  {
    id: 'installment-agreement',
    name: 'Installment Agreement',
    description: 'User qualifying for streamlined installment agreement',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'under50k',
      financial: 'stable',
      circumstances: [],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['ia', 'penalty'],
      qualificationScores: {
        'ia': 95,
        'penalty': 80,
        'oic': 30,
        'cnc': 20
      }
    }
  },
  {
    id: 'missing-returns',
    name: 'Missing Returns',
    description: 'User needs to file returns before qualifying for any program',
    data: {
      emergency: 'no',
      returns: 'no',
      debt: 'under50k',
      financial: 'tight',
      circumstances: [],
      currentStep: 6
    }
  },
  {
    id: 'cnc-eligible',
    name: 'Currently Not Collectible',
    description: 'User with severe financial hardship',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'over50k',
      financial: 'hardship',
      circumstances: ['disability', 'unemployment'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['cnc', 'oic'],
      qualificationScores: {
        'cnc': 90,
        'oic': 70,
        'ia': 40,
        'penalty': 50
      }
    }
  },
  {
    id: 'penalty-abatement',
    name: 'Penalty Abatement',
    description: 'User qualifying for penalty relief',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'under10k',
      financial: 'stable',
      circumstances: ['penalties', 'firstTime'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['penalty', 'ia'],
      qualificationScores: {
        'penalty': 95,
        'ia': 85,
        'oic': 20,
        'cnc': 10
      }
    }
  },
  {
    id: 'innocent-spouse',
    name: 'Innocent Spouse Relief',
    description: 'User qualifying for innocent spouse relief',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'under50k',
      financial: 'tight',
      circumstances: ['spouse', 'divorce'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['innocent', 'ia'],
      qualificationScores: {
        'innocent': 90,
        'ia': 70,
        'oic': 50,
        'cnc': 40,
        'penalty': 60
      }
    }
  },
  {
    id: 'emergency-action',
    name: 'Emergency IRS Action',
    description: 'User facing immediate IRS collection action',
    data: {
      emergency: 'yes',
      returns: 'yes',
      debt: 'over50k',
      financial: 'tight',
      circumstances: ['levy', 'lien'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['cnc', 'ia'],
      qualificationScores: {
        'cnc': 85,
        'ia': 75,
        'oic': 60,
        'penalty': 30
      }
    }
  },
  {
    id: 'multiple-programs',
    name: 'Multiple Programs',
    description: 'User qualifying for multiple relief options',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'under50k',
      financial: 'hardship',
      circumstances: ['penalties', 'medical', 'unemployment'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['oic', 'cnc', 'penalty', 'ia'],
      qualificationScores: {
        'oic': 80,
        'cnc': 85,
        'penalty': 75,
        'ia': 70
      }
    }
  },
  {
    id: 'high-income-ia',
    name: 'High Income IA',
    description: 'High earner needing non-streamlined installment agreement',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'over100k',
      financial: 'stable',
      circumstances: ['business'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['ia'],
      qualificationScores: {
        'ia': 100,
        'oic': 10,
        'cnc': 5,
        'penalty': 70
      }
    }
  },
  {
    id: 'retired-fixed-income',
    name: 'Retired Fixed Income',
    description: 'Retiree on Social Security with limited ability to pay',
    data: {
      emergency: 'no',
      returns: 'yes',
      debt: 'under50k',
      financial: 'hardship',
      circumstances: ['retirement', 'medical'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['cnc', 'oic'],
      qualificationScores: {
        'cnc': 95,
        'oic': 85,
        'ia': 50,
        'penalty': 60
      }
    }
  },
  {
    id: 'business-owner-complex',
    name: 'Business Owner Complex',
    description: 'Self-employed with complex financial situation',
    data: {
      emergency: 'no',
      returns: 'partial',
      debt: 'over100k',
      financial: 'tight',
      circumstances: ['business', 'covid'],
      currentStep: 6
    },
    programData: {
      recommendedPrograms: ['oic', 'ia'],
      qualificationScores: {
        'oic': 75,
        'ia': 80,
        'cnc': 55,
        'penalty': 65
      }
    }
  }
];

export const getMockScenario = (id: string): MockScenario | undefined => {
  return mockScenarios.find(scenario => scenario.id === id);
};

// Random selection helper
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate random test data
export const generateRandomAnswers = (): Partial<OnboardingState> => {
  const emergencyOptions = ['yes', 'no', 'unsure'];
  const returnsOptions = ['yes', 'no'];
  const debtOptions = ['under10k', 'under50k', 'over50k'];
  const financialOptions = ['hardship', 'tight', 'stable'];
  const circumstancesOptions = [
    'penalties', 'spouse', 'medical', 'disability', 
    'unemployment', 'divorce', 'firstTime', 'levy', 'lien'
  ];
  
  // Random selection helpers
  const randomCircumstances = (): SpecialCircumstance[] => {
    const count = Math.floor(Math.random() * 4); // 0-3 circumstances
    const selected: SpecialCircumstance[] = [];
    for (let i = 0; i < count; i++) {
      const option = randomChoice(circumstancesOptions) as SpecialCircumstance;
      if (!selected.includes(option)) {
        selected.push(option);
      }
    }
    return selected;
  };
  
  return {
    emergency: randomChoice(emergencyOptions) as any,
    returns: randomChoice(returnsOptions) as any,
    debt: randomChoice(debtOptions) as any,
    financial: randomChoice(financialOptions) as any,
    circumstances: randomCircumstances(),
    currentStep: 6
  };
};

// Generate mock data for program workflows
export interface ProgramMockData {
  installmentAgreement?: {
    totalDebt: number;
    monthlyPayment: number;
    agreementType: 'guaranteed' | 'streamlined' | 'non-streamlined';
  };
  offerInCompromise?: {
    totalDebt: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    assetValue: number;
    offerAmount: number;
  };
  currentlyNotCollectible?: {
    monthlyIncome: number;
    monthlyExpenses: number;
    hardshipType: string;
  };
  penaltyAbatement?: {
    penaltyAmount: number;
    taxYear: string;
    penaltyType: 'first-time' | 'reasonable-cause';
  };
  innocentSpouse?: {
    taxYears: string[];
    totalLiability: number;
    reliefType: 'traditional' | 'separation' | 'equitable';
  };
}

export const generateProgramMockData = (programId: string): ProgramMockData => {
  const mockData: ProgramMockData = {};
  
  switch (programId) {
    case 'ia':
    case 'installment-agreement':
      const totalDebt = Math.floor(Math.random() * 100000) + 5000;
      mockData.installmentAgreement = {
        totalDebt,
        monthlyPayment: Math.max(25, Math.floor(totalDebt / 72)),
        agreementType: totalDebt <= 10000 ? 'guaranteed' : 
                       totalDebt <= 50000 ? 'streamlined' : 
                       'non-streamlined'
      };
      break;
      
    case 'oic':
    case 'offer-in-compromise':
      mockData.offerInCompromise = {
        totalDebt: Math.floor(Math.random() * 100000) + 20000,
        monthlyIncome: Math.floor(Math.random() * 5000) + 2000,
        monthlyExpenses: Math.floor(Math.random() * 4500) + 1800,
        assetValue: Math.floor(Math.random() * 20000),
        offerAmount: Math.floor(Math.random() * 10000) + 1000
      };
      break;
      
    case 'cnc':
    case 'currently-not-collectible':
      const income = Math.floor(Math.random() * 2000) + 500;
      mockData.currentlyNotCollectible = {
        monthlyIncome: income,
        monthlyExpenses: income + Math.floor(Math.random() * 500) + 100,
        hardshipType: randomChoice(['unemployment', 'medical', 'fixed-income', 'other'])
      };
      break;
      
    case 'penalty':
    case 'penalty-abatement':
      mockData.penaltyAbatement = {
        penaltyAmount: Math.floor(Math.random() * 5000) + 500,
        taxYear: String(2023 - Math.floor(Math.random() * 3)),
        penaltyType: Math.random() > 0.5 ? 'first-time' : 'reasonable-cause'
      };
      break;
      
    case 'innocent':
    case 'innocent-spouse':
      const years = [];
      const startYear = 2023 - Math.floor(Math.random() * 5);
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        years.push(String(startYear - i));
      }
      mockData.innocentSpouse = {
        taxYears: years,
        totalLiability: Math.floor(Math.random() * 50000) + 5000,
        reliefType: randomChoice(['traditional', 'separation', 'equitable']) as any
      };
      break;
  }
  
  return mockData;
};