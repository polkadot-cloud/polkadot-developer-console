// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type {
  ChainStateSection,
  ChainUiNamespace,
  InputNamespace,
} from 'contexts/ChainUi/types';
import type { StorageType } from 'model/ChainState/types';
import type { PalletScraper } from 'model/Scraper/Pallet';
import type { PalletItemScraped, PalletListItem } from 'model/Scraper/types';

export interface PalletData {
  pallets: PalletListItem[];
  activePallet: string | null;
  items: PalletItemScraped[];
}

export interface PalletListProps {
  pallets: PalletListItem[];
  activePallet: string | null;
  chainUiSection: keyof ChainUiNamespace;
  onSelect: (value: string) => void;
}

export interface ChainStateListProps {
  subject: string;
  items: PalletItemScraped[];
  activeItem: string | null;
  chainUiSection: ChainStateSection;
  scraper: PalletScraper | null;
}

export interface EncodedDetailsProps {
  activePallet: string;
  activeItem: string;
}

export interface ChainStateResultProps {
  chainStateKey: string;
  type: StorageType;
  result: AnyJson;
  pinned: boolean;
}

export interface InputFormProps {
  namespace: InputNamespace;
  inputForm: AnyJson;
  activeItem: string | null;
  onSubmit: (inputs: AnyJson) => void;
}
