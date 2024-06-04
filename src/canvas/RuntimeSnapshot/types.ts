// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import type { PalletListItem } from 'model/Metadata/Scraper/types';

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
