// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectChainStateWrapper, Wrapper } from './Wrapper';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Header } from './Header';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import type { PalletsListItem } from 'model/Metadata/types';

export const ChainState = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();

  const metadata = getChainSpec(activeTabId)?.metadata;
  if (!metadata) {
    // TODO: handle UI where metadata has not yet been fetched.
    return null;
  }

  // Attempt to get pallet list from metadata.
  let palletList: PalletsListItem[];
  try {
    palletList = metadata.getPalletList();
  } catch (e) {
    palletList = [];
  }

  return (
    <Wrapper>
      <Header />
      <SelectChainStateWrapper>
        <section>
          <h5>Pallet</h5>
          <button className="input">
            <span>
              <h4>{palletList[0]?.name || 'No Pallets'}</h4>
            </span>
            <span>
              <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
            </span>
          </button>
        </section>
        <section>
          <h5>Storage Item</h5>
          <button className="input">
            <span>
              <h4>Storage Item</h4>
            </span>
            <span>
              <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
            </span>
          </button>
        </section>
      </SelectChainStateWrapper>
    </Wrapper>
  );
};
