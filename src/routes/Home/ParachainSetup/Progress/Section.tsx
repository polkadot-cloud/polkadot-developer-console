// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import type { SectionProps } from './types';

export const Section = ({ stepId, label, children }: SectionProps) => {
  const { tabId } = useActiveTab();
  const { getActiveStep } = useParaSetup();
  const activeStep = getActiveStep(tabId);

  return (
    <section
      className={`label ${activeStep === stepId ? `active` : `inactive`}`}
    >
      <h4>{label}</h4>
      {children}
    </section>
  );
};
