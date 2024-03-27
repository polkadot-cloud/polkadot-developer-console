// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { ChainUiItem } from 'contexts/ChainUi/types';
import type {
  PalletItemScraped,
  PalletListItem,
} from 'model/Metadata/Scraper/types';
import type { RefObject } from 'react';

export interface PalletData {
  pallets: PalletListItem[];
  activePallet: string | null;
  items: PalletItemScraped[];
  activeItem: string | null;
}

export interface PalletListProps {
  pallets: PalletListItem[];
  activePallet: string | null;
  chainUiSection: keyof ChainUiItem;
  onSelect: (value: string) => void;
  palletDataRef: RefObject<AnyJson>;
}

export interface ChainStateListProps {
  subject: string;
  items: PalletItemScraped[];
  activeItem: string | null;
  chainUiSection: keyof ChainUiItem;
}
