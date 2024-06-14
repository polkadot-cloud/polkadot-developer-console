// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Inputs } from 'model/Scraper/Inputs';
import type { AnyJson } from '@w3ux/types';
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
import { arrayIsPrimitive } from 'model/Scraper/Utils';

export const useInputNew = () => {
  const { chainSpec } = useChain();
  const { getAccounts } = useAccounts();
  const { tabId, metaKey } = useActiveTab();
  const { setInputArgAtKey, getInputArgsAtKey } = useChainUi();

  const accounts = getAccounts(chainSpec);

  // Reads input and returns input components based on the input type. Called recursively for types
  // that host other types.
  const readInputNew = (
    arg: AnyJson,
    config: InputArgConfig,
    options: {
      indent?: boolean;
      prependLabel?: string;
    } = {
      indent: false,
      prependLabel: '',
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

      // Revised up to here --------------------------------------------------------

      // TODO: render `compact` type.

      case 'sequence':
        // Render a hash input for a vec of bytes, otherwise render a sequence input.
        // return sequenceIsBytes(arg.class.label())
        //   ? renderLabelWithInner(
        //       'Bytes',
        //       renderInput({ ...arg, form: 'Bytes' }, config, indent)
        //     )
        //   : renderSequence(arg, config);
        break;

      default:
        return null;
    }
  };

  // Renders an array input component.
  const renderArray = (arg: AnyJson, config: InputArgConfig) => {
    const label = arg.class.label();
    const input = arg.class.input();

    // If array is a vector of bytes, render a hash input.
    if (input !== 'array') {
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

  // Renders a tuple input component.
  const renderTuple = (arg: AnyJson, config: InputArgConfig) => {
    const { tuple } = arg;
    const { inputKey } = config;

    // Record this input type.
    addInputTypeAtKey(config, 'Tuple');

    // Render tuple inputs.
    return (
      <Section indent={true}>
        {tuple.map((item: AnyJson, index: number) => {
          const childKey = `${inputKey}_${index}`;

          return (
            <Fragment key={`input_arg_${childKey}`}>
              {readInputNew(item, { ...config, inputKey: childKey })}
            </Fragment>
          );
        })}
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
    addInputTypeAtKey(config, 'Composite');

    // Render the composite fields.
    return (
      <Section indent={true}>
        {arg.composite.map((field: AnyJson, index: number) => {
          const childKey = `${inputKey}_${index}`;

          return (
            <Fragment key={`input_arg_${childKey}`}>
              <h4 className="standalone">{`${field?.name ? `${field.name}: ` : ''}${field.typeName}`}</h4>
              {readInputNew(
                field.type,
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
              const childKey = `${inputKey}_${index}`;

              return (
                <Fragment key={`input_arg_${childKey}`}>
                  <h4 className="standalone">{field.typeName}</h4>
                  {readInputNew(field.type, { ...config, inputKey: childKey })}
                </Fragment>
              );
            })}
          </Section>
        )}
      </>
    );
  };

  // Revised up to here --------------------------------------------------------

  // Renders an multi-input component.
  const renderSequence = (
    arg: InputArg,
    config: InputArgConfig,
    maxLength?: number
  ) => {
    console.debug(arg, config, maxLength);

    //   const [type, arrayInput]: [string, AnyJson] = Object.entries(
    //     input?.form || {}
    //   )?.[0] || [undefined, {}];
    //   // If this type does not exist, return early.
    //   if (type === undefined) {
    //     return null;
    //   }

    //   // Attach length to the array input.
    //   arrayInput.label = `[${arrayInput.label}, ${input.len}]`;
    //   return <Section>
    //     <h4 className="marginTop">{`${input.label}[]`}</h4>
    //     <Sequence
    //       {...inputArgConfig}
    //       type={type}
    //       arrayInput={arrayInput}
    //       maxLength={maxLength}
    //     />
    //    </Section>
    //   );
    return null;
  };

  // Renders a label with an inner input component.
  // const renderLabelWithInner = (
  //   label: string | number,
  //   innerInput: ReactNode
  // ) => (
  //   <Section>
  //     <h4 className="marginTop">{label}</h4>
  //     {innerInput}
  //   </Section>
  // );

  // Renders an input component wrapped in an input section.
  const renderInput = (
    arg: AnyJson,
    inputArgConfig: InputArgConfig,
    options: {
      indent?: boolean;
      prependLabel?: string;
      overrideInput?: string;
    },
    values?: string[]
  ) => {
    const indent = options.indent || false;
    const prependLabel = options.prependLabel || null;
    const overrideInput = options.overrideInput || null;

    const { inputKeysRef, inputKey, namespace, activePallet, activeItem } =
      inputArgConfig;

    const label = !arg.class.label()
      ? undefined
      : `${prependLabel ? `${prependLabel} ` : ``}${arg.class.label()}`;

    const input = overrideInput || arg.class.input();

    return (() => {
      switch (input) {
        // Input tailored for account addresses.
        case 'AccountId32':
          return (
            <AccountId32
              uid={`${metaKey}_${namespace}_${activePallet}_${activeItem}_${inputKey}`}
              defaultAddress={getInputArgsAtKey(tabId, namespace, inputKey)}
              accounts={accounts}
              onMount={(selectedAddress) => {
                setInputArgAtKey(tabId, namespace, inputKey, selectedAddress);
              }}
              onRender={(inputType) => {
                if (inputKeysRef.current) {
                  inputKeysRef.current[inputKey] = inputType;
                }
              }}
              onChange={(val) => {
                setInputArgAtKey(tabId, namespace, inputKey, val);
              }}
            />
          );

        // A custom input for primitive hash and bytes types.
        case 'Hash':
        case 'Bytes':
          return (
            <Hash
              {...inputArgConfig}
              value={
                getInputArgsAtKey(tabId, namespace, inputKey) ||
                Inputs.defaultValue(input)
              }
            />
          );

        // A dropdown select input for multiple option enums.
        case 'select':
          return (
            <Section indent={indent}>
              <Select
                label={label}
                values={values || []}
                value={getInputArgsAtKey(
                  tabId,
                  inputArgConfig.namespace,
                  inputArgConfig.inputKey
                )}
                onMount={(currentValue) => {
                  setInputArgAtKey(tabId, namespace, inputKey, currentValue);
                }}
                onRender={(inputType) => {
                  if (inputKeysRef.current) {
                    inputKeysRef.current[inputKey] = inputType;
                  }
                }}
                onChange={(val) => {
                  setInputArgAtKey(
                    tabId,
                    inputArgConfig.namespace,
                    inputArgConfig.inputKey,
                    val
                  );
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
                label={label}
                checked={getInputArgsAtKey(tabId, namespace, inputKey) || false}
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
                  setInputArgAtKey(tabId, namespace, inputKey, value);
                }}
                onRender={(inputType) => {
                  if (inputKeysRef.current) {
                    inputKeysRef.current[inputKey] = inputType;
                  }
                }}
                onChange={(val) => {
                  setInputArgAtKey(tabId, namespace, inputKey, val);
                }}
                label={label}
                value={
                  getInputArgsAtKey(tabId, namespace, inputKey) ||
                  Inputs.defaultValue(input)
                }
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

  // TODO: Move these to Scraper utils.

  // Check if a sequence is a vector of bytes.
  // const sequenceIsBytes = (label: string) =>
  //   // Assuming this is called within a sequence `type`, a standalone u8 label is a vector of bytes.
  //   label === 'u8' ||
  //   // NOTE: BoundedVec and WeakBoundedVec are untested.
  //   /Vec<.+>: u8/.test(label) ||
  //   /BoundedVec<.+>: u8/.test(label) ||
  //   /WeakBoundedVec<.+>: u8/.test(label);

  // ---

  // Checks if a variant is selected, or falls back to the first variant.
  const getSelectedVariant = (
    arg: AnyJson,
    { namespace, inputKey }: InputArg
  ) => {
    // Get the current variant value, if any.
    const currentInputArg = getInputArgsAtKey(tabId, namespace, inputKey);

    // Fall back to the first variant if no value is set.
    return ![undefined, ''].includes(currentInputArg)
      ? currentInputArg
      : arg.variant[0].name;
  };

  // Record an input type to an input key.
  const addInputTypeAtKey = (config: InputArgConfig, inputType: string) => {
    const { inputKey, inputKeysRef } = config;
    if (inputKeysRef.current) {
      inputKeysRef.current[inputKey] = inputType;
    }
  };

  // Formats an array label with its length.
  // const formatArrayLabel = (input: AnyJson) => {
  //   if (input?.form?.primitive) {
  //     return `[${input.form.primitive.label};${input.len}]`;
  //   }
  //   return input?.label || '';
  // };

  return {
    readInputNew,
  };
};
