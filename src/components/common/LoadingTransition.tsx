import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const VideoContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface LoadingTransitionProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

const LoadingTransition: React.FC<LoadingTransitionProps> = ({ 
  isLoading, 
  onLoadingComplete 
}) => {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowVideo(true);
      // Video duration + fade times
      const timer = setTimeout(() => {
        setShowVideo(false);
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, 2000); // Adjust timing based on your video length

      return () => clearTimeout(timer);
    }
  }, [isLoading, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <LoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <VideoContainer>
            <LoadingVideo
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/loading-animation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </LoadingVideo>
          </VideoContainer>
        </LoadingOverlay>
      )}
    </AnimatePresence>
  );
};

export default LoadingTransition;