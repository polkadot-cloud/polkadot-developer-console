// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  > h1 {
    margin-bottom: 0.75rem;
  }
  > h3 {
    margin-bottom: 1.5rem;
  }

  > h2 > button {
    color: var(--accent-color-secondary);
    font-size: 0.9rem;
  }
`;
