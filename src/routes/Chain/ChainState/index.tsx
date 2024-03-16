// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChainListItemWrapper,
  ChainActiveItemWrapper,
  SelectChainItemWrapper,
} from '../Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Header } from './Header';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import type { PalletsListItem } from 'model/Metadata/types';
import { useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';

export const ChainState = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();

  // Pallet selection open.
  const [palletsOpen, setPalletsOpen] = useState<boolean>(false);

  // Storage selection open.
  const [storageOpen, setStorageOpen] = useState<boolean>(false);

  // Refs for the selection menus.
  const palletSelectRef = useRef(null);
  const storageSelectRef = useRef(null);

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(palletSelectRef, () => {
    setPalletsOpen(false);
  });

  // Close storage selection if clicked outside of its container.
  useOutsideAlerter(storageSelectRef, () => {
    setStorageOpen(false);
  });

  const Metadata = getChainSpec(activeTabId)?.metadata;
  if (!Metadata) {
    // TODO: handle UI where metadata has not yet been fetched.
    return null;
  }

  // Attempt to get pallet list from metadata.
  let palletList: PalletsListItem[];
  try {
    palletList = Metadata.getPalletList();
  } catch (e) {
    palletList = [];
  }

  return (
    <>
      <Header />
      <SelectChainItemWrapper>
        {/* Pallet Selection */}

        <section>
          <h5>Pallet</h5>
          <ChainActiveItemWrapper
            className={palletsOpen ? ` open` : undefined}
            onClick={() => setPalletsOpen(!palletsOpen)}
          >
            <span>
              <h4>{palletList[0]?.name || 'No Pallets'}</h4>
            </span>
            <span>
              <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
            </span>
          </ChainActiveItemWrapper>

          <div
            ref={palletSelectRef}
            className={`options${palletsOpen ? ` open` : ``}`}
          >
            <ChainListItemWrapper>
              <span>
                <h4>{palletList[0]?.name || 'No Pallets'}</h4>
              </span>
              <span></span>
            </ChainListItemWrapper>
          </div>
        </section>

        {/* Storage Item Selection */}

        <section>
          <h5>Storage Item</h5>
          <ChainActiveItemWrapper
            className={storageOpen ? ` open` : undefined}
            onClick={() => setStorageOpen(!storageOpen)}
          >
            <span>
              <h4>Storage Item</h4>
            </span>
            <span>
              <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
            </span>
          </ChainActiveItemWrapper>

          <div
            ref={storageSelectRef}
            className={`options${storageOpen ? ` open` : ``}`}
          >
            <ChainListItemWrapper>
              <span>
                <h4>{palletList[0]?.name || 'No Pallets'}</h4>
              </span>
              <span>
                <h5>Some docs with text overflow.</h5>
              </span>
            </ChainListItemWrapper>
          </div>
        </section>
      </SelectChainItemWrapper>
    </>
  );
};
