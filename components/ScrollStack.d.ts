import * as React from 'react';

export type ScrollStackItemProps = {
  children: React.ReactNode;
  itemClassName?: string;
};

export const ScrollStackItem: React.FC<ScrollStackItemProps>;

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

declare const ScrollStack: React.FC<ScrollStackProps>;
export default ScrollStack;
