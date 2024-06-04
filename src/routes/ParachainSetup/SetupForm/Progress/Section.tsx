// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import type { SectionProps } from './types';

export const Section = ({
  stepId,
  label,
  collapsedStatus,
  showStatus,
  children,
  className,
}: SectionProps) => {
  const { tabId } = useActiveTab();
  const { getActiveStep } = useParaSetup();
  const activeStep = getActiveStep(tabId);

  return (
    <section
      className={`label ${activeStep === stepId ? `active` : `inactive`} ${className ? className : ``}`}
    >
      <h4>{label}</h4>
      <div
        className={`status ${activeStep === stepId ? `active` : ``} ${!collapsedStatus ? `collapsed` : !showStatus ? `hidden` : ``}`}
      >
        {children}
      </div>
    </section>
  );
};
