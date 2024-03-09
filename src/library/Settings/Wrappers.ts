// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SettingsHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  min-height: 2.5rem;

  > h2 {
    flex-grow: 1;
  }

  > div {
    display: flex;
    justify-content: flex-end;
  }
`;

export const SettingsSubheadingWrapper = styled.h4`
  border-bottom: 1px solid var(--border-primary-color);
  margin: 1.2rem 0 0.6rem 0;
  padding-bottom: 0.5rem;
`;

export const SettingsHeaderButton = styled.button`
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
    border-color: var(--accent-color-primary);
    color: var(--accent-color-primary);
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
