// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Wrapper } from './Wrapper';
import type { SwitchProps } from './types';

export const Switch = ({
  size = 'sm',
  active,
  disabled,
  onSwitch,
  className,
}: SwitchProps) => {
  // Determine background color based on switch config.
  const bgColor = disabled
    ? 'var(--button-hover-background)'
    : active
      ? 'var(--accent-color-secondary)'
      : 'var(--border-secondary-color)';

  // Determine toggle button color based on switch config.
  const buttonColor = disabled
    ? 'var(--background-default)'
    : active
      ? 'var(--background-default)'
      : 'var(--background-default)';

  // Determine toggle button border color based on disabled state. NOTE: Border is not currently
  // used.
  const borderColor = 'transparent';

  return (
    <Wrapper>
      <label
        style={{ background: bgColor, border: `1px solid ${borderColor}` }}
        className={`${size} ${className || ''}${disabled ? `is-disabled` : `is-enabled`}`}
      >
        <input
          disabled={disabled}
          onChange={(ev) => {
            if (!disabled) {
              if (typeof onSwitch === 'function') {
                onSwitch(ev.target.checked);
              }
            }
          }}
          checked={active}
          type="checkbox"
        />
        <span
          style={{ backgroundColor: buttonColor }}
          className={`btn ${size || ''} ${
            disabled ? `is-disabled` : ``
          } is-clicked${active ? `` : `-not`}`}
        />
      </label>
    </Wrapper>
  );
};
