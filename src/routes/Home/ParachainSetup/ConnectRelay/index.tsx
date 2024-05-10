// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { Select } from 'library/Inputs/Select';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeftToBracket,
  faCaretRight,
} from '@fortawesome/pro-duotone-svg-icons';
import { ACTIVE_API_STATUSES } from 'contexts/Api/defaults';
import { ConnectContextMenu } from 'library/ConnectContextMenu';
import { useMenu } from 'contexts/Menu';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { faCheckCircle } from '@fortawesome/sharp-regular-svg-icons';

export const ConnectRelay = () => {
  const {
    getApiStatusByIndex,
    getChainSpecByIndex,
    destroyChainApi,
    handleConnectApi,
    getNextApiIndex,
  } = useChainSpaceEnv();
  const {
    getSelectedRelayChain,
    setSelectedRelayChain,
    getChainSpaceApiIndex,
    setChainSpaceApiIndex,
    removeChainSpaceApiIndex,
  } = useParaSetup();
  const { tabId } = useActiveTab();
  const { openMenu, closeMenu } = useMenu();

  const selectedRelayChain = getSelectedRelayChain(tabId);

  // Chain space api data.
  const chainSpaceApiIndex = getChainSpaceApiIndex(tabId);
  const apiStatus = getApiStatusByIndex(chainSpaceApiIndex);
  const chainSpec = getChainSpecByIndex(chainSpaceApiIndex);

  // Get relay chains from the network directory.
  const relayChains = Object.entries(NetworkDirectory).filter(
    ([, chain]) => chain.isRelayChain
  );

  // Get the chain names from the relay chains for select input.
  const values = relayChains.map(([, chain]) => chain.name);

  // Get chain icons dervied from relay chain keys.
  const icons = relayChains.map(
    ([chainId]) => `../../../config/networks/icons/${chainId}/Inline.tsx`
  );

  // Get the chain name of the currently select relay chain.
  const relayName =
    relayChains.find(([chainId]) => chainId === selectedRelayChain)?.[1]
      ?.name || 'Polkadot Relay Chain';

  // API can be assumed as valid when it is ready and the chain spec has been fetched.
  const apiValid = ['ready'].includes(apiStatus) && chainSpec !== undefined;

  // Handle disconnect from api instance.
  const handleDisconnect = () => {
    if (chainSpaceApiIndex !== undefined) {
      destroyChainApi(chainSpaceApiIndex);
      removeChainSpaceApiIndex(tabId);
    }
  };

  return (
    <FormWrapper>
      <h3>Connect to the Relay Chain you wish to secure blocks with.</h3>

      <section>
        <Select
          values={values}
          icons={icons}
          value={relayName}
          onChange={(val) => {
            const chainId = relayChains.find(
              ([, chain]) => chain.name === val
            )?.[0] as ChainId;
            if (chainId !== undefined) {
              setSelectedRelayChain(tabId, chainId);
            }
          }}
          disabled={ACTIVE_API_STATUSES.includes(apiStatus)}
        />
      </section>
      <section>
        {apiStatus === 'disconnected' ? (
          <ButtonSubmit
            className="lg"
            onClick={(ev) => {
              openMenu(
                ev,
                <ConnectContextMenu
                  chainId={selectedRelayChain}
                  onSelect={async (provider) => {
                    closeMenu();

                    const index = getNextApiIndex();
                    setChainSpaceApiIndex(tabId, index);

                    await handleConnectApi(
                      tabId,
                      index,
                      selectedRelayChain,
                      provider
                    );
                  }}
                />
              );
            }}
          >
            Connect
            <FontAwesomeIcon
              icon={faCaretRight}
              transform="grow-1"
              className="iconRight"
            />
          </ButtonSubmit>
        ) : (
          <>
            {!apiValid ? (
              <h4 className="note">Connecting to {relayName}...</h4>
            ) : (
              <h4 className="note">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  transform="grow-1"
                  className="icon"
                />
                Connected to {relayName}. Ready to reserve a Para ID.
              </h4>
            )}

            <ButtonSubmit
              className="lg"
              onClick={() => {
                if (apiStatus !== 'ready') {
                  handleDisconnect();
                } else {
                  if (
                    confirm(
                      'Are you sure you want to disconnect? This will reset your setup progress.'
                    )
                  ) {
                    handleDisconnect();
                  }
                }
              }}
            >
              <>
                <FontAwesomeIcon
                  icon={faArrowLeftToBracket}
                  className="iconLeft"
                />
                {apiValid ? 'Disconnect & Cancel Setup' : 'Cancel Connect'}
              </>
            </ButtonSubmit>
          </>
        )}
      </section>
    </FormWrapper>
  );
};
