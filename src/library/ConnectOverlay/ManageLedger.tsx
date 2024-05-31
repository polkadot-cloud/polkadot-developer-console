// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerAccounts } from '@w3ux/react-connect-kit';
import type {
  LedgerAccount,
  LedgerAddress,
} from '@w3ux/react-connect-kit/types';
import { Polkicon } from '@w3ux/react-polkicon';
import { ellipsisFn, remToUnit } from '@w3ux/utils';
import { NetworkDirectory } from 'config/networks';
import type { DirectoryId } from 'config/networks/types';
import { HardwareAddress } from 'library/HardwareAddress';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChainSearchInput } from './ChainSearchInput';
import type { ManageHardwareProps } from './types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { ImportButtonWrapper, SubHeadingWrapper } from './Wrappers';
import { faUsbDrive } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LedgerApps } from 'contexts/LedgerHardware/defaults';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import type { LedgerResponse } from 'contexts/LedgerHardware/types';
import {
  getLedgerApp,
  getLocalLedgerAddresses,
} from 'contexts/LedgerHardware/Utils';
import { faSquareMinus } from '@fortawesome/pro-solid-svg-icons';

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
  const {
    transportResponse,
    resetStatusCode,
    setStatusCode,
    handleUnmount,
    handleGetAddress,
    getIsExecuting,
  } = useLedgerHardware();

  // The directory id of the address list.
  const [directoryId, setDirectoryId] = useState<DirectoryId>('polkadot');

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const { appName } = getLedgerApp(directoryId);

  // Get the currently actve chain name.
  const activeChain = NetworkDirectory[directoryId as DirectoryId];

  // Get the currently imported ledger accounts.
  const ledgerAccounts = getLedgerAccounts(directoryId);

  // Get the supported chains for ledger import.
  const supportedChains = LedgerApps.map((a) => a.network);

  // Get whether the ledger device is currently executing a task.
  const isExecuting = getIsExecuting();

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

  // Gets the next non-imported ledger address index.
  const getNextAddressIndex = () => {
    if (!ledgerAccounts.length) {
      return 0;
    }
    return ledgerAccounts[ledgerAccounts.length - 1].index + 1;
  };

  // Ledger address getter.
  const onGetAddress = async () => {
    await handleGetAddress(appName, getNextAddressIndex());
  };

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) {
      return;
    }

    const { ack, statusCode, body, options } = response;
    setStatusCode(ack, statusCode);

    if (statusCode === 'ReceivedAddress') {
      const newAddress = body.map(({ pubKey, address }: LedgerAddress) => ({
        index: options.accountIndex,
        pubKey,
        address,
        name: ellipsisFn(address),
        network: directoryId,
      }));

      // update the full list of local ledger addresses with new entry.
      const newAddresses = getLocalLedgerAddresses()
        .filter((a) => {
          if (a.address !== newAddress[0].address) {
            return true;
          }
          if (a.network !== directoryId) {
            return true;
          }
          return false;
        })
        .concat(newAddress);
      localStorage.setItem('ledger_addresses', JSON.stringify(newAddresses));
      resetStatusCode();
    }
  };

  // Resets ledger accounts.
  const resetLedgerAccounts = () => {
    // Remove imported Ledger accounts.
    ledgerAccounts.forEach((account) => {
      removeLedgerAccount(directoryId, account.address);
    });
  };

  // Listen for new Ledger status reports.
  useEffectIgnoreInitial(() => {
    handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  // Resets UI when the selected connect item changes from `ledger`, Cancelling import and
  // search if active.
  useEffectIgnoreInitial(() => {
    if (selectedConnectItem !== 'ledger') {
      setSearchActive(false);
    }
  }, [selectedConnectItem]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(
    () => () => {
      handleUnmount();
    },
    []
  );

  return (
    <>
      <motion.div {...getMotionProps('address_config', true)}>
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
            {ledgerAccounts.length || 'No'}
            {ledgerAccounts.length === 1 ? 'Account' : 'Accounts'}
          </h5>
          <ImportButtonWrapper>
            {ledgerAccounts.length > 0 && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      'Are you sure you want to remove all ledger accounts?'
                    )
                  ) {
                    resetLedgerAccounts();
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faSquareMinus}
                  style={{ marginRight: '0.4rem' }}
                />
                Reset
              </button>
            )}
            <button
              onClick={async () => {
                await onGetAddress();
              }}
              disabled={isExecuting}
            >
              <FontAwesomeIcon
                icon={faUsbDrive}
                style={{ marginRight: '0.4rem' }}
              />

              {isExecuting ? 'Cancel Import' : 'Import Next Account'}
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
