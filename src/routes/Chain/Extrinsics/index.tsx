// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChainListItemWrapper,
  ChainActiveItemWrapper,
  SelectChainItemWrapper,
  ChainListCallItem,
} from '../Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import type { PalletsListItem } from 'model/Metadata/types';
import { MetadataScraper } from 'controllers/MetadataScraper';
import { useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import type { AnyJson } from '@w3ux/utils/types';

export const Extrinsics = () => {
  const { getChainSpec } = useApi();
  const { activeTabId } = useTabs();

  // Pallet selection open.
  const [palletsOpen, setPalletsOpen] = useState<boolean>(false);

  // Call selection open.
  const [callsOpen, setCallsOpen] = useState<boolean>(false);

  // Refs for the selection menus.
  const palletSelectRef = useRef(null);
  const callsSelectRef = useRef(null);

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(palletSelectRef, () => {
    setPalletsOpen(false);
  });

  // Close call selection if clicked outside of its container.
  useOutsideAlerter(callsSelectRef, () => {
    setCallsOpen(false);
  });

  const Metadata = getChainSpec(activeTabId)?.metadata;
  if (!Metadata) {
    // TODO: handle UI where metadata has not yet been fetched.
    return null;
  }

  // Attempt to get pallet list from metadata.
  let palletList: PalletsListItem[];
  try {
    palletList = Metadata.getPalletList();
  } catch (e) {
    palletList = [];
  }

  // Play with Metadata scraper.
  const scraper = new MetadataScraper(Metadata);

  // Get the calls for the `Staking` pallet.
  // TODO: Get calls from selected pallet.
  const calls = scraper.getPalletCalls('Staking');

  // Calls type should aways be a variant, but checking to prevent errors.
  // let selection: { docs: string[]; fields: string[] }[];

  const selection: {
    call: string;
    docs: string[];
    fieldNames: string | undefined;
    fieldTypes: string | undefined;
  }[] = [];
  if (calls && calls.type === 'variant') {
    const variant = Object.entries(calls.variant) as [string, AnyJson][];

    variant.forEach(
      ([call, { docs, fields }]: [
        string,
        { docs: string[]; fields: Record<string, string> },
      ]) => {
        const fieldNames =
          JSON.stringify(fields) === '{}'
            ? undefined
            : Object.entries(fields).reduce(
                (acc: string, [name], index: number) => {
                  if (index > 0) {
                    acc += ', ';
                  }
                  return (acc += `${name}`);
                },
                ''
              );

        const fieldTypes =
          JSON.stringify(fields) === '{}'
            ? undefined
            : Object.entries(fields).reduce(
                (acc: string, [name, value], index: number) => {
                  if (index > 0) {
                    acc += ', ';
                  }
                  return (acc += `${name}: ${value}`);
                },
                ''
              );
        selection.push({ call, docs, fieldNames, fieldTypes });
      }
    );
  }

  // Convert lookup types to TypeScript types
  // const typescriptTypes: AnyJson = [];

  // NOTE: (I think) scraper needs to accumulate all types for a call, e.g. replace typeIds and
  // replace them with actual raw types, for `toRawType` to work.
  // Metadata.metadata.asV14.lookup.types.forEach((value) => {
  //   // const type = value.type.def.type;
  //   typescriptTypes.push(value.type.def.toJSON());
  // });
  // console.log(typescriptTypes);

  return (
    <SelectChainItemWrapper>
      {/* Pallet Selection */}

      <section>
        <h5>Pallet</h5>
        <ChainActiveItemWrapper
          className={palletsOpen ? ` open` : undefined}
          onClick={() => setPalletsOpen(!palletsOpen)}
        >
          <span>
            <ChainListCallItem>
              {palletList[0]?.name || 'No Pallets'}
            </ChainListCallItem>
          </span>
          <span>
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </ChainActiveItemWrapper>

        <div
          ref={palletSelectRef}
          className={`options${palletsOpen ? ` open` : ``}`}
        >
          <ChainListItemWrapper>
            <span>
              <ChainListCallItem>
                {palletList[0]?.name || 'No Pallets'}
              </ChainListCallItem>
            </span>
            <span></span>
          </ChainListItemWrapper>
        </div>
      </section>

      {/* Call Selection */}

      <section>
        <h5>Call</h5>
        <ChainActiveItemWrapper
          className={callsOpen ? ` open` : undefined}
          onClick={() => setCallsOpen(!callsOpen)}
        >
          <span>
            <ChainListCallItem>
              {selection[0]?.call || 'No Calls'}
              {selection[0]?.fieldNames && (
                <span>({selection[0].fieldNames})</span>
              )}
            </ChainListCallItem>
          </span>
          <span>
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </ChainActiveItemWrapper>

        <div
          ref={callsSelectRef}
          className={`options${callsOpen ? ` open` : ``}`}
        >
          {selection.map(({ call, docs, fieldNames }) => (
            <ChainListItemWrapper key={`call_select_${call}`}>
              <span>
                <ChainListCallItem>
                  {call}
                  {fieldNames && <span>({fieldNames})</span>}
                </ChainListCallItem>
              </span>
              <span>
                <h5>{docs[0]}</h5>
              </span>
            </ChainListItemWrapper>
          ))}
        </div>
      </section>
    </SelectChainItemWrapper>
  );
};
