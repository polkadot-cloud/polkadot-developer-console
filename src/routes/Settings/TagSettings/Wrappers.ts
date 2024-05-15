// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const ManageTagWrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  border-radius: 0.45rem;
  padding: 0.75rem 0.65rem 0.5rem 0.75rem;
  flex-grow: 1;
  display: flex;
  margin: 0.5rem 0;

  > div {
    display: flex;
    align-items: flex-end;

    &.form {
      flex-direction: column;
      align-items: flex-start;
      flex-grow: 1;
      margin-bottom: 0.25rem;

      > input {
        border: 1px solid var(--border-primary-color);
        color: var(--text-color-secondary);
        border-radius: 0.35rem;
        margin-top: 0.5rem;
        padding: 0.5rem 0.65rem;
        width: 100%;
      }
    }
    &.controls {
      flex-shrink: 1;
      justify-content: flex-end;

      > span {
        display: flex;
        margin-bottom: 0.4rem;
        margin-left: 0.4rem;

        > button {
          margin-left: 0.85rem;

          &.cancel {
            color: var(--text-color-secondary);
          }
        }
      }
    }
  }
`;

export const TagItemWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  margin: 1rem 0;
  padding-bottom: 1rem;
  display: flex;
  width: 100%;
  flex-direction: column;

  > .inner {
    display: flex;
    flex-direction: row;
    width: 100%;

    > div {
      display: flex;
      align-items: center;

      &.details {
        flex-grow: 1;

        > .tag {
          margin-right: 1rem;
        }
      }

      &.controls {
        flex-shrink: 1;
        justify-content: flex-end;

        > .lock {
          color: var(--text-color-tertiary);
          opacity: 0.5;
        }

        > button {
          margin-left: 0.5rem;
        }
      }
    }
  }
`;
