// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';

export const Default = () => {
  const { getActiveTab } = useTabs();

  return <h1>{getActiveTab()?.name || 'No Active Tab'}</h1>;
};
