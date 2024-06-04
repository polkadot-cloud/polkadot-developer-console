// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerAccounts } from '@w3ux/react-connect-kit';
import type {
  LedgerAccount,
  LedgerAddress,
} from '@w3ux/react-connect-kit/types';
import { Polkicon } from '@w3ux/react-polkicon';
import { ellipsisFn, remToUnit, setStateWithRef } from '@w3ux/utils';
import { NetworkDirectory } from 'config/networks';
import type { DirectoryId } from 'config/networks/types';
import { HardwareAddress } from 'library/HardwareAddress';
import { useEffect, useRef, useState } from 'react';
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
import type { AnyJson } from '@w3ux/utils/types';

export const ManageLedger = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
  const {
    addLedgerAccount,
    removeLedgerAccount,
    renameLedgerAccount,
    ledgerAccountExists,
    getLedgerAccounts,
  } = useLedgerAccounts();
  const {
    getFeedback,
    setStatusCode,
    handleUnmount,
    getIsExecuting,
    resetStatusCode,
    handleGetAddress,
    transportResponse,
    handleResetLedgerTask,
  } = useLedgerHardware();

  // The directory id of the address list.
  const [directoryId, setDirectoryId] = useState<DirectoryId>('polkadot');

  // Store addresses retreived from Ledger device. Defaults to local addresses.
  const [addresses, setAddresses] = useState<LedgerAccount[]>(
    getLedgerAccounts(directoryId)
  );
  const addressesRef = useRef(addresses);

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const { appName } = getLedgerApp(directoryId);

  // Get the currently actve chain name.
  const activeChain = NetworkDirectory[directoryId as DirectoryId];

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
      // Remove local ledger accounts.
      let newLedgerAddresses = getLocalLedgerAddresses();

      newLedgerAddresses = newLedgerAddresses.filter((a) => {
        if (a.address !== address) {
          return true;
        }
        if (a.network !== directoryId) {
          return true;
        }
        return false;
      });
      if (!newLedgerAddresses.length) {
        localStorage.removeItem('ledger_addresses');
      } else {
        localStorage.setItem(
          'ledger_addresses',
          JSON.stringify(newLedgerAddresses)
        );
      }

      // Remove ledger account from state.
      removeLedgerAccount(directoryId, address);

      // Add ledger account to local state.
      setStateWithRef(
        [...addressesRef.current.filter((a) => a.address !== address)],
        setAddresses,
        addressesRef
      );
    }
  };

  // Gets the next non-imported ledger address index.
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) {
      return 0;
    }
    return addressesRef.current[addressesRef.current.length - 1].index + 1;
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

      // Add ledger account to local state.
      setStateWithRef(
        [...addressesRef.current, ...newAddress],
        setAddresses,
        addressesRef
      );

      // Update the full list of local ledger addresses with new entry. NOTE: This can be deprecated
      // once w3ux package is updated to directly import without using local `ledger_addresses`.
      const newAddresses = getLocalLedgerAddresses()
        .filter((a: AnyJson) => {
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

      // Add new Ledger account to imported accounts.
      addLedgerAccount(
        directoryId,
        newAddress[0].address,
        options.accountIndex
      );

      // Reset device status code.
      resetStatusCode();
    }
  };

  // Resets ledger accounts.
  const resetLedgerAccounts = () => {
    // Remove imported Ledger accounts.
    addressesRef.current.forEach((account) => {
      removeLedgerAccount(directoryId, account.address);
    });

    setStateWithRef([], setAddresses, addressesRef);
  };

  // Get last saved ledger feedback.
  const feedback = getFeedback();

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
          activeChain={activeChain}
          directoryId={directoryId}
          setDirectoryId={setDirectoryId}
          onSearchFocused={onSearchFocused}
          onSearchBlurred={onSearchBlurred}
          supportedChains={supportedChains}
        />
      </motion.div>

      <motion.div {...getMotionProps('address_config', !searchActive)}>
        <SubHeadingWrapper className="noBorder">
          <ImportButtonWrapper>
            {addressesRef.current.length > 0 && (
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
                if (!isExecuting) {
                  await onGetAddress();
                } else {
                  handleResetLedgerTask();
                }
              }}
            >
              <FontAwesomeIcon
                icon={faUsbDrive}
                style={{ marginRight: '0.4rem' }}
              />

              {isExecuting ? 'Cancel Import' : 'Import Next Account'}
            </button>
          </ImportButtonWrapper>
        </SubHeadingWrapper>
        <SubHeadingWrapper>
          <h5>
            {feedback?.message ||
              `${addressesRef.current.length || 'No'} ${addressesRef.current.length === 1 ? 'Account' : 'Accounts'}`}
          </h5>
        </SubHeadingWrapper>
      </motion.div>

      <motion.div {...getMotionProps('address', showAddresses)}>
        {addressesRef.current.map(({ name, address }: LedgerAccount, i) => (
          <HardwareAddress
            key={`ledger_imported_${i}`}
            network="polkadot"
            address={address}
            index={0}
            initial={name}
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
