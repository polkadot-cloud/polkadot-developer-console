// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { Select } from 'library/Inputs/Select';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/pro-duotone-svg-icons';
import { ACTIVE_API_STATUSES } from 'contexts/Api/defaults';
import { ConnectContextMenu } from 'library/ConnectContextMenu';
import { useMenu } from 'contexts/Menu';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useParaSetup } from 'contexts/ParaSetup';

export const ConnectRelay = () => {
  const { openMenu } = useMenu();
  const { getApiStatusByIndex, destroyChainApi, handleConnectApi } =
    useChainSpaceEnv();
  const { selectedRelayChain, setSelectedRelayChain } = useParaSetup();

  // API status
  const apiStatus = getApiStatusByIndex(0);

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

  return (
    <FormWrapper>
      <h3>Connect to the Relay Chain you wish to secure blocks with.</h3>

      <section>
        <Select
          label={'Relay Chain'}
          values={values}
          icons={icons}
          value={relayName}
          onChange={(val) => {
            const chainId = relayChains.find(
              ([, chain]) => chain.name === val
            )?.[0] as ChainId;
            if (chainId !== undefined) {
              setSelectedRelayChain(chainId);
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
                  onSelect={(provider) =>
                    handleConnectApi(0, selectedRelayChain, provider)
                  }
                />
              );
            }}
          >
            Connect
            <FontAwesomeIcon icon={faCaretRight} transform="grow-1" />
          </ButtonSubmit>
        ) : (
          <ButtonSubmit
            className="lg"
            disabled={apiStatus !== 'ready'}
            onClick={() => {
              // Disconnect from API.
              destroyChainApi(0);
            }}
          >
            {apiStatus === 'ready' ? <>Disconnect</> : 'Connecting...'}
          </ButtonSubmit>
        )}
      </section>
    </FormWrapper>
  );
};
