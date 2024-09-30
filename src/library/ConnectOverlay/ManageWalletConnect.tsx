// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Polkicon } from '@w3ux/react-polkicon';
import { HardwareAddress } from 'library/HardwareAddress';
import { ChainSearchInput } from './ChainSearchInput';
import { useState } from 'react';
import type { ManageHardwareProps } from './types';
import { motion } from 'framer-motion';
import type { DirectoryId } from 'config/networks/types';
import { ImportButtonWrapper, SubHeadingWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useWcAccounts } from '@w3ux/react-connect-kit';
import type { WCAccount } from '@w3ux/react-connect-kit/types';
import { remToUnit } from '@w3ux/utils';
import { NetworkDirectory } from 'config/networks';
import { useWalletConnect } from 'contexts/WalletConnect';
import type { AnyJson } from '@w3ux/types';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { faLink } from '@fortawesome/pro-duotone-svg-icons';

export const ManageWalletConnect = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
  const {
    addWcAccount,
    getWcAccounts,
    wcAccountExists,
    renameWcAccount,
    removeWcAccount,
  } = useWcAccounts();
  const {
    wcProvider,
    wcInitialised,
    wcSessionActive,
    disconnectSession,
    initialiseNewSession,
  } = useWalletConnect();
  const { getConnectedChains } = useChainSpaceEnv();

  // Connected chains determines which Wallet Connect accounts can be imported. Wallet Connect will
  // automatically re-initialise if chains are changed & this UI will update accordingly.
  const connectedChains = getConnectedChains();

  // The directory id of the address list. If no chains are connected, just default to Polkadot.
  const [directoryId, setDirectoryId] = useState<DirectoryId>(
    (connectedChains?.[0]?.specName as DirectoryId) || 'polkadot'
  );

  // Whether the search input is active. When active, addresses are hidden and search results are
  // shown instead.
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Whether the import account button is active.
  const [importActive, setImportActive] = useState<boolean>(false);

  // Get the currently actve chain name.
  const activeChain = NetworkDirectory[directoryId as DirectoryId];

  const wcAccounts = getWcAccounts(directoryId);

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

  // Handle renaming an address.
  const handleRename = (address: string, newName: string) => {
    renameWcAccount(directoryId, address, newName);
  };

  // Handle importing of address.
  const handleImportAddresses = async () => {
    if (!wcInitialised) {
      return;
    }

    setImportActive(!importActive);

    // If there is a URI from the client connect step open the modal
    if (wcProvider) {
      // Retrieve a new session or get current one.
      const wcSession = await initialiseNewSession();
      if (wcSession === null) {
        return;
      }

      // Get accounts from session.
      const walletConnectAccounts = Object.values(wcSession.namespaces)
        .map((namespace: AnyJson) => namespace.accounts)
        .flat();

      // Get the caip of the active chain.
      const caip = connectedChains
        .find((chain) => chain.specName === directoryId)
        ?.genesisHash.substring(2)
        .substring(0, 32);

      // Only get accounts for the currently selected `caip`.
      let filteredAccounts = walletConnectAccounts.filter((wcAccount) => {
        const prefix = wcAccount.split(':')[1];
        return prefix === caip;
      });

      // grab account addresses from CAIP account formatted accounts
      filteredAccounts = walletConnectAccounts.map((wcAccount) => {
        const address = wcAccount.split(':')[2];
        return address;
      });

      // Save accounts to local storage.
      filteredAccounts.forEach((address) => {
        addWcAccount(directoryId, address, wcAccounts.length);
      });
    }
  };

  // Resets UI when the selected connect item changes from `wallet_connect`, Cancelling import and
  // search if active.
  useEffectIgnoreInitial(() => {
    if (selectedConnectItem !== 'wallet_connect') {
      setSearchActive(false);
      setImportActive(false);
    }
  }, [selectedConnectItem]);

  // Disconnect from Wallet Connect and remove imported accounts.
  const disconnectWc = async () => {
    if (confirm('Are you sure you want to disconnect from Wallet Connect?')) {
      // Remove imported Wallet Connect accounts.
      wcAccounts.forEach((account) => {
        removeWcAccount(directoryId, account.address);
      });

      // Disconnect from Wallet Connect session.
      await disconnectSession();
    }
  };

  return (
    <>
      <motion.div {...getMotionProps('address_config', !importActive)}>
        <ChainSearchInput
          onSearchFocused={onSearchFocused}
          onSearchBlurred={onSearchBlurred}
          directoryId={directoryId}
          setDirectoryId={setDirectoryId}
          activeChain={activeChain}
          supportedChains={connectedChains.map(
            (chain) => chain.specName as DirectoryId
          )}
        />
      </motion.div>

      <motion.div {...getMotionProps('address_config', !searchActive)}>
        <SubHeadingWrapper>
          <h5>
            {!wcSessionActive
              ? 'Wallet Connect is Disconnected'
              : !importActive
                ? `${
                    wcAccounts.length || 'No'
                  } ${wcAccounts.length === 1 ? 'Account' : 'Accounts'}`
                : 'New Account'}
          </h5>

          <ImportButtonWrapper>
            {!wcSessionActive ? (
              <button onClick={() => initialiseNewSession()}>
                <FontAwesomeIcon
                  icon={faLink}
                  style={{ marginRight: '0.4rem' }}
                />
                Connect
              </button>
            ) : wcAccounts.length > 0 ? (
              <button onClick={() => disconnectWc()}>
                <FontAwesomeIcon
                  icon={faSquareMinus}
                  style={{ marginRight: '0.4rem' }}
                />
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => {
                  handleImportAddresses();
                }}
              >
                {!importActive && (
                  <FontAwesomeIcon icon={faQrcode} transform="shrink-2" />
                )}
                {!wcInitialised
                  ? 'Initialising'
                  : importActive
                    ? 'Cancel Import'
                    : 'Import Account'}
              </button>
            )}
          </ImportButtonWrapper>
        </SubHeadingWrapper>
      </motion.div>

      <motion.div {...getMotionProps('address', showAddresses)}>
        {wcAccounts.map(({ address, name }: WCAccount, i) => (
          <HardwareAddress
            key={`wc_imported_${i}`}
            network={directoryId}
            address={address}
            index={i}
            initial={name}
            Identicon={
              <Polkicon address={address} size={remToUnit('2.1rem')} />
            }
            allowAction={false}
            existsHandler={wcAccountExists}
            renameHandler={handleRename}
            onRemove={() => {
              // Do nothing.
            }}
            onConfirm={() => {
              /* Do nothing. Not shown in UI. */
            }}
          />
        ))}
      </motion.div>
    </>
  );
};
