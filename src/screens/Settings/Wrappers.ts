// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SettingsWrapper = styled.div`
  margin-top: 0.5rem;
  max-width: 750px;
  width: 100%;

  > .head {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.25rem;
  }
`;

export const HeaderButtonWrapper = styled.button`
  color: var(--text-color-primary);
  border: 1px solid var(--border-secondary-color);
  font-family: InterSemiBold, sans-serif;
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;

  > svg {
    padding-right: 0.5rem;
  }

  &:hover {
    border-color: var(--accent-color-secondary);
    color: var(--accent-color-secondary);
  }

  &:disabled {
    opacity: 0.5;

    &:hover {
      cursor: default;
      color: var(--text-color-primary);
      border-color: var(--border-secondary-color);
    }
  }
`;
