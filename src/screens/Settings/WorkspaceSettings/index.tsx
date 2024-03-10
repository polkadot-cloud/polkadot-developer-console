// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import {
  SettingsSubmitWrapper,
  SettingsToggleWrapper,
} from '../TabSettings/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateLeft,
  faDownload,
  faFileImport,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { exportWorkspace, importWorkspace } from './Utils';
import { NotificationsController } from 'controllers/NotificationsController';
import { removeLocalStorageState } from 'IntegrityChecks/Local';
import { useNavigate } from 'react-router-dom';
import type { ChangeEvent } from 'react';

export const WorkspaceSettings = () => {
  const navigate = useNavigate();

  // Handle import of workspace file.
  const handleImportWorkspace = (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target?.files?.[0] || null;
    if (!file) {
      alert('No file selected');
      return;
    }

    if (file.type !== 'application/json') {
      alert('Invalid file type. Workspace file must be a JSON file.');
    }

    importWorkspace(file);
  };

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
          <input
            type="file"
            id="import-workspace"
            onChange={(ev) => handleImportWorkspace(ev)}
          />
          <label htmlFor="import-workspace">
            <FontAwesomeIcon icon={faFileImport} />
            Import Workspace
          </label>
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
                navigate('/');
                window.location.reload();
              }
            }}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
            Reset Workspace
          </button>
        </div>
      </SettingsSubmitWrapper>
    </>
  );
};
