// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment } from 'react';
import { Section } from 'library/Inputs/Section';
import type { InputArgConfig, InputMeta, InputType } from './types';
import { Select } from 'library/Inputs/Select';
import { Checkbox } from 'library/Inputs/Checkbox';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';
import { useAccounts } from 'contexts/Accounts';
import { useChain } from '../Provider';
import { Textbox } from 'library/Inputs/Textbox';
import {
  arrayIsBytes,
  arrayIsPrimitive,
  defaultInputValue,
} from 'model/Scraper/Utils';
import { Sequence } from './Sequence';
import type { ArrayType } from 'model/Scraper/Types/Array';
import type { SequenceType } from 'model/Scraper/Types/Sequence';
import type { CompositeType } from 'model/Scraper/Types/Composite';
import type { ScrapedFieldItem, ScrapedItem } from 'model/Scraper/types';
import { Hash } from 'library/Inputs/Hash';

export const useInput = () => {
  const { chainSpec } = useChain();
  const { getAccounts } = useAccounts();
  const { tabId, metaKey } = useActiveTab();
  const { setInputArgAtKey, getInputArgAtKey, resetInputArgsFromKey } =
    useChainUi();

  const accounts = getAccounts(chainSpec);

  // Reads input and returns input components based on the input type. Called recursively for types
  // that host other types.
  const readInput = (
    arg: ScrapedItem,
    config: InputArgConfig,
    options?: {
      indent?: boolean;
      prependLabel?: string;
    }
  ) => {
    const { scraper } = config;
    const indent = options?.indent || false;

    // Return early if no args are provided.
    if (!arg) {
      return null;
    }

    const { indexKey } = arg;
    const typeClass = scraper.getClass(indexKey);

    switch (typeClass.type) {
      case 'tuple':
        return renderTuple(arg, config);

      case 'composite':
        return renderComposite(arg, config);

      case 'variant':
        return renderVariant(arg, config);

      case 'bitSequence':
        return renderInput(arg, config, { indent });

      case 'primitive':
        return renderInput(arg, config, options);

      case 'array':
        return renderArray(arg, config);

      case 'compact':
        return renderCompact(arg, config);

      case 'sequence':
        return renderSequence(arg, config, 'sequence');

      default:
        return null;
    }
  };

  // Renders a tuple input component.
  const renderTuple = (arg: ScrapedItem, config: InputArgConfig) => {
    const { tuple, indexKey } = arg;
    const { inputKey, inputMeta } = config;

    // Record this input type.
    addInputTypeAtKey(inputMeta, inputKey, indexKey, 'tuple');

    // Render tuple inputs.
    return (
      <Section indent={true}>
        {tuple.map((item: ScrapedItem, index: number) => (
          <Fragment key={`input_arg_${inputKey}_${index}`}>
            {readInput(item, { ...config, inputKey: `${inputKey}_${index}` })}
          </Fragment>
        ))}
      </Section>
    );
  };

  // Renders an array input component.
  const renderArray = (arg: ScrapedItem, config: InputArgConfig) => {
    const typeClass = config.scraper.getClass(arg.indexKey) as ArrayType;
    const label = typeClass.label();

    // If array is a vector of bytes, render a hash input.
    if (arrayIsBytes(arg)) {
      return (
        <Section>
          <h4>{label}</h4>
          {renderInput(arg, config, { indent: false })}
        </Section>
      );
    }

    // If array is of a primitive type, render a textbox input.
    if (arrayIsPrimitive(arg)) {
      return renderInput(arg, config, {
        indent: false,
        overrideInput: 'text',
      });
    }

    // Otherwise, allow multi input.
    return renderSequence(arg, config, 'array', typeClass.array.len);
  };

  // Renders a sequence input component.
  const renderSequence = (
    arg: ScrapedItem,
    config: InputArgConfig,
    type: 'array' | 'sequence',
    maxLength?: number
  ) => {
    const { indexKey } = arg;
    const typeClass = config.scraper.getClass(indexKey) as SequenceType;
    const label = typeClass.label();
    const input = typeClass.input();

    // If sequence is a vector of bytes, render a hash input.
    if (input !== 'array') {
      return (
        <Section>
          <h4>{label}</h4>
          {renderInput(arg, config, { indent: false })}
        </Section>
      );
    }

    // Otherwise, allow sequence input.
    return (
      <Section>
        <h4 className="marginTop">{`${label ? `${label}[]` : 'Array'}`}</h4>
        <Sequence
          indexKey={indexKey}
          config={config}
          arrayInput={arg[type]}
          maxLength={maxLength}
        />
      </Section>
    );
  };

  // Renders a compact input component.
  const renderCompact = (arg: ScrapedItem, config: InputArgConfig) => {
    const { compact, indexKey } = arg;
    const { inputKey, inputMeta } = config;

    // Record this input type.
    addInputTypeAtKey(inputMeta, inputKey, indexKey, 'compact');

    // Render compact input.
    return (
      <Fragment key={`input_arg_${inputKey}_0`}>
        {readInput(compact, { ...config, inputKey: `${inputKey}_0` })}
      </Fragment>
    );
  };

  // Renders a composite input component.
  const renderComposite = (arg: ScrapedItem, config: InputArgConfig) => {
    const { indexKey } = arg;
    const typeClass = config.scraper.getClass(indexKey) as CompositeType;
    const label = typeClass.label();
    const input = typeClass.input();
    const { inputKey, inputMeta } = config;

    // If this composite is a custom input, render it and stop the recursive input loop.
    if (input !== 'indent') {
      return (
        <Section>
          <h4>{label}</h4>
          {renderInput(arg, config, { indent: false })}
        </Section>
      );
    }

    // Record this input type.
    addInputTypeAtKey(inputMeta, inputKey, indexKey, 'composite');

    // Render the composite fields.
    return (
      <Section indent={true}>
        {arg.composite.map((field: ScrapedFieldItem, index: number) => {
          const childKey = `${inputKey}_${index}`;

          return (
            <Fragment key={`input_arg_${childKey}`}>
              {readInput(
                field,
                { ...config, inputKey: childKey },
                { prependLabel: field?.name }
              )}
            </Fragment>
          );
        })}
      </Section>
    );
  };

  // Renders a variant input component.
  const renderVariant = (arg: ScrapedItem, config: InputArgConfig) => {
    const { inputKey } = config;

    // Get the selected variant item, or fall back to first item otherwise.
    const selectedItem = getSelectedVariant(arg, inputKey, config);

    // Get all possible names of the variant.
    const itemNames = arg.variant.map(({ name }: { name: string }) => name);

    // Get the selected item fields, if any.
    const selectedItemFields = arg.variant.find(
      ({ name }: { name: string }) => name === selectedItem
    )?.fields;

    return (
      <>
        {/* Render variant select dropdown. */}
        {renderInput(arg, config, { indent: false }, itemNames)}

        {/* Render selected variant item's fields if they exist. */}
        {selectedItemFields && (
          <Section indent={true}>
            {selectedItemFields.map(
              (field: ScrapedFieldItem, index: number) => {
                const { typeName, ...rest } = field;
                const childKey = `${inputKey}_${index}`;

                return (
                  <Fragment key={`input_arg_${childKey}`}>
                    <h4 className="standalone">{typeName}</h4>
                    {readInput(rest, { ...config, inputKey: childKey })}
                  </Fragment>
                );
              }
            )}
          </Section>
        )}
      </>
    );
  };

  // Renders an input component wrapped in an input section.
  const renderInput = (
    arg: ScrapedItem,
    inputArgConfig: InputArgConfig,
    options?: {
      indent?: boolean;
      prependLabel?: string;
      overrideInput?: string;
    },
    values?: string[]
  ) => {
    const {
      indent = false,
      prependLabel = null,
      overrideInput = null,
    } = options || {};

    const {
      inputMeta,
      scraper,
      inputKey,
      namespace,
      activePallet,
      activeItem,
    } = inputArgConfig;

    const { indexKey } = arg;
    const typeClass = scraper.getClass(indexKey);

    // Group input and index key to store in input arg state.
    const keys = { inputKey, indexKey };

    // Determine input label.
    const label = !typeClass.label()
      ? undefined
      : `${prependLabel ? `${prependLabel} ` : ``}${typeClass.label()}`;

    // Get the input type.
    const input = overrideInput || typeClass.input();

    // Get the current input value.
    const inputArg = getInputArgAtKey(tabId, namespace, inputKey);
    const inputValue = inputArg?.value;

    // General `onRender` callback that registers input type with key.
    const onRender = (inputType: InputType) => {
      inputMeta[inputKey] = { inputType, indexKey };
    };

    // A unique identifier for the input component. Currently only used for account address inputs.
    const inputId = `${metaKey}_${namespace}_${activePallet}_${activeItem}_${inputKey}`;

    // General `onMount` callback that sets an initial value for an input.
    const onMount = <T,>(value: T) => {
      // Set initial input value.
      setInputArgAtKey(tabId, namespace, keys, value);
    };

    return (() => {
      switch (input) {
        // Input tailored for account addresses.
        case 'AccountId32':
          return (
            <AccountId32
              inputId={inputId}
              defaultAddress={inputValue}
              accounts={accounts}
              onMount={onMount}
              onRender={onRender}
              onChange={(val) => {
                setInputArgAtKey(tabId, namespace, keys, val);
              }}
            />
          );

        // A custom input for primitive hash and bytes types.
        case 'Hash':
        case 'Bytes':
          return (
            <Hash
              onMount={onMount}
              onRender={onRender}
              onChange={(val) => {
                setInputArgAtKey(tabId, namespace, keys, val);
              }}
              value={inputValue || defaultInputValue(input)}
            />
          );

        // A dropdown select input for multiple option enums.
        case 'select':
          return (
            <Section indent={indent}>
              <Select
                label={label}
                values={values || []}
                value={inputValue}
                onMount={onMount}
                onRender={onRender}
                onChange={(val) => {
                  // Child inputs changed - remove args.
                  resetInputArgsFromKey(
                    tabId,
                    inputArgConfig.namespace,
                    inputArgConfig.inputKey,
                    false
                  );
                  // Commit new input arg value.
                  setInputArgAtKey(tabId, inputArgConfig.namespace, keys, val);
                }}
              />
            </Section>
          );

        // A switch to toggle boolean inputs.
        case 'checkbox':
          return (
            <Section indent={indent}>
              <Checkbox
                onMount={onMount}
                onRender={onRender}
                onChange={(val) => {
                  setInputArgAtKey(tabId, namespace, keys, val);
                }}
                label={label}
                checked={inputValue || false}
              />
            </Section>
          );

        // Basic textbox input.
        case 'text':
        case 'number':
          return (
            <Section indent={indent}>
              <Textbox
                onMount={onMount}
                onRender={onRender}
                onChange={(val) => {
                  setInputArgAtKey(tabId, namespace, keys, val);
                }}
                label={label}
                value={inputValue || defaultInputValue(input)}
                numeric={input === 'number'}
              />
            </Section>
          );

        // No input provided due to invalid type or max depth reached.
        default:
          return null;
      }
    })();
  };

  // Gets a selected variant item, or falls back to the first variant.
  const getSelectedVariant = (
    arg: ScrapedItem,
    inputKey: string,
    { namespace }: InputArgConfig
  ) => {
    // Get the current variant value, if any.
    const currentInputValue = getInputArgAtKey(
      tabId,
      namespace,
      inputKey
    )?.value;

    // Fall back to the first variant if no value is set.
    return ![undefined, ''].includes(currentInputValue)
      ? currentInputValue
      : arg.variant[0].name;
  };

  // Record an input type to an input key.
  const addInputTypeAtKey = (
    inputMeta: InputMeta,
    inputKey: string,
    indexKey: string,
    inputType: InputType
  ) => {
    inputMeta[inputKey] = { inputType, indexKey };
  };

  return {
    readInput,
  };
};
