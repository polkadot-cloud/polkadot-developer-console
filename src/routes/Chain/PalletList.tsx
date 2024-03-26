// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SelectItemWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from './Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import type { PalletListItem } from 'model/Metadata/Scraper/types';
import { SearchWrapper } from 'library/ContextMenu/Wrappers';
import { formatInputString } from 'Utils';
import { useChainUi } from 'contexts/ChainUi';
import type { ChainUiItem } from 'contexts/ChainUi/types';
import { camelize } from '@w3ux/utils';
import { useActiveTabId } from 'contexts/ActiveTab';

export const PalletList = ({
  pallets,
  activePallet,
  chainUiSection,
  onSelect,
}: {
  pallets: PalletListItem[];
  activePallet: string | null;
  chainUiSection: keyof ChainUiItem;
  onSelect: (value: string) => void;
}) => {
  const activeTabId = useActiveTabId();
  const { getPalletVersions, getChainUi, setChainUiItem } = useChainUi();
  const palletVersions = getPalletVersions(activeTabId) || {};
  const chainUi = getChainUi(activeTabId, chainUiSection);
  const { palletSearch } = chainUi;

  // Pallet selection open.
  const [palletsOpen, setPalletsOpenState] = useState<boolean>(false);

  // Setter for pallet menu open state.
  const setPalletsOpen = (value: boolean) => {
    setPalletsOpenState(value);
  };

  // Handle pallet search change.
  const handlePalletSearchChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'palletSearch', value);
  };

  // Filter providers based on search term, if present.
  const filteredPallets =
    palletSearch !== ''
      ? pallets.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(palletSearch, true))
        )
      : pallets;

  // Selection menu ref.
  const palletSelectRef = useRef<HTMLDivElement>(null);

  // Pallet search input ref.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(
    palletSelectRef,
    () => {
      setPalletsOpen(false);
    },
    ['ignore-outside-alerter-pallets']
  );

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

        <SelectDropdownWrapper
          ref={palletSelectRef}
          className={`${palletsOpen ? ` open` : ``}`}
        >
          <SearchWrapper>
            <input
              ref={searchInputRef}
              placeholder="Search"
              value={palletSearch}
              onChange={(ev) =>
                handlePalletSearchChange(ev.currentTarget.value)
              }
              onKeyDown={(ev) => {
                // Close and retain search value on enter key.
                if (ev.key === 'Enter') {
                  setPalletsOpen(false);
                }
                if (ev.key === 'Escape') {
                  // If search value exists, first clear it.
                  if (chainUi.palletSearch.length > 0) {
                    setChainUiItem(
                      activeTabId,
                      chainUiSection,
                      'palletSearch',
                      ''
                    );
                  } else {
                    // No search, go ahead and close dropdown.
                    setPalletsOpen(false);
                  }
                }
              }}
            />
          </SearchWrapper>
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
        </SelectDropdownWrapper>
      </div>
    </section>
  );
};
