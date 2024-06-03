// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CanvasSubheading, RuntimeItemWrapper } from 'canvas/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PalletItemScraped } from 'model/Metadata/Scraper/types';
import { Fragment, useRef, useState } from 'react';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import type { Sync } from '@w3ux/react-connect-kit/types';
import { EmptyItem } from './EmptyItem';
import { getMotionProps } from './Utils';
import type { PalletItemProps } from './types';
import { Subheading } from './Subheading';

export const PalletItem = ({ pallet, scraper }: PalletItemProps) => {
  const { name } = pallet;

  // Store whether pallet is expanded.
  const [palletExpanded, setPalletExpanded] = useState(false);

  // Store whether storage items are expaneded.
  const [storageItemsExpanded, setStorageItemsExpanded] = useState(false);

  // Store whether pallet constants are expaneded.
  const [constantsExpanded, setConstantsExpanded] = useState(false);

  // Store the storage items for the pallet. Lazily populated when user expands.
  const [storageItems, setStorageItems] = useState<PalletItemScraped[]>();
  const fetchingStorageRef = useRef<Sync>('unsynced');

  // Store the constants for the pallet. Lazily populated when user expands.
  // items.
  const [constants, setConstants] = useState<PalletItemScraped[]>();
  const fetchingConstantsRef = useRef<Sync>('unsynced');

  // Get storage items for the active pallet..
  const getStorageItems = async () => {
    if (fetchingStorageRef.current !== 'unsynced') {
      return;
    }
    fetchingStorageRef.current = 'syncing';
    const palletStorage = name
      ? scraper.getStorage(name, { labelsOnly: true })
      : [];
    fetchingStorageRef.current = 'synced';
    setStorageItems(palletStorage);
  };

  // Get pallet constants for the active pallet.
  const getConstants = async () => {
    if (fetchingConstantsRef.current !== 'unsynced') {
      return;
    }
    fetchingConstantsRef.current = 'syncing';
    const palletConstants = name ? scraper.getConstants(name) : [];
    fetchingConstantsRef.current = 'synced';
    setConstants(palletConstants);
  };

  return (
    <>
      <CanvasSubheading>
        <span>
          <FontAwesomeIcon
            icon={palletExpanded ? faChevronDown : faChevronRight}
            transform="shrink-6"
          />
        </span>
        <button onClick={() => setPalletExpanded(!palletExpanded)}>
          {name}
        </button>
      </CanvasSubheading>

      {/* Storage items. */}
      <motion.div {...getMotionProps(palletExpanded)}>
        <Subheading
          text="Storage Items"
          expanded={storageItemsExpanded}
          setExpanded={setStorageItemsExpanded}
          getter={getStorageItems}
        />
        <motion.div {...getMotionProps(storageItemsExpanded)}>
          {!storageItems ? (
            <EmptyItem text="Fetching..." />
          ) : storageItems.length === 0 ? (
            <EmptyItem text="This pallet has no storage items." />
          ) : (
            storageItems.map(({ name: storageName, docs: storageDocs }) => (
              <Fragment key={`storage_item_${storageName}`}>
                <RuntimeItemWrapper>
                  <h4>{storageName}</h4>
                  {storageDocs?.[0] && <h5>{storageDocs[0]}</h5>}
                </RuntimeItemWrapper>
              </Fragment>
            ))
          )}
        </motion.div>

        {/* Constants. */}
        <Subheading
          text="Constants"
          expanded={constantsExpanded}
          setExpanded={setConstantsExpanded}
          getter={getConstants}
        />
        <motion.div {...getMotionProps(constantsExpanded)}>
          {!constants ? (
            <EmptyItem text="Fetching..." />
          ) : constants.length === 0 ? (
            <EmptyItem text="This pallet has no runtime constants." />
          ) : (
            constants.map(({ name: constantName, docs: constantDocs }) => (
              <Fragment key={`constant_${constantName}`}>
                <RuntimeItemWrapper>
                  <h4>{constantName}</h4>
                  {constantDocs?.[0] && <h5>{constantDocs[0]}</h5>}
                </RuntimeItemWrapper>
              </Fragment>
            ))
          )}
        </motion.div>

        {/* Errors. */}
        <CanvasSubheading>
          <span>
            <FontAwesomeIcon icon={faChevronRight} transform="shrink-6" />
          </span>
          Errors
        </CanvasSubheading>

        {/* Events. */}
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
