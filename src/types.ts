// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ExtensionInjected } from '@w3ux/react-connect-kit/types';
import type { AnyJson } from '@w3ux/types';
import type { NotificationItem } from 'controllers/Notifications/types';
import type { OnlineStatusEvent } from 'controllers/OnlineStatus/types';
import type { AccountBalanceEventDetail } from 'model/AccountBalances/types';
import type {
  APIChainSpecEventDetail,
  APIStatusEventDetail,
} from 'model/Api/types';
import type { BlockNumberEventDetail } from 'model/BlockNumber/types';
import type {
  ChainStateConstantEventDetail,
  ChainStateEventDetail,
} from 'model/ChainState/types';
import type { NextFreeParaIdEventDetail } from 'model/NextFreeParaId/types';

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
    'callback-next-free-para-id': CustomEvent<NextFreeParaIdEventDetail>;
    'callback-account-balance': CustomEvent<AccountBalanceEventDetail>;
    'callback-new-chain-state-subscription': CustomEvent<ChainStateEventDetail>;
    'callback-new-chain-state-constant': CustomEvent<ChainStateConstantEventDetail>;
    notification: CustomEvent<NotificationItem>;
  }
}

// Over-arching type for an owner id. Used for owners of api instances.
export type OwnerId = string;

// Over-arching type for a chainspace id. Used for chain space keys.
export type ChainSpaceId = string;
