// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Select } from 'library/Inputs/Select';
import { FormWrapper } from './Wrappers';
import { useState } from 'react';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/pro-duotone-svg-icons';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { NetworkDirectory } from 'config/networks';

export const ReserveParaId = () => {
  const { tabId } = useActiveTab();
  const { registerRelayApi } = useParaSetup();

  // The currently selected relay chain to register a ParaID on.
  const [relayChain, setRelayChain] = useState<string>('Polkadot Relay Chain');

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
          label={'Choose Relay chain'}
          values={values}
          icons={icons}
          value={relayChain}
          onChange={(val) => {
            setRelayChain(val);
          }}
        />
      </section>
      <section>
        <ButtonSubmit
          className="lg"
          onClick={() => {
            /* TODO: Implement rpc provider before connect. */
            registerRelayApi(tabId);
          }}
        >
          Connect
          <FontAwesomeIcon icon={faCaretRight} transform="grow-1" />
        </ButtonSubmit>
      </section>
    </FormWrapper>
  );
};
