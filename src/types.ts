import type { EventDetail } from 'model/Api/types';
import type { CSSProperties, ReactNode } from 'react';

declare global {
  interface DocumentEventMap {
    'api-status': CustomEvent<EventDetail>;
  }
}

export interface ComponentBase {
  children?: ReactNode;
  style?: CSSProperties;
}

export type ComponentBaseWithClassName = ComponentBase & {
  className?: string;
};
