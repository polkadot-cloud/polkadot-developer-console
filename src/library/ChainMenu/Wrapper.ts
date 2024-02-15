// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: var(--background-primary);
  border-bottom: 1px solid var(--border-primary-color);
  display: flex;
  width: 100%;

  > .menu {
    display: flex;
    align-items: center;

    > div {
      color: var(--text-color-tertiary);
      padding: 0.7rem 0.5rem 0.7rem 1.1rem;
      font-size: 0.8rem;
    }
  }

  > .config {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: flex-end;
    padding-right: 1rem;

    .icon {
      color: var(--text-color-secondary);
    }
  }
`;
