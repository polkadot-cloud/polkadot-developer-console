// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import { TextInputWrapper } from 'library/Inputs/Wrappers';
import type { TextboxProps } from './types';

export const Textbox = ({
  label,
  value,
  numeric,
  onMount,
  onRender,
  onChange,
  onFocus,
  placeholder,
  shrinkPlaceholder,
}: TextboxProps) => {
  // The input arg type of this component.
  const INPUT_TYPE = 'Textbox';

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    if (numeric && isNaN(Number(val))) {
      return;
    }
    if (onChange !== undefined) {
      onChange(val);
    }
  };

  // Call on mount logic in initial render if provided.
  useEffect(() => {
    if (onMount !== undefined) {
      onMount(value);
    }
  }, []);

  return (
    <>
      {!!label && <h4>{label}</h4>}
      <TextInputWrapper className="input">
        <input
          type="text"
          value={value || ''}
          onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className={shrinkPlaceholder ? 'shrinkPlaceholder' : ''}
        />
      </TextInputWrapper>
    </>
  );
};
