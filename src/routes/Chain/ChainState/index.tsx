// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SelectItemWrapper,
  SelectFormWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from '../Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Header } from './Header';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { useMemo, useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { PalletList } from '../PalletList';
import type { AnyJson } from '@w3ux/utils/types';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { FormatCallSignature } from 'model/Metadata/Format/CallSignature';

interface StorgeListItem {
  docs: string[];
  name: string;
  types: AnyJson;
  callSig: string;
}

export const ChainState = () => {
  const { activeTabId } = useTabs();
  const { getChainSpec } = useApi();
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // The currently selected pallet.
  const [selectedPallet, setSelectedPallet] = useState<string | null>(null);

  // Storage selection open.
  const [storageOpen, setStorageOpenState] = useState<boolean>(false);

  // Setter for storage item menu open state.
  const setStorageOpen = (value: boolean) => {
    setStorageOpenState(value);
  };

  // Refs for the selection menus.
  const storageSelectRef = useRef(null);

  // Close storage selection if clicked outside of its container.
  useOutsideAlerter(
    storageSelectRef,
    () => {
      setStorageOpen(false);
    },
    ['ignore-outside-alerter-storage']
  );

  // Fetch storage data when metadata or the selected pallet changes.
  const storageData = useMemo(() => {
    if (!Metadata) {
      return {
        pallets: [],
        activePallet: null,
        storageItems: [],
      };
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getList(['storage']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = selectedPallet || pallets?.[0].name || null;
    const storageItems = activePallet ? scraper.getStorage(activePallet) : [];

    return {
      storageItems,
      activePallet,
      pallets,
    };
  }, [selectedPallet, Metadata?.metadata]);

  const { pallets, activePallet, storageItems } = storageData;

  // Inject call signature into storage items.
  const storageList: StorgeListItem[] = useMemo(
    () =>
      storageItems
        .map((storageItem: AnyJson) => ({
          ...storageItem,
          callSig: new FormatCallSignature(storageItem).format(),
        }))
        .sort(({ name: nameA }, { name: nameB }) =>
          nameA < nameB ? -1 : nameA > nameB ? 1 : 0
        ),
    [storageItems]
  );

  return (
    <>
      <Header />
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          selected={activePallet}
          onSelect={(value) => setSelectedPallet(value)}
        />

        <section>
          <div className="inner">
            <h5>Storage Item</h5>
            <SelectItemWrapper
              className={`standalone${storageOpen ? ` open` : ``} ignore-outside-alerter-storage`}
              onClick={() => setStorageOpen(!storageOpen)}
            >
              <span>
                <SelectTextWrapper>
                  {storageList[0]?.name || 'No Storage Items'}
                  <span>{storageList[0]?.callSig || ''}</span>
                </SelectTextWrapper>
              </span>
              <span>
                <h5>{storageList[0]?.docs?.[0] || ''}</h5>
                <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
              </span>
            </SelectItemWrapper>

            <SelectDropdownWrapper
              ref={storageSelectRef}
              className={`${storageOpen ? ` open` : ``}`}
            >
              {storageList.map(({ name, docs, callSig }) => (
                <SelectItemWrapper
                  key={`storage_select_${name}`}
                  className="option"
                  onClick={() => setStorageOpen(false)}
                >
                  <span>
                    <SelectTextWrapper>
                      {name}
                      <span>{callSig}</span>
                    </SelectTextWrapper>
                  </span>
                  <span>
                    <h5>{docs[0]}</h5>
                  </span>
                </SelectItemWrapper>
              ))}
            </SelectDropdownWrapper>
          </div>
        </section>
      </SelectFormWrapper>
    </>
  );
};
