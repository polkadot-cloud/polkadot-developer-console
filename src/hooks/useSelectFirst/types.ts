// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface UseSelectFirstProps {
  isActive: boolean;
  onSelect: (value: string) => void;
  activeItem: string | null;
  searchTerm: string;
  getFiltered: (value: string) => string[];
}
