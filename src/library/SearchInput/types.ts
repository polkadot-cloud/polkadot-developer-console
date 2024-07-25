// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  icon?: IconProp;
  iconTransform?: string;
}
