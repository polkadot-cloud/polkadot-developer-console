// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { InputFormWrapper, SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useActiveTab } from 'contexts/ActiveTab';
import type { PalletData } from './types';
import { defaultPalletData } from './defaults';
import { camelize } from '@w3ux/utils';
import { ChainStateController } from 'controllers/ChainState';
import { useChainState } from 'contexts/ChainState';
import { Results } from './Results';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';

export const Constants = () => {
  const { getChainSpec } = useApi();
  const { tabId } = useActiveTab();
  const { setConstant } = useChainState();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'constants';
  const chainUi = getChainUi(tabId, chainUiSection);
  const Metadata = getChainSpec(tabIdToOwnerId(tabId))?.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const constantsData = useMemo((): PalletData => {
    if (!Metadata) {
      return defaultPalletData;
    }

    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getList(['constants']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    const items = activePallet ? scraper.getConstants(activePallet) : [];

    const result: PalletData = {
      pallets,
      activePallet,
      items,
    };

    return result;
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  const { pallets, activePallet, items } = constantsData;

  // If no storage item selected, select the first one from the list or fall back to null.
  const activeItem = chainUi.selected || items?.[0]?.name || null;

  // Handle retrieval of constant from scraped items.
  const handleSubmit = () => {
    const chainState = ChainStateController.instances[tabId];

    if (activePallet && activeItem) {
      const pallet = camelize(activePallet);
      const key = camelize(activeItem);

      const result = chainState.fetchConstant(pallet, key);
      if (result !== null) {
        setConstant(result.key, result.value);
      }
    }
  };

  return (
    <>
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          activePallet={activePallet}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiItem(tabId, chainUiSection, 'pallet', value);
          }}
        />
        <ChainStateList
          subject="Runtime Constant"
          items={items}
          activeItem={activeItem}
          chainUiSection={chainUiSection}
        />
      </SelectFormWrapper>
      <InputFormWrapper>
        <section className="footer">
          <ButtonSubmit onClick={() => handleSubmit()}>
            Submit
            <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
          </ButtonSubmit>
        </section>
      </InputFormWrapper>
      <Results display="constant" />
    </>
  );
};
