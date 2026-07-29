import * as React from 'react';

export type LeaderStackItemProps = {
  children: React.ReactNode;
  itemClassName?: string;
};

export const LeaderStackItem: React.FC<LeaderStackItemProps>;

export interface LeaderScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  bottomSpace?: string | number;
  onStackComplete?: () => void;
}

declare const LeaderScrollStack: React.FC<LeaderScrollStackProps>;
export default LeaderScrollStack;
