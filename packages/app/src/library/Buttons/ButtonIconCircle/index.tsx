// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { FC, MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { useRef } from 'react';
import { Wrapper } from './Wrapper';
import { useTooltip } from 'contexts/Tooltip';
import { CloudIcon } from '@polkadot-cloud/icons';

export const ButtonIconCircle = ({
  tooltipText,
  id,
  transform,
  onClick,
  icon,
}: {
  tooltipText?: string;
  transform?: string;
  id: string;
  icon?: FC;
  onClick: (
    ev: ReactMouseEvent<HTMLElement, MouseEvent>,
    ref: RefObject<HTMLButtonElement>
  ) => void;
}) => {
  const { openTooltip, closeTooltip } = useTooltip();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Wrapper
      ref={ref}
      id={id}
      onClick={(ev) => {
        onClick(ev, ref);
        closeTooltip();
      }}
      onPointerOver={() => {
        if (tooltipText) {
          openTooltip(tooltipText, ref);
        }
      }}
    >
      {icon && <CloudIcon icon={icon} transform={transform} />}
    </Wrapper>
  );
};
