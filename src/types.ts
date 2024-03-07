import type { NotificationItem } from 'controllers/NotificationsController/types';
import type {
  APIChainSpecEventDetail,
  APIStatusEventDetail,
} from 'model/Api/types';
import type { CSSProperties, ReactNode } from 'react';

declare global {
  interface DocumentEventMap {
    'api-status': CustomEvent<APIStatusEventDetail>;
    'new-chain-spec': CustomEvent<APIChainSpecEventDetail>;
    notification: CustomEvent<NotificationItem>;
  }
}

export interface ComponentBase {
  children?: ReactNode;
  style?: CSSProperties;
}

export type ComponentBaseWithClassName = ComponentBase & {
  className?: string;
};
