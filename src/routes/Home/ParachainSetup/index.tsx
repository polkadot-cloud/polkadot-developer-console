// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Form } from './Form';
import { ChainSpaceEnvProvider } from 'contexts/ChainSpaceEnv';

export const ParachainSetup = () => (
  <ChainSpaceEnvProvider>
    <Form />
  </ChainSpaceEnvProvider>
);
