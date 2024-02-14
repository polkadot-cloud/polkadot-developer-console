// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  /* background-color: var(--background-primary); */
  background-color: #f4f3f3; /* TODO: use new --background-primary */
  border-bottom: 1px solid var(--border-primary-color);
  width: 100%;
  display: flex;

  > div {
    color: var(--text-color-tertiary);
    padding: 0.7rem 0.75rem;
    font-size: 0.8rem;
  }
`;
