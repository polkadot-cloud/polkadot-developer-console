// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export interface UseSelectFirstProps {
  isActive: boolean;
  onSelect: (value: string) => void;
  activeItem: string | null;
  searchTerm: string;
  getFiltered: (value: string) => string[];
}
