// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRoute } from 'contexts/Route';
import { PageContentWrapper } from 'library/Page/Wrapper';
import { SettingsSections } from './Route';

export const Settings = () => {
  const { activePage } = useRoute();
  const { Component } = SettingsSections[activePage];

  return (
    <PageContentWrapper>
      {Component !== undefined && <Component />}
    </PageContentWrapper>
  );
};
