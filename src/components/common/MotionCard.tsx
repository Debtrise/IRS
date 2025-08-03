import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Card } from './Card';

type CardProps = React.ComponentProps<typeof Card>;
type MotionCardProps = CardProps & MotionProps;

export const MotionCard = motion(Card);

export default MotionCard;