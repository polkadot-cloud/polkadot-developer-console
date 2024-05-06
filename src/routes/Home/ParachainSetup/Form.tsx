// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useParaSetup } from 'contexts/ParaSetup';
import { Icon } from './Icon';
import { FormWrapper, Wrapper } from './Wrappers';
import type { StepProps } from './types';
import { useActiveTab } from 'contexts/ActiveTab';
import { ConnectRelay } from './ConnectRelay';
import { Progress } from './Progress';
import { Footer } from './Footer';
import { ReserveParaId } from './ReserveParaId';

export const Form = (props: StepProps) => {
  const { tabId } = useActiveTab();
  const { getActiveStep } = useParaSetup();

  const activeStep = getActiveStep(tabId);
  const { relayInstance, relayApiStatus } = props;

  // Get the relay chain icon, if available.
  const relayIcon = relayInstance
    ? `../../../config/networks/icons/${relayInstance.chainId}/Inline.tsx`
    : undefined;

  // Determine whether next button should be disabled.
  const nextDisabled =
    activeStep === 'connect_relay' && relayApiStatus !== 'ready';

  return (
    <Wrapper>
      <h2>
        Set up a New Parachain
        {relayIcon && (
          <div className="icon">
            <Icon icon={relayIcon} />
          </div>
        )}
      </h2>

      <Progress />

      {activeStep === 'connect_relay' && <ConnectRelay {...props} />}

      {activeStep === 'reserve_para_id' && <ReserveParaId {...props} />}

      {activeStep === 'configure_node' && (
        <FormWrapper>
          <h3>Configure your Parachain Node to connect to the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'register_parathread' && (
        <FormWrapper>
          <h3>Register your Parathread on the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'get_coretime' && (
        <FormWrapper>
          <h3>
            Get bulk or instantaneous Coretime and start processing blocks.
          </h3>
        </FormWrapper>
      )}

      <Footer nextDisabled={nextDisabled} />
    </Wrapper>
  );
};
