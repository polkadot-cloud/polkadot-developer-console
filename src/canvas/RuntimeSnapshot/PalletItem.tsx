// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CanvasSubheading, RuntimeItemWrapper } from 'canvas/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PalletItemScraped } from 'model/Scraper/types';
import { Fragment, useRef, useState } from 'react';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import type { Sync } from '@w3ux/types';
import { EmptyItem } from './EmptyItem';
import { getMotionProps } from './Utils';
import type { PalletItemProps } from './types';
import { Subheading } from './Subheading';

export const PalletItem = ({ pallet, scraper }: PalletItemProps) => {
  const { name } = pallet;

  // Store whether pallet is expanded.
  const [palletExpanded, setPalletExpanded] = useState(false);

  // Store whether storage items are expaneded.
  const [storageItemsExpanded, setStorageItemsExpanded] = useState(false);

  // Store whether pallet constants are expaneded.
  const [constantsExpanded, setConstantsExpanded] = useState(false);

  // Store whether pallet errors are expaneded.
  const [errorsExpanded, setErrorsExpanded] = useState(false);

  // Store whether pallet events are expaneded.
  const [eventsExpanded, setEventsExpanded] = useState(false);

  // Store whether pallet calls are expaneded.
  const [callsExpanded, setCallsExpanded] = useState(false);

  // Store the storage items for the pallet. Lazily populated when user expands.
  const [storageItems, setStorageItems] = useState<PalletItemScraped[]>();
  const fetchingStorageRef = useRef<Sync>('unsynced');

  // Store the constants for the pallet. Lazily populated when user expands.
  const [constants, setConstants] = useState<PalletItemScraped[]>();
  const fetchingConstantsRef = useRef<Sync>('unsynced');

  // Store the errors for the pallet. Lazily populated when user expands.
  const [errors, setErrors] = useState<PalletItemScraped[]>();
  const fetchingErrorsRef = useRef<Sync>('unsynced');

  // Store the events for the pallet. Lazily populated when user expands.
  const [events, setEvents] = useState<PalletItemScraped[]>();
  const fetchingEventsRef = useRef<Sync>('unsynced');

  // Store the calls for the pallet. Lazily populated when user expands.
  const [calls, setCalls] = useState<PalletItemScraped[]>();
  const fetchingCallsRef = useRef<Sync>('unsynced');

  // Get storage items for the active pallet..
  const getStorageItems = async () => {
    if (fetchingStorageRef.current !== 'unsynced') {
      return;
    }
    fetchingStorageRef.current = 'syncing';
    const result = name ? scraper.getStorage(name) : [];
    fetchingStorageRef.current = 'synced';
    setStorageItems(result);
  };

  // Get pallet constants for the active pallet.
  const getConstants = async () => {
    if (fetchingConstantsRef.current !== 'unsynced') {
      return;
    }
    fetchingConstantsRef.current = 'syncing';
    const result = name ? scraper.getConstants(name) : [];
    fetchingConstantsRef.current = 'synced';
    setConstants(result);
  };

  // Get error items for the active pallet..
  const getErrors = async () => {
    if (fetchingErrorsRef.current !== 'unsynced') {
      return;
    }
    fetchingErrorsRef.current = 'syncing';
    const result = name ? scraper.getErrors(name) : [];
    fetchingErrorsRef.current = 'synced';
    setErrors(result);
  };

  // Get event items for the active pallet..
  const getEvents = async () => {
    if (fetchingEventsRef.current !== 'unsynced') {
      return;
    }
    fetchingEventsRef.current = 'syncing';
    const result = name ? scraper.getEvents(name) : [];
    fetchingEventsRef.current = 'synced';
    setEvents(result);
  };

  // Get call items for the active pallet.
  const getCalls = async () => {
    if (fetchingCallsRef.current !== 'unsynced') {
      return;
    }
    fetchingCallsRef.current = 'syncing';
    const result = name ? scraper.getCalls(name) : [];
    fetchingCallsRef.current = 'synced';
    setCalls(result);
  };

  return (
    <>
      <CanvasSubheading>
        <span>
          <FontAwesomeIcon
            icon={palletExpanded ? faChevronDown : faChevronRight}
            transform="shrink-6"
          />
        </span>
        <button
          type="button"
          onClick={() => setPalletExpanded(!palletExpanded)}
        >
          {name}
        </button>
      </CanvasSubheading>

      {/* Storage items. */}
      <motion.div {...getMotionProps(palletExpanded)}>
        <Subheading
          text="Storage Items"
          expanded={storageItemsExpanded}
          setExpanded={setStorageItemsExpanded}
          getter={getStorageItems}
        />
        <motion.div {...getMotionProps(storageItemsExpanded)}>
          {!storageItems ? (
            <EmptyItem text="Fetching..." />
          ) : storageItems.length === 0 ? (
            <EmptyItem text="This pallet has no storage items defined." />
          ) : (
            storageItems.map(({ name: storageName, docs: storageDocs }) => (
              <Fragment key={`${pallet}_storage_item_${storageName}`}>
                <RuntimeItemWrapper>
                  <h4>{storageName}</h4>
                  {storageDocs?.[0] && <h5>{storageDocs[0]}</h5>}
                </RuntimeItemWrapper>
              </Fragment>
            ))
          )}
        </motion.div>
        {/* Constants. */}
        <Subheading
          text="Constants"
          expanded={constantsExpanded}
          setExpanded={setConstantsExpanded}
          getter={getConstants}
        />
        <motion.div {...getMotionProps(constantsExpanded)}>
          {!constants ? (
            <EmptyItem text="Fetching..." />
          ) : constants.length === 0 ? (
            <EmptyItem text="This pallet has no runtime constants defined." />
          ) : (
            constants.map(({ name: constantName, docs: constantDocs }) => (
              <Fragment key={`${pallet}_constant_${constantName}`}>
                <RuntimeItemWrapper>
                  <h4>{constantName}</h4>
                  {constantDocs?.[0] && <h5>{constantDocs[0]}</h5>}
                </RuntimeItemWrapper>
              </Fragment>
            ))
          )}
        </motion.div>
        {/* Errors. */}
        <Subheading
          text="Errors"
          expanded={errorsExpanded}
          setExpanded={setErrorsExpanded}
          getter={getErrors}
        />
        <motion.div {...getMotionProps(errorsExpanded)}>
          {!errors ? (
            <EmptyItem text="Fetching..." />
          ) : errors.length === 0 ? (
            <EmptyItem text="This pallet has no errors defined." />
          ) : (
            errors.map(({ name: errorName, docs: errorDocs }) => (
              <Fragment key={`${pallet}_error_${errorName}`}>
                <RuntimeItemWrapper>
                  <h4>{errorName}</h4>
                  {errorDocs?.[0] && <h5>{errorDocs[0]}</h5>}
                </RuntimeItemWrapper>
              </Fragment>
            ))
          )}
        </motion.div>
        {/* Events. */}
        <Subheading
          text="Events"
          expanded={eventsExpanded}
          setExpanded={setEventsExpanded}
          getter={getEvents}
        />
        <motion.div {...getMotionProps(eventsExpanded)}>
          {!events ? (
            <EmptyItem text="Fetching..." />
          ) : events.length === 0 ? (
            <EmptyItem text="This pallet has no events defined." />
          ) : (
            events.map(({ name: eventName, docs: eventDocs }) => (
              <Fragment key={`${pallet}_event_${eventName}`}>
                <RuntimeItemWrapper>
                  <h4>{eventName}</h4>
                  {eventDocs?.[0] && <h5>{eventDocs[0]}</h5>}
                </RuntimeItemWrapper>
              </Fragment>
            ))
          )}
        </motion.div>
        {/* Calls. */}
        <Subheading
          text="Calls"
          expanded={callsExpanded}
          setExpanded={setCallsExpanded}
          getter={getCalls}
        />
        <motion.div {...getMotionProps(callsExpanded)}>
          {!calls ? (
            <EmptyItem text="Fetching..." />
          ) : calls.length === 0 ? (
            <EmptyItem text="This pallet has no calls defined." />
          ) : (
            calls.map(({ name: callName, docs: callDocs }) => (
              <Fragment key={`${pallet}_call_${callName}`}>
                <RuntimeItemWrapper>
                  <h4>{callName}</h4>
                  {callDocs?.[0] && <h5>{callDocs[0]}</h5>}
                </RuntimeItemWrapper>
              </Fragment>
            ))
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
