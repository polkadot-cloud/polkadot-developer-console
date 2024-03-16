// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChainActiveItemWrapper,
  ChainListCallItem,
  ChainListItemWrapper,
} from '../Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import type { PalletListItem } from 'controllers/MetadataScraper/types';

export const PalletList = ({ pallets }: { pallets: PalletListItem[] }) => {
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
        {pallets.map(({ index, name }) => (
          <ChainListItemWrapper key={`pallet_${index}_${name}`}>
            <span>
              <ChainListCallItem>{name}</ChainListCallItem>
            </span>
            <span></span>
          </ChainListItemWrapper>
        ))}
      </div>
    </section>
  );
};
