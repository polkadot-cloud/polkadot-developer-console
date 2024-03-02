// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Chain } from './Chain';
import { ManageTab } from './ManageTab';
import { useSection } from 'library/Page/provider';

export const Default = () => {
  const { activeSection } = useSection();

  return (
    <>
      {activeSection === 0 && <Chain />}
      {activeSection === 1 && <ManageTab />}
    </>
  );
};
