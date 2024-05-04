// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId32 } from 'library/Inputs/AccountId32';
import { FormWrapper } from './Wrappers';

export const ReserveParaId = () => (
  <FormWrapper>
    <h3>
      Reserve a Para ID on the Relay Chain you wish to secure blocks with.
    </h3>

    <section>
      <AccountId32 />
    </section>
  </FormWrapper>
);
