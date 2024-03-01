import type { CSSProperties, ReactNode } from 'react';

export interface ComponentBase {
  children?: ReactNode;
  style?: CSSProperties;
}

export type ComponentBaseWithClassName = ComponentBase & {
  className?: string;
};
