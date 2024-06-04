// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import { camelize, setStateWithRef } from '@w3ux/utils';
import { useActiveTab } from 'contexts/ActiveTab';
import type { PalletListProps } from './ChainState/types';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import { useBrowseListWithKeys } from 'hooks/useBrowseListWithKeys';
import { useSelectFirst } from 'hooks/useSelectFirst';
import { SelectDropdown } from 'library/SelectDropdown';
import { SelectItemWrapper, SelectTextWrapper } from 'library/Inputs/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';

export const PalletList = ({
  pallets,
  activePallet,
  chainUiSection,
  onSelect,
}: PalletListProps) => {
  const { tabId, ownerId } = useActiveTab();
  const { getPalletVersions } = useChainSpaceEnv();
  const { getChainUi, setChainUiNamespace } = useChainUi();

  const palletVersions = getPalletVersions(ownerId) || {};
  const chainUi = getChainUi(tabId, chainUiSection);
  const { palletSearch } = chainUi;

  // Pallet selection open.
  const [palletsOpen, setPalletsOpenState] = useState<boolean>(false);
  const palletsOpenRef = useRef(palletsOpen);

  // Setter for pallet menu open state.
  const setPalletsOpen = (value: boolean) => {
    setStateWithRef(value, setPalletsOpenState, palletsOpenRef);
  };

  // Pallet search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle pallet search change.
  const handlePalletSearchChange = (value: string) => {
    setChainUiNamespace(tabId, chainUiSection, 'palletSearch', value);
  };

  // Gets a filtered list by applying a search term on pallet names, if not empty.
  const getFilteredPallets = (search: string) =>
    search !== ''
      ? pallets.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(search, true))
        )
      : pallets;

  // Filter providers based on search term, if present.
  const filteredPallets = getFilteredPallets(palletSearch);

  // Enable keyboard navigation for pallet selection.
  useBrowseListWithKeys({
    listItems: filteredPallets.map(({ name }) => name),
    listOpenRef: palletsOpenRef,
    activeValue: activePallet,
    onUpdate: (newItem: string) => {
      setChainUiNamespace(tabId, chainUiSection, 'pallet', newItem);
    },
  });

  // If the currently selected pallet is not in the filtered list, select the first item.
  useSelectFirst({
    isActive: chainUi['palletSelectOnSearch'] === true,
    onSelect,
    activeItem: activePallet,
    searchTerm: palletSearch,
    getFiltered: (searchTerm: string) =>
      getFilteredPallets(searchTerm).map(({ name }) => name),
  });

  // Focus the pallet search input when the menu is opened.
  useEffect(() => {
    if (palletsOpen) {
      searchInputRef.current?.focus();
    }
  }, [palletsOpen]);

  return (
    <section>
      <div className="inner">
        <h5>Pallet</h5>
        <SelectItemWrapper
          className={`standalone${palletsOpen ? ` open` : ``} ignore-outside-alerter-pallets`}
          onClick={() => {
            setPalletsOpen(!palletsOpen);
          }}
        >
          <span>
            <SelectTextWrapper>
              {activePallet ? camelize(activePallet) : 'No Pallets'}
            </SelectTextWrapper>
          </span>
          <span>
            {activePallet && palletVersions[activePallet] ? (
              <h5>v{palletVersions[activePallet]}</h5>
            ) : (
              ''
            )}

            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </SelectItemWrapper>

        <SelectDropdown
          open={palletsOpen}
          onOutsideClick={() => setPalletsOpen(false)}
          outsideAlerterIgnore={['ignore-outside-alerter-pallets']}
        >
          <SearchInput
            inputRef={searchInputRef}
            value={palletSearch}
            chainUiKeys={{
              searchKey: 'palletSearch',
              selectOnSearchKey: 'palletSelectOnSearch',
            }}
            chainUiSection={chainUiSection}
            onChange={(ev) => handlePalletSearchChange(ev.currentTarget.value)}
            onEnter={() => setPalletsOpen(false)}
            onEscape={() => setPalletsOpen(false)}
          />

          {filteredPallets.map(({ index, name }) => (
            <SelectItemWrapper
              key={`pallet_${index}_${name}`}
              className={`option${activePallet === name ? ` selected` : ``}`}
              onClick={() => {
                setPalletsOpen(false);
                onSelect(name);
              }}
            >
              <span>
                <SelectTextWrapper>{camelize(name)}</SelectTextWrapper>
              </span>
              <span>
                {palletVersions[name] ? <h5>v{palletVersions[name]}</h5> : ''}
              </span>
            </SelectItemWrapper>
          ))}
        </SelectDropdown>
      </div>
    </section>
  );
};
