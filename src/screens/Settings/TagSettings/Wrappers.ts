// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TagItemWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  margin: 1rem 0;
  padding: 0.75rem 0;
  display: flex;
  width: 100%;

  > div {
    display: flex;
    align-items: center;

    &:first-child {
      flex-grow: 1;

      > .tag {
        margin-right: 1rem;
      }
    }

    &:last-child {
      flex-shrink: 1;
      justify-content: flex-end;
    }
  }
`;
