// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import type { HashProps } from './types';
import { TextInputWrapper } from '../Wrappers';

export const Hash = ({ value, onMount, onRender, onChange }: HashProps) => {
  // The input arg type of this component.
  const INPUT_TYPE = 'Hash';

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    if (onChange !== undefined) {
      onChange(val);
    }
  };

  // Call on mount logic in initial render if provided.
  useEffect(() => {
    if (onMount !== undefined) {
      onMount(String(value));
    }
  }, []);

  return (
    <TextInputWrapper className="input">
      <input
        type="text"
        value={value || ''}
        placeholder="0x prefixed hash..."
        onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
      />
    </TextInputWrapper>
  );
};
