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

export const RenameTabWrapper = styled.div`
  max-width: 400px;
  width: 100%;
`;

export const SearchChainWrapper = styled.div`
  margin-top: 1.65rem;
  max-width: 750px;
  width: 100%;
`;

export const ChainListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  max-width: 750px;
  width: 100%;
`;

export const Separator = styled.div`
  flex: 1;
  border-top: 1px solid var(--border-primary-color);
`;

export const ChainListItemWrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  border-radius: 0.9rem;
  margin-top: 0.5rem;
  padding: 0rem 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;

    &.header {
      border-bottom: 1px solid var(--border-primary-color);
      padding-top: 0.75rem;
      padding-bottom: 0.5rem;

      > h3 {
        color: var(--text-color-secondary);
      }
      > .icon {
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.6rem;
      }
    }

    &.footer {
      padding-top: 0.5rem;
      padding-bottom: 0.6rem;
      > h5 {
        color: var(--text-color-tertiary);
      }
    }
  }
`;
