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
  margin-top: 1.25rem;
  max-width: 750px;
  width: 100%;
`;

export const ChainListWrapper = styled.div`
  --chain-list-item-border-radius: 0.9rem;

  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  max-width: 750px;
  width: 100%;

  > h4 {
    color: var(--text-color-secondary);
  }
`;

export const Separator = styled.div`
  flex: 1;
  border-top: 1px solid var(--border-primary-color);
`;

export const TagControlsWrapper = styled.div`
  margin-top: 0.85rem;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    align-items: center;
    margin-left: 0.25rem;

    &.controls {
      margin-bottom: 0.25rem;
      > h5 {
        padding-right: 0.65rem;
      }
    }

    &.applied {
      margin-top: 0.5rem;
    }
    > button {
      margin-right: 0.6rem;
    }
  }
`;

export const ChainListItemWrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  border-radius: var(--chain-list-item-border-radius);
  margin-top: 0.45rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  > div {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;

    &.header {
      border-bottom: 1px solid var(--border-primary-color);
      border-top-left-radius: var(--chain-list-item-border-radius);
      border-top-right-radius: var(--chain-list-item-border-radius);
      padding: 0.7rem 0.75rem 0.7rem 0.75rem;
      cursor: pointer;

      h3 {
        color: var(--text-color-primary);
        font-family: InterBold, sans-serif;
        transition: color 0.25s;
      }

      > h5 {
        margin-top: 0.15rem;
      }

      > .icon {
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.55rem;
      }

      &:hover {
        background-color: var(--background-default);
        > h3 {
          color: var(--accent-color-secondary);
        }
      }
    }

    &.footer {
      padding: 0.3rem 0.75em 0.6rem 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      > .tags {
        display: flex;
        margin-top: 0.4rem;

        > div {
          margin-right: 0.45rem;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  &:hover {
    transform: scale(1.01);
  }
`;
