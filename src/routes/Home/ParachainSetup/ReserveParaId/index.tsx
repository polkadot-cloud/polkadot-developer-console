// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper } from '../Wrappers';
import type { StepProps } from '../types';

export const ReserveParaId = (props: StepProps) => {
  console.log(props);

  return (
    <FormWrapper>
      <h3>Reserve a Para ID or select an existing one from your accounts.</h3>
    </FormWrapper>
  );
};
