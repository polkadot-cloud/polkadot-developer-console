// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { RefObject } from 'react';
import { Fragment } from 'react';
import { Select } from 'library/Inputs/Select';
import { Section } from './Section';
import type { InputArgConfig } from './types';
import { Hash } from './Hash';
import { Checkbox } from './Checkbox';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';
import { useAccounts } from 'contexts/Accounts';
import { useChain } from '../Provider';
import { Textbox } from 'library/Inputs/Textbox';
import type { InputArg } from 'contexts/ChainUi/types';
import { arrayIsBytes, arrayIsPrimitive } from 'model/Scraper/Utils';
import { DefaultInputs } from 'model/Scraper/DefaultInputs';
import { Sequence } from './Sequence';

export const useInput = () => {
  const { chainSpec } = useChain();
  const { getAccounts } = useAccounts();
  const { tabId, metaKey } = useActiveTab();
  const { setInputArgAtKey, getInputArgAtKey } = useChainUi();

  const accounts = getAccounts(chainSpec);

  // Reads input and returns input components based on the input type. Called recursively for types
  // that host other types.
  const readInput = (
    arg: AnyJson,
    config: InputArgConfig,
    options?: {
      indent?: boolean;
      prependLabel?: string;
    }
  ) => {
    const indent = options?.indent || false;

    // Return early if no args are provided.
    if (!arg) {
      return null;
    }

    const { type } = arg.class;

    switch (type) {
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
        return renderSequence(arg, config);

      default:
        return null;
    }
  };

  // Renders an array input component.
  const renderArray = (arg: AnyJson, config: InputArgConfig) => {
    const label = arg.class.label();

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

    // Otherwise, allow sequence input.
    return renderSequence(arg, config, arg.class.array.len);
  };

  // Renders a sequence input component.
  const renderSequence = (
    arg: AnyJson,
    config: InputArgConfig,
    maxLength?: number
  ) => {
    const label = arg.sequence.class.label();
    const input = arg.class.input();

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
        <h4 className="marginTop">{`${label}[]`}</h4>
        <Sequence
          config={config}
          arrayInput={arg.sequence}
          maxLength={maxLength}
        />
      </Section>
    );
  };

  // Renders a compact input component.
  const renderCompact = (arg: AnyJson, config: InputArgConfig) => {
    const { compact } = arg;
    const { inputKey } = config;

    // Record this input type.
    addInputTypeAtKey(config.inputKeysRef, inputKey, 'Compact');

    // Render compact input.
    return (
      <Fragment key={`input_arg_${inputKey}_0`}>
        {readInput(compact, { ...config, inputKey: `${inputKey}_0` })}
      </Fragment>
    );
  };

  // Renders a tuple input component.
  const renderTuple = (arg: AnyJson, config: InputArgConfig) => {
    const { tuple } = arg;
    const { inputKey } = config;

    // Record this input type.
    addInputTypeAtKey(config.inputKeysRef, inputKey, 'Tuple');

    // Render tuple inputs.
    return (
      <Section indent={true}>
        {tuple.map((item: AnyJson, index: number) => (
          <Fragment key={`input_arg_${inputKey}_${index}`}>
            {readInput(item, { ...config, inputKey: `${inputKey}_${index}` })}
          </Fragment>
        ))}
      </Section>
    );
  };

  // Renders a composite input component.
  const renderComposite = (arg: AnyJson, config: InputArgConfig) => {
    const { inputKey } = config;
    const label = arg.class.label();
    const input = arg.class.input();

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
    addInputTypeAtKey(config.inputKeysRef, inputKey, 'Composite');

    // Render the composite fields.
    return (
      <Section indent={true}>
        {arg.composite.map((field: AnyJson, index: number) => {
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
  const renderVariant = (arg: AnyJson, config: InputArgConfig) => {
    const { inputKey } = config;

    // Get the selected variant item, or fall back to first item otherwise.
    const selectedItem = getSelectedVariant(arg, config);

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
            {selectedItemFields.map((field: AnyJson, index: number) => {
              const { typeName, ...rest } = field;
              const childKey = `${inputKey}_${index}`;

              return (
                <Fragment key={`input_arg_${childKey}`}>
                  <h4 className="standalone">{typeName}</h4>
                  {readInput(rest, { ...config, inputKey: childKey })}
                </Fragment>
              );
            })}
          </Section>
        )}
      </>
    );
  };

  // Renders an input component wrapped in an input section.
  const renderInput = (
    arg: AnyJson,
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

    const { inputKeysRef, inputKey, namespace, activePallet, activeItem } =
      inputArgConfig;

    const { indexKey } = arg.class;

    // Group input and index key to store in input arg state.
    const keys = { inputKey, indexKey };

    // Determine input label.
    const label = !arg.class.label()
      ? undefined
      : `${prependLabel ? `${prependLabel} ` : ``}${arg.class.label()}`;

    // Get the input type.
    const input = overrideInput || arg.class.input();

    // Get the current input value.
    const inputArg = getInputArgAtKey(tabId, namespace, inputKey);
    const inputValue = inputArg?.arg;

    // General `onRender` callback that registers input type with key.
    const onRender = (inputType: string) => {
      if (inputKeysRef.current) {
        inputKeysRef.current[inputKey] = inputType;
      }
    };

    return (() => {
      switch (input) {
        // Input tailored for account addresses.
        case 'AccountId32':
          return (
            <AccountId32
              uid={`${metaKey}_${namespace}_${activePallet}_${activeItem}_${inputKey}`}
              defaultAddress={inputValue}
              accounts={accounts}
              onMount={(selectedAddress) => {
                setInputArgAtKey(tabId, namespace, keys, selectedAddress);
              }}
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
              {...inputArgConfig}
              onMount={(value) => {
                setInputArgAtKey(tabId, namespace, keys, value);
              }}
              onRender={onRender}
              onChange={(val) => {
                setInputArgAtKey(tabId, namespace, keys, val);
              }}
              value={inputValue || DefaultInputs.defaultValue(input)}
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
                onMount={(value) => {
                  setInputArgAtKey(tabId, namespace, keys, value);
                }}
                onRender={onRender}
                onChange={(val) => {
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
                {...inputArgConfig}
                onMount={(value) => {
                  setInputArgAtKey(tabId, namespace, keys, value);
                }}
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
                onMount={(value) => {
                  setInputArgAtKey(tabId, namespace, keys, value);
                }}
                onRender={onRender}
                onChange={(val) => {
                  setInputArgAtKey(tabId, namespace, keys, val);
                }}
                label={label}
                value={inputValue || DefaultInputs.defaultValue(input)}
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
  const getSelectedVariant = (arg: AnyJson, { namespace }: InputArg) => {
    const { inputKey } = arg.class;

    // Get the current variant value, if any.
    const currentInputArg = getInputArgAtKey(tabId, namespace, inputKey)?.arg;

    // Fall back to the first variant if no value is set.
    return ![undefined, ''].includes(currentInputArg)
      ? currentInputArg
      : arg.variant[0].name;
  };

  // Record an input type to an input key.
  const addInputTypeAtKey = (
    inputKeysRef: RefObject<Record<string, string>>,
    inputKey: string,
    inputType: string
  ) => {
    if (inputKeysRef.current) {
      inputKeysRef.current[inputKey] = inputType;
    }
  };

  return {
    readInput,
  };
};
