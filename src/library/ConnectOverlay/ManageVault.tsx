// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { remToUnit } from '@w3ux/utils';
import { HardwareAddress } from 'library/HardwareAddress';
import { ChainSearchInput } from './ChainSearchInput';
import { useState } from 'react';
import type { ManageHardwareProps } from './types';
import { motion } from 'framer-motion';
import type { DirectoryId } from 'config/networks';
import { ImportButtonWrapper, SubHeadingWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

export const ManageVault = ({ getMotionProps }: ManageHardwareProps) => {
  const address = '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF';

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // The directory id of the address list.
  const [directoryId, setDirectoryId] = useState<DirectoryId>('polkadot');

  // Search input focus handler.
  const onSearchFocused = () => {
    setSearchActive(true);
  };

  // Search input blur handler.
  const onSearchBlurred = () => {
    setSearchActive(false);
  };

  return (
    <>
      <ChainSearchInput
        onSearchFocused={onSearchFocused}
        onSearchBlurred={onSearchBlurred}
        directoryId={directoryId}
        setDirectoryId={setDirectoryId}
      />

      <motion.div {...getMotionProps('address', !searchActive)}>
        <SubHeadingWrapper>
          <h5>2 Accounts</h5>
          <ImportButtonWrapper>
            <button
              onClick={() => {
                /* Do nothing */
              }}
            >
              <FontAwesomeIcon icon={faQrcode} transform="shrink-2" /> Import
              Account
            </button>
          </ImportButtonWrapper>
        </SubHeadingWrapper>
        <HardwareAddress
          address={address}
          index={0}
          initial={'Ross Bulat'}
          Identicon={<Polkicon address={address} size={remToUnit('2.1rem')} />}
          existsHandler={(addr) => {
            console.log(addr);
            /* Do nothing */
            return false;
          }}
          renameHandler={(addr, newName) => {
            console.log(addr, newName);
            /* Do nothing */
          }}
          openRemoveHandler={(addr) => {
            console.log(addr);
            /* Do nothing */
          }}
          openConfirmHandler={(addr, index) => {
            console.log(addr, index);
            /* Do nothing */
          }}
        />
      </motion.div>

      <motion.div {...getMotionProps('address', !searchActive)}>
        <HardwareAddress
          address={address}
          index={1}
          initial={'Ross Bulat'}
          Identicon={<Polkicon address={address} size={remToUnit('2.1rem')} />}
          existsHandler={(addr) => {
            console.log(addr);
            /* Do nothing */
            return false;
          }}
          renameHandler={(addr, newName) => {
            console.log(addr, newName);
            /* Do nothing */
          }}
          openRemoveHandler={(addr) => {
            console.log(addr);
            /* Do nothing */
          }}
          openConfirmHandler={(addr, index) => {
            console.log(addr, index);
            /* Do nothing */
          }}
          last
        />
      </motion.div>
    </>
  );
};
