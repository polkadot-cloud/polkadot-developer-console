// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper } from '../Wrappers';
import { NetworkDirectory } from 'config/networks';
import { Select } from 'library/Inputs/Select';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/pro-duotone-svg-icons';
import type { FormProps } from './types';
import { ACTIVE_API_STATUSES } from 'contexts/Api/defaults';
import { ApiController } from 'controllers/Api';

export const Form = ({
  relayChain,
  relayInstanceIndex,
  setRelayChain,
  relayApiStatus,
  handleConnectApi,
}: FormProps) => {
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

  return (
    <FormWrapper>
      <h3>
        Reserve a Para ID on the Relay Chain you wish to secure blocks with.
      </h3>

      <section>
        <Select
          label={'Choose Relay Chain'}
          values={values}
          icons={icons}
          value={relayChain}
          onChange={(val) => {
            setRelayChain(val);
          }}
        />
      </section>
      <section>
        {!ACTIVE_API_STATUSES.includes(relayApiStatus) ? (
          <ButtonSubmit
            className="lg"
            onClick={() => {
              /* TODO: Implement rpc provider before connect. */
              handleConnectApi();
            }}
          >
            Connect
            <FontAwesomeIcon icon={faCaretRight} transform="grow-1" />
          </ButtonSubmit>
        ) : (
          <ButtonSubmit
            className="lg"
            onClick={() => {
              // Disconnect from API.
              if (relayInstanceIndex !== undefined) {
                ApiController.destroy('global', relayInstanceIndex);
              }
            }}
          >
            Disconnect
            <FontAwesomeIcon icon={faCaretRight} transform="grow-1" />
          </ButtonSubmit>
        )}
      </section>
    </FormWrapper>
  );
};
