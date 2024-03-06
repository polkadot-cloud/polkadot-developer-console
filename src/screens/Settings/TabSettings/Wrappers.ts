// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SettingsToggleWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  display: flex;
  align-items: flex-end;
  margin-top: 1.25rem;
  padding-bottom: 0.6rem;
  width: 100%;

  > .text {
    flex-grow: 1;

    h4,
    h5 {
      color: var(--text-color-secondary);
      margin-bottom: 0.35rem;
    }

    > h3 {
      color: var(--text-color-primary);
      flex: 0;
    }
  }

  .switch {
    flex: 0;
  }
`;
export const SettingsSubmitWrapper = styled.div`
  width: 100%;

  > .buttons {
    display: flex;
    margin-top: 0.75rem;

    > button {
      border: 1px solid var(--accent-color-secondary);
      color: var(--accent-color-secondary);
      padding: 0.35rem 0.75rem;
      border-radius: 0.4rem;
    }
  }
`;
