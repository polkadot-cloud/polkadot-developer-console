// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Constants } from './Constants';
import { Header } from './Header';
import { StorageItems } from './StorageItems';
import { useChainUi } from 'contexts/ChainUi';
import { Raw } from './Raw';
import { useActiveTab } from 'contexts/ActiveTab';
import { FlexWrapper } from 'routes/Common/Wrappers';

export const ChainState = () => {
  const { tabId } = useActiveTab();
  const { getChainStateSection } = useChainUi();
  const activeChainStateSection = getChainStateSection(tabId);

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
    <FlexWrapper>
      <Header />
      {content}
    </FlexWrapper>
  );
};
