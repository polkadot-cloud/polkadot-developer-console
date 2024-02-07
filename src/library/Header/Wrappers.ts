import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.85rem;
  width: 100%;

  > div {
    display: flex;
    align-items: center;
    flex-grow: 1;

    &:first-child {
      > h1 {
        color: var(--accent-color-secondary);
        font-family: Inter, sans-serif;
        font-size: 0.8rem;
        /* NOTE: Text gradients not yet standardised. Falls back to color on non-webkit compatible
        browsers. */
        /* background: linear-gradient(
          90deg,
          var(--accent-color-primary) 0%,
          var(--accent-color-secondary) 100%
        );
        /* -webkit-text-fill-color: transparent;
        background-clip: text; */

        > span {
          color: var(--text-color-primary);
          font-family: Inter, sans-serif;
          margin-left: 0.35rem;
          font-size: 0.7rem;
          opacity: 0.75;
        }
      }
    }

    &:last-child {
      justify-content: flex-end;
    }
  }
`;
