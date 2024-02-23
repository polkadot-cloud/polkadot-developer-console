// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TagSettings } from './TagSettings';
import { useSettings } from './provider';

export const Settings = () => {
  const { activeSection } = useSettings();

  return activeSection === 0 && <TagSettings />;
};
