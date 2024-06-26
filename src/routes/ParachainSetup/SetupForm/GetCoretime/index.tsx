// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper } from 'routes/Home/Wrappers';
import { Prompt } from '../Prompt';

export const GetCoretime = () => (
  <FormWrapper>
    <Prompt>
      <section>
        <h4>Developer console does not yet support purchasing of Coretime.</h4>
      </section>
    </Prompt>

    <h3>Get bulk or instantaneous Coretime and start processing blocks.</h3>
  </FormWrapper>
);
