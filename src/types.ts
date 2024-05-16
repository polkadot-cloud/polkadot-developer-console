// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
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
    'callback-new-chain-state-subscription': CustomEvent<ChainStateEventDetail>;
    notification: CustomEvent<NotificationItem>;
  }
}

// Over-arching type for an owner id. Used for owners of api instances.
export type OwnerId = string;

// Over-arching type for a chainspace id. Used for chain space keys.
export type ChainSpaceId = string;

export interface ComponentBase {
  children?: ReactNode;
  style?: CSSProperties;
}

export type ComponentBaseWithClassName = ComponentBase & {
  className?: string;
};
