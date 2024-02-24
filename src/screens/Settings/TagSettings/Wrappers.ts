// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const NewTagWrapper = styled.div`
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
            color: var(--text-color-tertiary);
          }
        }
      }
    }
  }
`;

export const TagItemWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  display: flex;
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
        margin-right: 1rem;
      }
    }
  }
`;
