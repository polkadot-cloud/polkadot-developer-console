// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export // Motion props for handling section expansion.
const getMotionProps = (expanded: boolean) => ({
  initial: 'hidden',
  animate: expanded ? 'show' : 'hidden',
  variants: {
    hidden: {
      height: 0,
      opacity: 1,
    },
    show: {
      height: 'auto',
      opacity: 1,
    },
  },
  transition: {
    duration: 1,
    ease: [0.1, 1, 0.1, 1],
  },
  style: {
    paddingLeft: '1.5rem',
    marginBottom: expanded ? '1rem' : 0,
    overflow: 'hidden',
  },
});
