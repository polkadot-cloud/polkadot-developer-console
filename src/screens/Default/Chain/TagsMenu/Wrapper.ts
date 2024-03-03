// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 450px;
  width: 100%;

  > h5 {
    padding: 0.75rem 0.75rem 0 0.75rem;
  }

  > .search {
    background-color: var(--background-default);
    position: sticky;
    padding: 0.2rem 0.5rem;
    top: 0;
    width: 100%;
    z-index: 5;

    > input {
      background-color: var(--background-primary);
      border: 1px solid var(--border-primary-color);
      padding: 0.3rem 0.4rem;
      border-radius: 0.25rem;
      margin: 0.3rem 0;
      font-size: 0.7rem;
      width: 100%;
    }
  }
`;
