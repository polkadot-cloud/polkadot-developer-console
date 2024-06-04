// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { HardwareAddress } from 'library/HardwareAddress';
import { ChainSearchInput } from './ChainSearchInput';
import { useState } from 'react';
import type { ManageHardwareProps } from './types';
import { motion } from 'framer-motion';
import type { DirectoryId } from 'config/networks/types';
import { ImportButtonWrapper, SubHeadingWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { QrReader } from './QrReader';
import { useVaultAccounts } from '@w3ux/react-connect-kit';
import type { VaultAccount } from '@w3ux/react-connect-kit/types';
import { remToUnit } from '@w3ux/utils';
import { NetworkDirectory } from 'config/networks';

export const ManageVault = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
  const {
    getVaultAccounts,
    vaultAccountExists,
    renameVaultAccount,
    removeVaultAccount,
  } = useVaultAccounts();

  // The directory id of the address list.
  const [directoryId, setDirectoryId] = useState<DirectoryId>('polkadot');

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Whether the import account button is active.
  const [importActive, setImportActive] = useState<boolean>(false);

  // Get the currently actve chain name.
  const activeChain = NetworkDirectory[directoryId as DirectoryId];

  const vaultAccounts = getVaultAccounts(directoryId);

  // Search input focus handler.
  const onSearchFocused = () => {
    setSearchActive(true);
  };

  // Search input blur handler.
  const onSearchBlurred = () => {
    setSearchActive(false);
  };

  // Whether to show address entries. Requires both searching and importing to be inactive.
  const showAddresses = !searchActive;

  // Handle renaming a vault address.
  const handleRename = (address: string, newName: string) => {
    renameVaultAccount(directoryId, address, newName);
  };

  // Handle removing a vault address.
  const handleRemove = (address: string) => {
    if (confirm('Are you sure you want to remove this account?')) {
      removeVaultAccount(directoryId, address);
    }
  };

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
          activeChain={activeChain}
        />
      </motion.div>

      <motion.div {...getMotionProps('address_config', !searchActive)}>
        <SubHeadingWrapper>
          <h5>
            {!importActive
              ? `${
                  vaultAccounts.length || 'No'
                } ${vaultAccounts.length === 1 ? 'Account' : 'Accounts'}`
              : 'New Account'}
          </h5>
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
        <QrReader
          directoryId={directoryId}
          importActive={importActive}
          activeChain={activeChain}
          onSuccess={() => {
            setImportActive(false);
          }}
        />
      </motion.div>

      <motion.div {...getMotionProps('address', showAddresses)}>
        {vaultAccounts.map(({ address, name }: VaultAccount, i) => (
          <HardwareAddress
            key={`vault_imported_${i}`}
            network={directoryId}
            address={address}
            index={i}
            initial={name}
            Identicon={
              <Polkicon address={address} size={remToUnit('2.1rem')} />
            }
            existsHandler={vaultAccountExists}
            renameHandler={handleRename}
            onRemove={handleRemove}
            onConfirm={() => {
              /* Do nothing. Not shown in UI. */
            }}
          />
        ))}
      </motion.div>
    </>
  );
};
