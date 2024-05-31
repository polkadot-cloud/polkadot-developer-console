// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerAccounts } from '@w3ux/react-connect-kit';
import type { LedgerAccount } from '@w3ux/react-connect-kit/types';
import { Polkicon } from '@w3ux/react-polkicon';
import { remToUnit } from '@w3ux/utils';
import { NetworkDirectory } from 'config/networks';
import type { DirectoryId } from 'config/networks/types';
import { HardwareAddress } from 'library/HardwareAddress';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChainSearchInput } from './ChainSearchInput';
import type { ManageHardwareProps } from './types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { ImportButtonWrapper, SubHeadingWrapper } from './Wrappers';
import { faUsbDrive } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LedgerApps } from 'contexts/LedgerHardware/defaults';

export const ManageLedger = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
  const {
    removeLedgerAccount,
    renameLedgerAccount,
    ledgerAccountExists,
    getLedgerAccounts,
  } = useLedgerAccounts();

  // The directory id of the address list.
  const [directoryId, setDirectoryId] = useState<DirectoryId>('polkadot');

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Whether the import account button is active.
  const [importActive, setImportActive] = useState<boolean>(false);

  // Get the currently actve chain name.
  const activeChain = NetworkDirectory[directoryId as DirectoryId];

  // Get the currently imported ledger accounts.
  const ledgerAccounts = getLedgerAccounts(directoryId);

  // Get the supported chains for ledger import.
  const supportedChains = LedgerApps.map((a) => a.network);

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

  // Handle renaming a ledger address.
  const handleRename = (address: string, newName: string) => {
    renameLedgerAccount(directoryId, address, newName);
  };

  // Handle removing a ledger address.
  const handleRemove = (address: string) => {
    if (confirm('Are you sure you want to remove this account?')) {
      removeLedgerAccount(directoryId, address);
    }
  };

  // Resets UI when the selected connect item changes from `ledger`, Cancelling import and
  // search if active.
  useEffectIgnoreInitial(() => {
    if (selectedConnectItem !== 'ledger') {
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
          supportedChains={supportedChains}
        />
      </motion.div>

      <motion.div {...getMotionProps('address_config', !searchActive)}>
        <SubHeadingWrapper>
          <h5>
            {!importActive
              ? `${
                  ledgerAccounts.length || 'No'
                } ${ledgerAccounts.length === 1 ? 'Account' : 'Accounts'}`
              : 'New Account'}
          </h5>
          <ImportButtonWrapper>
            <button onClick={() => setImportActive(!importActive)}>
              {!importActive && (
                <FontAwesomeIcon
                  icon={faUsbDrive}
                  style={{ marginRight: '0.4rem' }}
                />
              )}
              {importActive ? 'Cancel Import' : 'Import Next Account'}
            </button>
          </ImportButtonWrapper>
        </SubHeadingWrapper>
      </motion.div>

      <motion.div {...getMotionProps('address', showAddresses)}>
        {ledgerAccounts.map(({ address }: LedgerAccount, i) => (
          <HardwareAddress
            key={`ledger_imported_${i}`}
            network="polkadot"
            address={address}
            index={0}
            initial={'Ross Bulat'}
            Identicon={
              <Polkicon address={address} size={remToUnit('2.1rem')} />
            }
            existsHandler={ledgerAccountExists}
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
