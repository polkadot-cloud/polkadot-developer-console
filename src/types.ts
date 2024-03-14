// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NotificationItem } from 'controllers/Notifications/types';
import type { OnlineStatusEvent } from 'controllers/OnlineStatus/types';
import type {
  APIChainSpecEventDetail,
  APIStatusEventDetail,
} from 'model/Api/types';
import type { CSSProperties, ReactNode } from 'react';

declare global {
  interface DocumentEventMap {
    'api-status': CustomEvent<APIStatusEventDetail>;
    'new-chain-spec': CustomEvent<APIChainSpecEventDetail>;
    'online-status': CustomEvent<OnlineStatusEvent>;
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
