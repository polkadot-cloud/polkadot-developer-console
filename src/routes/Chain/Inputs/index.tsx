// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Textbox } from './Textbox';

export const useInput = () => {
  const getInput = (input: string, defaultValue: string | number) => {
    switch (input) {
      case 'number':
      default:
        return <Textbox defaultValue={defaultValue} />;
    }
  };

  return {
    getInput,
  };
};
