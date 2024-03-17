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
import { PalletList } from '../PalletList';
import type { AnyJson } from '@w3ux/utils/types';

export const ChainState = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();

  // The currently selected pallet.
  const [selectedPallet, setSelectedPallet] = useState<string | null>(null);

  // Storage selection open.
  const [storageOpen, setStorageOpen] = useState<boolean>(false);

  // Refs for the selection menus.
  const storageSelectRef = useRef(null);

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
  const pallets = scraper.getPallets(['storage']);

  const activePallet = selectedPallet || pallets?.[0].name || null;
  let storage = [];
  if (activePallet) {
    storage = scraper.getPalletStorage(activePallet);
  }

  const selection: {
    docs: string[];
    name: string;
    types: AnyJson;
  }[] = storage;

  return (
    <>
      <Header />
      <SelectChainItemWrapper className="withHeader">
        {/* Pallet Selection */}
        <PalletList
          pallets={pallets}
          selected={activePallet}
          onSelect={(value) => setSelectedPallet(value)}
        />

        {/* Storage Item Selection */}

        <section>
          <h5>Storage Item</h5>
          <ChainActiveItemWrapper
            className={storageOpen ? ` open` : undefined}
            onClick={() => setStorageOpen(!storageOpen)}
          >
            <span>
              <ChainListCallItem>
                {selection[0]?.name || 'No Storage Items'}
              </ChainListCallItem>
            </span>
            <span>
              <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
            </span>
          </ChainActiveItemWrapper>

          <div
            ref={storageSelectRef}
            className={`options${storageOpen ? ` open` : ``}`}
          >
            {selection.map(({ name, docs }) => (
              <ChainListItemWrapper key={`call_select_${name}`}>
                <span>
                  <ChainListCallItem>
                    {name}
                    {/* {fieldNames && <span>({fieldNames})</span>} */}
                  </ChainListCallItem>
                </span>
                <span>
                  <h5>{docs[0]}</h5>
                </span>
              </ChainListItemWrapper>
            ))}
          </div>
        </section>
      </SelectChainItemWrapper>
    </>
  );
};
