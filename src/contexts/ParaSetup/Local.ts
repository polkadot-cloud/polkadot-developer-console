// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { SetupStepsState } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets the active step of parachain setup forms.
export const getActiveSteps = (): SetupStepsState | undefined => {
  const result = localStorageOrDefault(
    'paraSetupActiveSteps',
    undefined,
    true
  ) as SetupStepsState | undefined;

  if (result) {
    return result as SetupStepsState;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets the active step of parachain setup forms.
export const setActiveSteps = (value: SetupStepsState) => {
  localStorage.setItem('paraSetupActiveSteps', JSON.stringify(value));
};
