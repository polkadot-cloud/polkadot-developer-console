// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
      line-height: 1.3rem;
      flex: 0;

      &.inline {
        margin-top: 0.75rem;
      }
      &.danger {
        color: var(--status-danger-color);
      }
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

    > button,
    label {
      border: 1px solid var(--accent-color-primary);
      color: var(--accent-color-primary);
      padding: 0.35rem 0.75rem;
      border-radius: 0.4rem;
      font-size: 0.8rem;
      cursor: pointer;

      > svg {
        margin-right: 0.5rem;
      }
    }

    > input[type='file'] {
      display: none;
    }
  }
`;
