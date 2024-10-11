// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { PalletScraper } from 'model/Scraper/Pallet';
import type { PalletListItem } from 'model/Scraper/types';

export interface PalletItemProps {
  scraper: PalletScraper;
  pallet: PalletListItem;
}

export interface EmptyItemProps {
  text: string;
}

export interface SubheadingProps {
  text: string;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  getter?: () => Promise<void>;
}
