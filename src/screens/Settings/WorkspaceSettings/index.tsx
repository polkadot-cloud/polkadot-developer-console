// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import {
  SettingsSubmitWrapper,
  SettingsToggleWrapper,
} from '../TabSettings/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faFileImport,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useMenu } from 'contexts/Menu';
import { InDevelopment } from 'library/HelpMenu/InDevelopment';
import { exportWorkspace } from './Utils';
import { NotificationsController } from 'controllers/NotificationsController';
import { removeLocalStorageState } from 'IntegrityChecks/Local';

export const WorkspaceSettings = () => {
  const { openMenu } = useMenu();

  return (
    <>
      <SettingsHeaderWrapper>
        <h2>Workspace Settings</h2>
      </SettingsHeaderWrapper>

      <SettingsToggleWrapper>
        <div className="text">
          <h4>Export Workspace</h4>
          <h3>
            Back up your current workspace state. Exports your tabs, tags, chain
            search, and active page settings.
          </h3>
        </div>
      </SettingsToggleWrapper>

      <SettingsSubmitWrapper>
        <div className="buttons">
          <button
            onClick={() => {
              if (!exportWorkspace()) {
                NotificationsController.emit({
                  title: 'Export Failed',
                  subtitle: 'There was an issue exporting your workspace.',
                });
              }
            }}
          >
            <FontAwesomeIcon icon={faDownload} />
            Export Workspace
          </button>
        </div>
      </SettingsSubmitWrapper>

      <SettingsToggleWrapper>
        <div className="text">
          <h4>Import Workspace</h4>
          <h3 className="danger">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            &nbsp; Importing a workspace will replace your current workspace -
            all current state, including your current tabs and custom tag
            settings, will be lost. Export your workspace first if you wish to
            restore it later.
          </h3>
        </div>
      </SettingsToggleWrapper>

      <SettingsSubmitWrapper>
        <div className="buttons">
          <button
            onClick={(ev) => openMenu(ev, <InDevelopment />, { size: 'large' })}
          >
            <FontAwesomeIcon icon={faFileImport} />
            Import Workspace
          </button>
        </div>
      </SettingsSubmitWrapper>

      <SettingsToggleWrapper>
        <div className="text">
          <h4>Reset Workspace</h4>
          <h3 className="danger">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            &nbsp; Your workspace will be reset. Export your current workspace
            first if you wish to restore it later.
          </h3>
        </div>
      </SettingsToggleWrapper>

      <SettingsSubmitWrapper>
        <div className="buttons">
          <button
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to reset your workspace? Confirming will reload the console.'
                )
              ) {
                removeLocalStorageState(true);
                window.location.href = '/';
              }
            }}
          >
            <FontAwesomeIcon icon={faFileImport} />
            Reset Workspace
          </button>
        </div>
      </SettingsSubmitWrapper>
    </>
  );
};
