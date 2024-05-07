// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, DirectoryId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { Select } from 'library/Inputs/Select';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/pro-duotone-svg-icons';
import { ACTIVE_API_STATUSES } from 'contexts/Api/defaults';
import { ApiController } from 'controllers/Api';
import { ConnectContextMenu } from 'library/ConnectContextMenu';
import { useMenu } from 'contexts/Menu';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';

export const ConnectRelay = () => {
  const {
    relayChain,
    setRelayChain,
    relayApiStatus,
    handleConnectApi,
    relayInstanceIndex,
  } = useChainSpaceEnv();
  const { openMenu } = useMenu();

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
    relayChains.find(([chainId]) => chainId === relayChain)?.[1]?.name ||
    'Polkadot Relay Chain';

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
              setRelayChain(chainId);
            }
          }}
          disabled={ACTIVE_API_STATUSES.includes(relayApiStatus)}
        />
      </section>
      <section>
        {relayApiStatus === 'disconnected' ? (
          <ButtonSubmit
            className="lg"
            onClick={(ev) => {
              openMenu(
                ev,
                <ConnectContextMenu
                  chainId={relayChain as DirectoryId}
                  onSelect={handleConnectApi}
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
            disabled={relayApiStatus !== 'ready'}
            onClick={() => {
              // Disconnect from API.
              if (relayInstanceIndex !== undefined) {
                ApiController.destroy('global', relayInstanceIndex);
              }
            }}
          >
            {relayApiStatus === 'ready' ? <>Disconnect</> : 'Connecting...'}
          </ButtonSubmit>
        )}
      </section>
    </FormWrapper>
  );
};
