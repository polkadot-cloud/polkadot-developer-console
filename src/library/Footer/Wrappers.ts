// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const FooterWrapper = styled.div`
  border-top: 1px solid var(--accent-color-transparent);
  background-color: var(--accent-color-transparent);
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 2.2rem;
  width: 100%;

  > div {
    color: var(--text-color-primary);
    font-family: Inter, sans-serif;
    display: flex;
    align-items: center;
    flex-grow: 1;
    font-size: 0.7rem;

    .icon {
      position: relative;
      top: 0.05rem;
    }
    &:last-child {
      justify-content: flex-end;
    }
  }
`;
