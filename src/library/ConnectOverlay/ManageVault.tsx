// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { remToUnit } from '@w3ux/utils';
import { HardwareAddress } from 'library/HardwareAddress';
import { ChainSearchInput } from './ChainSearchInput';
import { useState } from 'react';
import type { ManageHardwareProps } from './types';
import { motion } from 'framer-motion';

export const ManageVault = ({ getMotionProps }: ManageHardwareProps) => {
  const address = '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF';

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

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
        defaultDirectoryId={'polkadot'}
      />

      <motion.div {...getMotionProps('address', !searchActive)}>
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
        />
      </motion.div>
    </>
  );
};
