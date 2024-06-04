// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTooltip } from 'contexts/Tooltip';
import { ButtonWrapper } from 'library/HeaderMenu/Wrappers';
import { useRef } from 'react';

interface ButtonWithTooltipProps {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: IconProp;
  iconTransform?: string;
  tooltipText: string;
}

export const ButtonWithTooltip = ({
  active,
  disabled,
  onClick,
  icon,
  iconTransform,
  tooltipText,
}: ButtonWithTooltipProps) => {
  const { openTooltip } = useTooltip();
  const ref = useRef(null);

  return (
    <ButtonWrapper
      ref={ref}
      onPointerOver={() => openTooltip(tooltipText, ref)}
      onClick={() => onClick()}
      disabled={disabled}
      className={active ? 'active' : undefined}
    >
      <FontAwesomeIcon icon={icon} transform={iconTransform || undefined} />
    </ButtonWrapper>
  );
};
