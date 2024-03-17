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
import type { PalletListItem } from 'controllers/MetadataScraper/types';

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
  const [palletsOpen, setPalletsOpen] = useState<boolean>(false);

  // Selection menu ref.
  const palletSelectRef = useRef<HTMLDivElement>(null);

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(palletSelectRef, () => {
    setPalletsOpen(false);
  });

  return (
    <section>
      <h5>Pallet</h5>
      <SelectItemWrapper
        className={`standalone ${palletsOpen ? ` open` : ``}`}
        onClick={() => setPalletsOpen(!palletsOpen)}
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
            className="option"
            key={`pallet_${index}_${name}`}
            onClick={() => onSelect(name)}
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
