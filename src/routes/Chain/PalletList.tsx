// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SelectItemWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from './Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import type { PalletListItem } from 'model/Metadata/Scraper/types';

export const PalletList = ({
  pallets,
  selected,
  onSelect,
}: {
  pallets: PalletListItem[];
  selected: string | null;
  onSelect: (value: string) => void;
}) => {
  // Pallet selection open.
  const [palletsOpen, setPalletsOpenState] = useState<boolean>(false);

  // Setter for pallet menu open state.
  const setPalletsOpen = (value: boolean) => {
    setPalletsOpenState(value);
  };

  // Selection menu ref.
  const palletSelectRef = useRef<HTMLDivElement>(null);

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(
    palletSelectRef,
    () => {
      setPalletsOpen(false);
    },
    ['ignore-outside-alerter-pallets']
  );

  return (
    <section>
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
          <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
        </span>
      </SelectItemWrapper>

      <SelectDropdownWrapper
        ref={palletSelectRef}
        className={`${palletsOpen ? ` open` : ``}`}
      >
        {pallets.map(({ index, name }) => (
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
            <span></span>
          </SelectItemWrapper>
        ))}
      </SelectDropdownWrapper>
    </section>
  );
};
