// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { ConnectRelay } from './ConnectRelay';
import { Progress } from './Progress';
import { Footer } from './Footer';
import { ReserveParaId } from './ReserveParaId';
import { FormWrapper, HomePageWrapper } from '../../Home/Wrappers';
import { FlexWrapper } from 'routes/Common/Wrappers';

export const SetupForm = () => {
  const { tabId } = useActiveTab();
  const { getActiveStep, getSelectedRelayChain } = useParaSetup();

  const activeStep = getActiveStep(tabId);
  const selectedRelayChain = getSelectedRelayChain(tabId);

  // Determine whether next button should be disabled.
  const nextDisabled =
    activeStep === 'connect_relay' && selectedRelayChain === undefined;

  return (
    <FlexWrapper>
      <HomePageWrapper>
        <h2>Parachain Setup</h2>

        <Progress />

        {activeStep === 'connect_relay' && <ConnectRelay />}

        {activeStep === 'reserve_para_id' && <ReserveParaId />}

        {activeStep === 'configure_node' && (
          <FormWrapper>
            <h3>
              Configure your Parachain Node to connect to the Relay Chain.
            </h3>
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
      </HomePageWrapper>
    </FlexWrapper>
  );
};
