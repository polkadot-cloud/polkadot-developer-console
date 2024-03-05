// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: 0.85rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const PageContentWrapper = styled.div`
  margin-top: 0.5rem;
  max-width: 1100px;
  width: 100%;

  > h2 {
    color: var(--text-color-secondary);
    margin-bottom: 0.6rem;
  }
`;
