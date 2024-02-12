// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction } from '@polkadot-cloud/react/types';
import { useEffect, type RefObject } from 'react';

// A hook that alerts clicks outside of the passed ref.
export const useOutsideAlerter = (
  ref: RefObject<HTMLElement>,
  callback: AnyFunction,
  ignore: string[] = []
) => {
  useEffect(() => {
    const handleClickOutside = (ev: Event) => {
      if (ev) {
        if (ref.current && !ref.current.contains(ev.target as Node)) {
          const target = ev.target as HTMLElement;

          const invalid = ignore.find((i) => target.classList.contains(i));
          if (invalid === undefined) {
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
