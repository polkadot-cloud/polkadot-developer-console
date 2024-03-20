// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SelectItemWrapper,
  SelectFormWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from '../Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Header } from './Header';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { PalletList } from '../PalletList';
import type { AnyJson } from '@w3ux/utils/types';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { getShortLabel } from '../Utils';

interface StorgeListItem {
  docs: string[];
  name: string;
  types: AnyJson;
  callSig: string;
}

export const ChainState = () => {
  const { activeTabId } = useTabs();
  const { getChainSpec } = useApi();
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // The currently selected pallet.
  const [selectedPallet, setSelectedPallet] = useState<string | null>(null);

  // Storage selection open.
  const [storageOpen, setStorageOpenState] = useState<boolean>(false);

  // Setter for storage item menu open state.
  const setStorageOpen = (value: boolean) => {
    setStorageOpenState(value);
  };

  // Refs for the selection menus.
  const storageSelectRef = useRef(null);

  // Close storage selection if clicked outside of its container.
  useOutsideAlerter(
    storageSelectRef,
    () => {
      setStorageOpen(false);
    },
    ['ignore-outside-alerter-storage']
  );

  // Scrapes storage items from metadata for a selected pallet and returns them in a formatted list.
  const getStorageItems = () => {
    if (!Metadata) {
      return {
        pallets: [],
        activePallet: null,
        storageItems: [],
      };
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getList(['storage']);
    const activePallet = selectedPallet || pallets?.[0].name || null;

    let storageItems = [];
    if (activePallet) {
      storageItems = scraper.getStorage(activePallet);
    }
    return { storageItems, activePallet, pallets };
  };

  // Fetch storage when metadata or the select pallet changes.
  const { pallets, activePallet, storageItems } = useMemo(
    () => getStorageItems(),
    [selectedPallet, Metadata?.metadata]
  );

  // A function that can be called recursively to format a callSig argument and return types.
  const getSigType = (section: AnyJson) => {
    let typeStr = '';

    switch (section?.type) {
      case 'array':
        typeStr = getSigType(section.array.type);
        break;

      case 'compact':
        typeStr = getSigType(section.sequence);
        break;
      case 'sequence':
        typeStr = `Vec<${getSigType(section.sequence)}>`;
        break;
      case 'tuple':
        typeStr = `(${section.tuple.reduce(
          (acc: string, subSection: AnyJson, index: number) => {
            const sigType = getSigType(subSection);
            acc += sigType;
            if (index !== section.tuple.length - 1) {
              acc += ', ';
            }
            return acc;
          },
          ''
        )})`;
        break;
      case 'bitSequence':
      case 'primitive':
        typeStr = getShortLabel(section.label);
        break;
      case 'composite':
        // Expand type if short label is not defined, or if basic types.
        if (
          ['', 'BoundedVec', 'WeakBoundedVec'].includes(section.label.short)
        ) {
          typeStr += section.composite.reduce(
            (acc: string, field: AnyJson, index: number) => {
              let str = acc + getSigType(field.type);
              if (index < section.composite.length - 1) {
                str += ', ';
              }
              return str;
            },
            ''
          );
        } else {
          typeStr = `${section.label.short}`;
        }

        break;
      case 'variant':
        typeStr = `${section.label.short}`;
        // If variant is `Option`, expand signature with its `Some` type.
        if (section.label.short === 'Option') {
          // TODO: expand to check if this variant is actually an option of `Some` and `None`, where
          // `None` has no fields.
          typeStr +=
            section.variant[1].fields.reduce(
              (acc: string, field: AnyJson, index: number) => {
                let str = acc + getSigType(field.type);
                if (index < section.variant[1].fields.length - 1) {
                  str += ', ';
                }
                return str;
              },
              `<`
            ) + `>`;
        }
        break;
    }
    return typeStr;
  };

  const storage = storageItems.map((storageItem: AnyJson) => {
    const {
      modifier,
      type: { argTypes, returnType },
    } = storageItem;

    // Format arguments and return types
    const sigTypes: [string, string] = ['', ''];
    //               ^^^^^^  ^^^^^^
    //               args,   return
    [argTypes, returnType].forEach((section, index) => {
      sigTypes[index] = getSigType(section);
    });

    let callSig = '';
    if (sigTypes[0] !== '') {
      // Regex to check if `sigTypes[0] is already wrapped in parens, and to do so if not.
      if (!/^\(.*\)$/.test(sigTypes[0])) {
        callSig = `(${sigTypes[0]})`;
      } else {
        callSig = `${sigTypes[0]}`;
      }
    } else {
      callSig = '()';
    }

    if (sigTypes[1] !== '') {
      callSig += `: `;
      // Handle modifiers.
      if (modifier === 'Optional') {
        callSig += `Option<${sigTypes[1]}>`;
      } else {
        callSig += sigTypes[1];
      }
    }

    return {
      ...storageItem,
      callSig,
    };
  });

  // List of storage items alphabetically.
  const orderSotrageItems = useCallback(
    (selection: StorgeListItem[]) =>
      selection.sort(({ name: nameA }, { name: nameB }) =>
        nameA < nameB ? -1 : nameA > nameB ? 1 : 0
      ),
    [storage]
  );

  // Sort storage items alphabetically based on call name.
  let selection: StorgeListItem[] = storage;

  selection = useMemo(() => orderSotrageItems(selection), [orderSotrageItems]);

  return (
    <>
      <Header />
      <SelectFormWrapper className="withHeader">
        {/* Pallet Selection */}
        <PalletList
          pallets={pallets}
          selected={activePallet}
          onSelect={(value) => setSelectedPallet(value)}
        />

        {/* Storage Item Selection */}
        <section>
          <div className="inner">
            <h5>Storage Item</h5>
            <SelectItemWrapper
              className={`standalone${storageOpen ? ` open` : ``} ignore-outside-alerter-storage`}
              onClick={() => setStorageOpen(!storageOpen)}
            >
              <span>
                <SelectTextWrapper>
                  {selection[0]?.name || 'No Storage Items'}
                  <span>{selection[0]?.callSig || ''}</span>
                </SelectTextWrapper>
              </span>
              <span>
                <h5>{selection[0]?.docs?.[0] || ''}</h5>
                <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
              </span>
            </SelectItemWrapper>

            <SelectDropdownWrapper
              ref={storageSelectRef}
              className={`${storageOpen ? ` open` : ``}`}
            >
              {selection.map(({ name, docs, callSig }) => (
                <SelectItemWrapper
                  key={`storage_select_${name}`}
                  className="option"
                  onClick={() => setStorageOpen(false)}
                >
                  <span>
                    <SelectTextWrapper>
                      {name}
                      <span>{callSig}</span>
                    </SelectTextWrapper>
                  </span>
                  <span>
                    <h5>{docs[0]}</h5>
                  </span>
                </SelectItemWrapper>
              ))}
            </SelectDropdownWrapper>
          </div>
        </section>
      </SelectFormWrapper>
    </>
  );
};
