import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageTransitionContextType {
  isTransitioning: boolean;
  startTransition: (callback?: () => void) => void;
  endTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

interface PageTransitionProviderProps {
  children: ReactNode;
}

export const PageTransitionProvider: React.FC<PageTransitionProviderProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionCallback, setTransitionCallback] = useState<(() => void) | null>(null);

  const startTransition = (callback?: () => void) => {
    setIsTransitioning(true);
    if (callback) {
      setTransitionCallback(() => callback);
    }
  };

  const endTransition = () => {
    setIsTransitioning(false);
    if (transitionCallback) {
      transitionCallback();
      setTransitionCallback(null);
    }
  };

  return (
    <PageTransitionContext.Provider 
      value={{ 
        isTransitioning, 
        startTransition, 
        endTransition 
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
};