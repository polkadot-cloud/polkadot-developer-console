// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionInjected } from '@w3ux/react-connect-kit/types';
import type { AnyJson } from '@w3ux/utils/types';
import type { NotificationItem } from 'controllers/Notifications/types';
import type { OnlineStatusEvent } from 'controllers/OnlineStatus/types';
import type { AccountBalanceEventDetail } from 'model/AccountBalances/types';
import type {
  APIChainSpecEventDetail,
  APIStatusEventDetail,
} from 'model/Api/types';
import type { BlockNumberEventDetail } from 'model/BlockNumber/types';
import type { ChainStateEventDetail } from 'model/ChainState/types';
import type { CSSProperties, ReactNode } from 'react';

declare global {
  interface Window {
    walletExtension?: AnyJson;
    injectedWeb3?: Record<string, ExtensionInjected>;
    opera?: boolean;
  }

  interface DocumentEventMap {
    'api-status': CustomEvent<APIStatusEventDetail>;
    'new-chain-spec': CustomEvent<APIChainSpecEventDetail>;
    'online-status': CustomEvent<OnlineStatusEvent>;
    'callback-block-number': CustomEvent<BlockNumberEventDetail>;
    'callback-account-balance': CustomEvent<AccountBalanceEventDetail>;
    'callback-new-chain-state': CustomEvent<ChainStateEventDetail>;
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
