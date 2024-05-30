// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOneShotTooltip } from 'contexts/OneShotTooltip';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { useRef } from 'react';
import { Wrapper } from './Wrapper';

export const ButtonIconCircle = ({
  tooltipText,
  id,
  transform,
  onClick,
  icon = faClone, // Default icon to clone (most used).
}: {
  tooltipText?: string;
  transform?: string;
  id: string;
  icon?: IconProp;
  onClick: (
    ev: ReactMouseEvent<HTMLElement, MouseEvent>,
    ref: RefObject<HTMLButtonElement>
  ) => void;
}) => {
  const { openTooltip } = useOneShotTooltip();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Wrapper
      ref={ref}
      id={id}
      onClick={(ev) => {
        onClick(ev, ref);

        if (tooltipText) {
          openTooltip(tooltipText, ref);
        }
      }}
    >
      <FontAwesomeIcon icon={icon} transform={transform} />
    </Wrapper>
  );
};
