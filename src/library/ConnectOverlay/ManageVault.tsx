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
import {
  ImportButtonWrapper,
  ImportQRWrapper,
  SubHeadingWrapper,
} from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useEffectIgnoreInitial } from '@w3ux/hooks';

export const ManageVault = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
  const address = '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF';

  // The directory id of the address list.
  const [directoryId, setDirectoryId] = useState<DirectoryId>('polkadot');

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Whether the import account button is active.
  const [importActive, setImportActive] = useState<boolean>(false);

  // Search input focus handler.
  const onSearchFocused = () => {
    setSearchActive(true);
  };

  // Search input blur handler.
  const onSearchBlurred = () => {
    setSearchActive(false);
  };

  // Whether to show address entries. Requires both searching and importing to be inactive.
  const showAddresses = !searchActive && !importActive;

  // Resets UI when the selected connect item changes from `polakdot_vault`, Cancelling import and
  // search if active.
  useEffectIgnoreInitial(() => {
    if (selectedConnectItem !== 'polkadot_vault') {
      setSearchActive(false);
      setImportActive(false);
    }
  }, [selectedConnectItem]);

  return (
    <>
      <motion.div {...getMotionProps('address_config', !importActive)}>
        <ChainSearchInput
          onSearchFocused={onSearchFocused}
          onSearchBlurred={onSearchBlurred}
          directoryId={directoryId}
          setDirectoryId={setDirectoryId}
        />
      </motion.div>

      <motion.div {...getMotionProps('address_config', !searchActive)}>
        <SubHeadingWrapper>
          <h5>{!importActive ? '2 Accounts' : 'New Account'}</h5>
          <ImportButtonWrapper>
            <button
              onClick={() => {
                setImportActive(!importActive);
              }}
            >
              {!importActive && (
                <FontAwesomeIcon icon={faQrcode} transform="shrink-2" />
              )}
              {importActive ? 'Cancel Import' : 'Import Account'}
            </button>
          </ImportButtonWrapper>
        </SubHeadingWrapper>
      </motion.div>

      <motion.div {...getMotionProps('import_container', importActive)}>
        <ImportQRWrapper>
          <h4>Import QR Code box</h4>
        </ImportQRWrapper>
      </motion.div>

      <motion.div {...getMotionProps('address', showAddresses)}>
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

      <motion.div {...getMotionProps('address', showAddresses)}>
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
