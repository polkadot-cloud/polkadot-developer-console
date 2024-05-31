// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import type { LabelProps } from './types';

const Wrapper = styled.h4`
  margin-bottom: 0.22rem;

  &.marginTop {
    margin-top: 1.25rem;
  }
`;

export const Label = ({ value, marginTop }: LabelProps) => (
  <Wrapper className={marginTop ? 'marginTop' : undefined}>{value}</Wrapper>
);
