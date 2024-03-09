// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSection } from 'library/Page/provider';
import { PageContentWrapper } from 'library/Page/Wrapper';
import { SettingsSections } from './Route';

export const Settings = () => {
  const { activeSection } = useSection();
  const { Component } = SettingsSections[activeSection];

  return (
    <PageContentWrapper>
      {Component !== undefined && <Component />}
    </PageContentWrapper>
  );
};
