// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainStateSection, ChainUiItem } from 'contexts/ChainUi/types';
import type {
  PalletItemScraped,
  PalletListItem,
} from 'model/Metadata/Scraper/types';

export interface PalletData {
  pallets: PalletListItem[];
  activePallet: string | null;
  items: PalletItemScraped[];
}

export interface PalletListProps {
  pallets: PalletListItem[];
  activePallet: string | null;
  chainUiSection: keyof ChainUiItem;
  onSelect: (value: string) => void;
}

export interface ChainStateListProps {
  subject: string;
  items: PalletItemScraped[];
  activeItem: string | null;
  chainUiSection: ChainStateSection;
}

export interface EncodedDetailsProps {
  activePallet: string;
  activeItem: string;
}
