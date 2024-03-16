// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChainListItemWrapper,
  ChainActiveItemWrapper,
  SelectChainItemWrapper,
  ChainListCallItem,
} from '../Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Header } from './Header';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { MetadataScraper } from 'controllers/MetadataScraper';

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

  // Get pallet list from scraper.
  const scraper = new MetadataScraper(Metadata);
  const pallets = scraper.getPallets();

  return (
    <>
      <Header />
      <SelectChainItemWrapper className="withHeader">
        {/* Pallet Selection */}

        <section>
          <h5>Pallet</h5>
          <ChainActiveItemWrapper
            className={palletsOpen ? ` open` : undefined}
            onClick={() => setPalletsOpen(!palletsOpen)}
          >
            <span>
              <ChainListCallItem>
                {pallets[0]?.name || 'No Pallets'}
              </ChainListCallItem>
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
                <ChainListCallItem>
                  {pallets[0]?.name || 'No Pallets'}
                </ChainListCallItem>
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
              <ChainListCallItem>Storage Item</ChainListCallItem>
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
                <ChainListCallItem>
                  {pallets[0]?.name || 'No Pallets'}
                </ChainListCallItem>
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
