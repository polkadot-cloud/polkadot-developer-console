// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Constants } from './Constants';
import { Header } from './Header';
import { StorageItems } from './StorageItems';
import { useChainUi } from 'contexts/ChainUi';
import { Raw } from './Raw';
import { useActiveTabId } from 'contexts/RenderedTab';

export const ChainState = () => {
  const activeTabId = useActiveTabId();
  const { getActiveChainStateSection } = useChainUi();
  const activeChainStateSection = getActiveChainStateSection(activeTabId);

  let content: JSX.Element;
  switch (activeChainStateSection) {
    case 'constants':
      content = <Constants />;
      break;

    case 'raw':
      content = <Raw />;
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
