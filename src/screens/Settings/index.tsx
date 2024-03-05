// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TagSettings } from './TagSettings';
import { useSection } from 'library/Page/provider';
import { TabSettings } from './TabSettings';
import { PageContentWrapper } from 'library/Page/Wrapper';

export const Settings = () => {
  const { activeSection } = useSection();

  return (
    <PageContentWrapper>
      {activeSection === 0 && <TabSettings />}
      {activeSection === 1 && <TagSettings />}
    </PageContentWrapper>
  );
};
