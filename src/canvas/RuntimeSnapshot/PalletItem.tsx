// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CanvasSubheading } from 'canvas/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PalletListItem } from 'model/Metadata/Scraper/types';
import { useState } from 'react';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';

export const PalletItem = ({ pallet }: { pallet: PalletListItem }) => {
  const { name } = pallet;

  // Store whether the pallet is expanded or not.
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <CanvasSubheading>
        <span>
          <FontAwesomeIcon
            icon={expanded ? faChevronDown : faChevronRight}
            transform="shrink-6"
          />
        </span>
        <button onClick={() => setExpanded(!expanded)}>{name}</button>
      </CanvasSubheading>

      <motion.div
        style={{ paddingLeft: '1rem', overflow: 'hidden' }}
        initial="hidden"
        animate={expanded ? 'show' : 'hidden'}
        variants={{
          hidden: {
            height: 0,
            opacity: 1,
          },
          show: {
            height: 'auto',
            opacity: 1,
          },
        }}
        transition={{
          duration: 1,
          ease: [0.1, 1, 0.1, 1],
        }}
      >
        <CanvasSubheading>
          <span>
            <FontAwesomeIcon icon={faChevronRight} transform="shrink-6" />
          </span>
          Storage Items
        </CanvasSubheading>

        <CanvasSubheading>
          <span>
            <FontAwesomeIcon icon={faChevronRight} transform="shrink-6" />
          </span>
          Constants
        </CanvasSubheading>

        <CanvasSubheading>
          <span>
            <FontAwesomeIcon icon={faChevronRight} transform="shrink-6" />
          </span>
          Errors
        </CanvasSubheading>

        <CanvasSubheading>
          <span>
            <FontAwesomeIcon icon={faChevronRight} transform="shrink-6" />
          </span>
          Events
        </CanvasSubheading>
      </motion.div>
    </>
  );
};
