// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, type RefObject } from 'react';

// A hook that alerts clicks outside of the passed ref.
export const useOutsideAlerter = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  ignore: string[] = []
) => {
  useEffect(() => {
    const handleClickOutside = (ev: Event) => {
      if (ev) {
        if (ref.current && !ref.current.contains(ev.target as Node)) {
          const target = ev.target as HTMLElement;
          const invalid = ignore.some((i) => target.closest(`.${i}`) !== null);

          if (!invalid) {
            callback();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
