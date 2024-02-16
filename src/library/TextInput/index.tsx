// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef, useState } from 'react';
import { Wrapper } from '../../library/TextInput/Wrapper';
import type { TextInputProps } from './types';

export const TextInput = ({
  name,
  value,
  placeholder,
  label,
  onSubmit,
  onChange,
}: TextInputProps) => {
  // Whether the input is in focus.
  const [focus, setFocus] = useState<boolean>(false);

  // Ref of the input element.
  const inputRef = useRef<HTMLInputElement>(null);

  // Whether the current value is valid.
  const valid = value.length > 0;

  // Format submitted value.
  const formatSubmitted = (str: string): string => {
    // Remove extra spaces.
    str = str.replace(/\s{2,}/g, ' ');
    // Trim.
    str = str.trim();
    return str;
  };

  return (
    <Wrapper>
      {label && <h5 className={`${focus ? 'focus' : undefined}`}>{label}</h5>}
      <div className={`inner ${focus ? 'focus' : undefined}`}>
        <input
          ref={inputRef}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(ev) => onChange(ev.currentTarget.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={(ev) => {
            // Submit on enter key.
            if (ev.key === 'Enter') {
              onSubmit(formatSubmitted(value));
            }
            // Blue on escape key.
            if (ev.key === 'Escape') {
              inputRef.current?.blur();
              setFocus(false);
            }
          }}
        />
        <div className="controls">
          <button
            onClick={() => onSubmit(formatSubmitted(value))}
            disabled={!valid}
          >
            Save
          </button>
        </div>
      </div>
    </Wrapper>
  );
};
