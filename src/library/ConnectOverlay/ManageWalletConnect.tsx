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
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useWcAccounts } from '@w3ux/react-connect-kit';
import type { WCAccount } from '@w3ux/react-connect-kit/types';
import { remToUnit } from '@w3ux/utils';
import { NetworkDirectory } from 'config/networks';
import { useWalletConnect } from 'contexts/WalletConnect';
import type { AnyJson } from '@w3ux/types';

export const ManageWalletConnect = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
  const { getWcAccounts, wcAccountExists, renameWcAccount, removeWcAccount } =
    useWcAccounts();
  const { wcMeta, wcModal } = useWalletConnect();

  // The directory id of the address list.
  const [directoryId, setDirectoryId] = useState<DirectoryId>('polkadot');

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

  // Handle removing an address.
  const handleRemove = (address: string) => {
    if (confirm('Are you sure you want to remove this account?')) {
      removeWcAccount(directoryId, address);
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
                  wcAccounts.length || 'No'
                } ${wcAccounts.length === 1 ? 'Account' : 'Accounts'}`
              : 'New Account'}
          </h5>
          <ImportButtonWrapper>
            <button
              onClick={async () => {
                setImportActive(!importActive);

                // if there is a URI from the client connect step open the modal
                if (wcMeta) {
                  // Summon Wallet Connect modal that presents QR Code.
                  wcModal?.openModal({ uri: wcMeta.uri });

                  // Get session from approval.
                  const walletConnectSession = await wcMeta?.approval();

                  // Get accounts from session.
                  const walletConnectAccounts = Object.values(
                    walletConnectSession.namespaces
                  )
                    .map((namespace: AnyJson) => namespace.accounts)
                    .flat();

                  // grab account addresses from CAIP account formatted accounts
                  const accounts = walletConnectAccounts.map((wcAccount) => {
                    const address = wcAccount.split(':')[2];
                    return address;
                  });

                  // TODO: Save accounts in console.
                  console.log(accounts);
                }
              }}
            >
              {!importActive && (
                <FontAwesomeIcon icon={faQrcode} transform="shrink-2" />
              )}
              {/* TODO: Only allow import if Wallet Connect has been initialised.
               */}
              {importActive ? 'Cancel Import' : 'Import Account'}
            </button>
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
            existsHandler={wcAccountExists}
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
