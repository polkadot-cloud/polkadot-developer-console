// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

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
