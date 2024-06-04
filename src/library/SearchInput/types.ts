// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  icon?: IconProp;
  iconTransform?: string;
}
