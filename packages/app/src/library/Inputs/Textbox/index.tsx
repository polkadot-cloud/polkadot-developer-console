// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useEffect } from 'react';
import { TextInputWrapper } from 'library/Inputs/Wrappers';
import type { TextboxProps } from './types';

export const Textbox = ({
  label,
  value,
  numeric,
  placeholder,
  shrinkPlaceholder,
  onMount,
  onRender,
  onChange,
  onFocus,
}: TextboxProps) => {
  // The input arg type of this component.
  const INPUT_TYPE = 'str';

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    // If `numeric` flag set, check if the value is a number.
    if (numeric && Number.isNaN(Number(val))) {
      return;
    }

    // Remove double leading zeros if numeric.
    if (numeric) {
      val = val.replace(/0{2,}\./g, '0.');
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
