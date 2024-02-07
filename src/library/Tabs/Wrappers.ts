import styled from 'styled-components';

export const TabsWrapper = styled.div`
  border-top: 1px solid var(--border-secondary-color);
  border-bottom: 1px solid var(--border-secondary-color);
  display: flex;
  margin-bottom: 1rem;
  width: 100%;

  > div {
    color: var(--text-color-secondary);
    border-right: 1px solid var(--border-secondary-color);

    &:last-child {
      border-right: none;
    }

    &:hover {
      color: var(--text-color-primary);
      background-color: var(--button-tab-background);
      cursor: pointer;
      transition: all 0.1s;
    }

    > .icon {
      margin-right: 0.25rem;
    }
  }
`;

export const TabWrapper = styled.div`
  font-size: 0.8rem;
  padding: 0.65rem 0.85rem;
`;
