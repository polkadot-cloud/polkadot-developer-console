// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--accent-color-primary);
  border: 0.5px solid var(--border-primary-color);
  box-shadow: var(--shadow-notification);
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
  z-index: 999;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  display: flex;

  > h3,
  svg {
    color: var(--text-color-invert);
  }

  > svg {
    margin-right: 0.5rem;
  }
`;
