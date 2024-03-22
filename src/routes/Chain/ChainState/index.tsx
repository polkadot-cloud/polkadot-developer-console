// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { Constants } from './Constants';
import { Header } from './Header';
import { StorageItems } from './StorageItems';
import { useChainUi } from 'contexts/ChainUi';

export const ChainState = () => {
  const { activeTabId } = useTabs();
  const { getActiveChainStateSection } = useChainUi();
  const activeChainStateSection = getActiveChainStateSection(activeTabId);

  // TODO: Expand for raw storage.
  let content: JSX.Element;
  switch (activeChainStateSection) {
    case 'constants':
      content = <Constants />;
      break;

      break;
    case 'storage':
    default:
      content = <StorageItems />;
      break;
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
};
