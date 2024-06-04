// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Wrapper } from './Wrapper';
import type { SwitchProps } from './types';

export const Switch = ({
  scale,
  active,
  disabled,
  onSwitch,
  className,
}: SwitchProps) => {
  // Determine background color based on switch config.
  const bgColor = disabled
    ? 'var(--button-hover-background)'
    : active
      ? 'var(--accent-color-primary)'
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

  // Determine the switch width and height based on scale.
  const baseWidth = '3rem';
  const baseHeight = '1.5rem';

  const width = scale ? `calc(${scale} * ${baseWidth})` : baseWidth;
  const height = scale ? `calc(${scale} * ${baseHeight})` : baseHeight;

  return (
    <Wrapper
      style={{
        width,
        height,
      }}
    >
      <label
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          // transform: scale ? `scale(${scale})` : undefined,
        }}
        className={`${className || ''}${disabled ? `is-disabled` : `is-enabled`}`}
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
          style={{
            backgroundColor: buttonColor,
            width: `calc(${scale} * 1.1rem)`,
            height: `calc(${scale} * 1.1rem)`,
            top: `calc(${scale} * 0.13rem)`,
            left: active
              ? `calc(100% - calc(${scale} * 0.2rem))`
              : `calc(${scale} * 0.23rem)`,
            transform: active ? `translateX(-100%)` : undefined,
          }}
          className={`btn ${
            disabled ? `is-disabled` : ``
          } is-clicked${active ? `` : `-not`}`}
        />
      </label>
    </Wrapper>
  );
};
