import { useNavigate } from 'react-router-dom';
import { usePageTransition } from '../context/PageTransitionContext';

export const useTransitionNavigation = () => {
  const navigate = useNavigate();
  const { startTransition } = usePageTransition();

  const navigateWithTransition = (to: string, options?: { replace?: boolean }) => {
    startTransition(() => {
      navigate(to, options);
    });
  };

  return { navigateWithTransition };
};