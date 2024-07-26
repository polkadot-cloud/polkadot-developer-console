// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { NetworkDirectory } from 'config/networks';
import { Select } from 'library/Inputs/Select';
import { ButtonText } from 'library/Buttons/ButtonText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftToBracket } from '@fortawesome/pro-duotone-svg-icons';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { faCheckCircle } from '@fortawesome/sharp-regular-svg-icons';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { SetupNote } from '../Wrappers';
import { useDisconnectTab } from 'contexts/DisconnectTab';

export const ConnectRelay = () => {
  const { tabId, ownerId } = useActiveTab();
  const { getApiStatus } = useChainSpaceEnv();
  const { disconnectTab } = useDisconnectTab();
  const { getSelectedRelayChain } = useParaSetup();
  const { chainSpec, instanceId } = useParachain();

  const relayChain = getSelectedRelayChain(tabId);
  const apiStatus = getApiStatus(instanceId);

  // Get relay chains from the network directory.
  const relayChains = Object.entries(NetworkDirectory).filter(
    ([, chain]) => chain?.isRelayChain
  );

  // Get chain icons dervied from relay chain keys.
  const icon = relayChains
    .map(([chainId]) => chainId)
    .filter((chainId) => chainId === relayChain)[0];

  // Get the chain name of the currently select relay chain.
  const relayName =
    relayChains.find(([chainId]) => chainId === relayChain)?.[1]?.name ||
    'Polkadot Relay Chain';

  // API can be assumed as valid when it is ready and the chain spec has been fetched.
  const apiValid = ['ready'].includes(apiStatus) && chainSpec !== undefined;

  return (
    <FormWrapper>
      <h3>Selected Relay Chain:</h3>

      <section>
        <Select
          values={[relayName]}
          icons={[icon]}
          value={relayName}
          onChange={() => {
            /* Do nothing: permanently disabled. */
          }}
          disabled={true}
        />
      </section>
      <section>
        {!apiValid ? (
          <SetupNote>Connecting to {relayName}...</SetupNote>
        ) : (
          <SetupNote>
            <FontAwesomeIcon
              icon={faCheckCircle}
              transform="grow-1"
              className="icon"
            />
            Connected to {relayName}. Ready to reserve a Para ID.
          </SetupNote>
        )}

        <ButtonText
          className="lg"
          onClick={() => {
            if (apiStatus !== 'ready') {
              disconnectTab(ownerId);
            } else {
              if (
                confirm(
                  'Are you sure you want to disconnect? This will reset your setup progress.'
                )
              ) {
                disconnectTab(ownerId);
              }
            }
          }}
        >
          <>
            <FontAwesomeIcon icon={faArrowLeftToBracket} className="iconLeft" />
            {apiValid ? 'Disconnect & Cancel Setup' : 'Cancel Connect'}
          </>
        </ButtonText>
      </section>
    </FormWrapper>
  );
};
