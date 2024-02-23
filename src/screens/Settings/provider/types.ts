// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';

export interface SettingsContextInterface {
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
}
