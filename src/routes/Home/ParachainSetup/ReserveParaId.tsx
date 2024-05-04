// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Select } from 'library/Inputs/Select';
import { FormWrapper } from './Wrappers';
import { useState } from 'react';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/pro-duotone-svg-icons';

export const ReserveParaId = () => {
  // The currently selected relay chain to register a ParaID on.
  const [relayChain, setRelayChain] = useState<string>('Polkadot Relay Chain');

  return (
    <FormWrapper>
      <h3>
        Reserve a Para ID on the Relay Chain you wish to secure blocks with.
      </h3>

      <section>
        <Select
          label={'Choose Relay chain'}
          values={
            [
              'Polkadot Relay Chain',
              'Kusama Relay Chain',
              'Westend Relay Chain',
              'Rococo Relay Chain',
            ] || []
          }
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
            /* TODO: Implement. */
          }}
        >
          Continue
          <FontAwesomeIcon icon={faCaretRight} transform="grow-1" />
        </ButtonSubmit>
      </section>
    </FormWrapper>
  );
};
