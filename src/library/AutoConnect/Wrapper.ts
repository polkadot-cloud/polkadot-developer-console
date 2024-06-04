// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.45rem;
  padding: 0 0.2rem;

  > h4 {
    color: var(--text-color-tertiary);
    margin-right: 0.5rem;
    transition: color 0.25s;
  }
`;
