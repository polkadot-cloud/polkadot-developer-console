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
import { useTabs } from 'contexts/Tabs';

export const PalletList = ({
  pallets,
  selected,
  onSelect,
}: {
  pallets: PalletListItem[];
  selected: string | null;
  onSelect: (value: string) => void;
}) => {
  const { activeTabId } = useTabs();
  const { getPalletVersions } = useChainUi();
  const palletVersions = getPalletVersions(activeTabId) || {};

  // Pallet selection open.
  const [palletsOpen, setPalletsOpenState] = useState<boolean>(false);

  // Pallet search term.
  const [palletSearchTerm, setPalletSearchTerm] = useState<string>('');

  // Setter for pallet menu open state.
  const setPalletsOpen = (value: boolean) => {
    setPalletsOpenState(value);
  };

  // Handle pallet search change.
  const handlePalletSearchChange = (value: string) => {
    setPalletSearchTerm(value);
  };

  // Filter providers based on search term, if present.
  const filteredPallets =
    palletSearchTerm !== ''
      ? pallets.filter(({ name }) =>
          name.toLowerCase().includes(formatInputString(palletSearchTerm, true))
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
            <SelectTextWrapper>{selected || 'No Pallets'}</SelectTextWrapper>
          </span>
          <span>
            {selected && palletVersions[selected] ? (
              <h5>v{palletVersions[selected]}</h5>
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
              value={palletSearchTerm}
              onChange={(ev) =>
                handlePalletSearchChange(ev.currentTarget.value)
              }
            />
          </SearchWrapper>
          {filteredPallets.map(({ index, name }) => (
            <SelectItemWrapper
              key={`pallet_${index}_${name}`}
              className={`option${selected === name ? ` selected` : ``}`}
              onClick={() => {
                setPalletsOpen(false);
                onSelect(name);
              }}
            >
              <span>
                <SelectTextWrapper>{name}</SelectTextWrapper>
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
