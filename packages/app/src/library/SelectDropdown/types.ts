// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode, RefObject } from 'react';

export interface SelectDropdownProps {
  open: boolean;
  children: ReactNode;
  onOutsideClick: () => void;
  outsideAlerterIgnore?: string[];
  className?: string;
  heightRef?: RefObject<HTMLDivElement>;
}
