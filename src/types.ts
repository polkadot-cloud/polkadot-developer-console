import type { APIStatusEventDetail } from 'model/Api/types';
import type { CSSProperties, ReactNode } from 'react';

declare global {
  interface DocumentEventMap {
    'api-status': CustomEvent<APIStatusEventDetail>;
  }
}

export interface ComponentBase {
  children?: ReactNode;
  style?: CSSProperties;
}

export type ComponentBaseWithClassName = ComponentBase & {
  className?: string;
};
