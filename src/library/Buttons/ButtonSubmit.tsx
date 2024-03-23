import styled from 'styled-components';

export const ButtonSubmit = styled.button`
  color: var(--text-color-tertiary);
  font-family: InterSemiBold, sans-serif;
  display: flex;
  align-items: center;
  font-size: 0.8rem;

  &:hover {
    color: var(--accent-color-primary);
  }

  > svg {
    margin-left: 0.4rem;
  }
`;
