// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { TextInputWrapper } from 'library/Inputs/Wrappers';
import type { TextboxProps } from './types';

export const Textbox = ({
  label,
  defaultValue,
  numeric,
  onMount,
  onRender,
  onChange,
  onFocus,
  placeholder,
}: TextboxProps) => {
  // The input arg type of this component.
  const INPUT_TYPE = 'Textbox';

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }

  // The current value of the input.
  const [value, setValue] = useState<string>(
    defaultValue === undefined ? '' : defaultValue
  );

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    if (numeric && isNaN(Number(val))) {
      return;
    }
    if (onChange !== undefined) {
      onChange(val);
    }
    setValue(val);
  };

  // Call on mount logic in initial render if provided.
  useEffect(() => {
    if (onMount !== undefined) {
      onMount(value);
    }
  }, []);

  const displayLabel = typeof label === 'object' ? label.short : label;

  return (
    <>
      {!!label && <h4>{displayLabel}</h4>}
      <TextInputWrapper className="input">
        <input
          type="text"
          value={value || ''}
          onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
          onFocus={onFocus}
          placeholder={placeholder}
        />
      </TextInputWrapper>
    </>
  );
};
