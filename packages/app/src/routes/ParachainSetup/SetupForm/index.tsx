// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { ConnectRelay } from './ConnectRelay';
import { Progress } from './Progress';
import { Footer } from './Footer';
import { ReserveParaId } from './ReserveParaId';
import { HomePageWrapper } from '../../Home/Wrappers';
import { FlexWrapper } from 'routes/Common/Wrappers';
import { RegisterParathread } from './RegisterParathread';
import { GetCoretime } from './GetCoretime';

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

        {activeStep === 'register_parathread' && <RegisterParathread />}

        {activeStep === 'get_coretime' && <GetCoretime />}

        <Footer nextDisabled={nextDisabled} />
      </HomePageWrapper>
    </FlexWrapper>
  );
};
