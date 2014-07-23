// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Provides the keyring backup UI.
 */

goog.provide('e2e.ext.ui.dialogs.BackupKey');

goog.require('e2e.error.InvalidArgumentsError');
goog.require('e2e.ext.actions.Executor');
goog.require('e2e.ext.constants.Actions');
goog.require('e2e.ext.ui.dialogs.Overlay');
goog.require('goog.array');
goog.require('goog.crypt.base64');

goog.scope(function() {
var constants = e2e.ext.constants;
var dialogs = e2e.ext.ui.dialogs;
var templates = e2e.ext.ui.templates.dialogs.backupkey;



/**
 * Constructor for the full version of the keyring management UI.
 * @constructor
 * @extends {e2e.ext.ui.dialogs.Overlay}
 */
dialogs.BackupKey = function() {
  goog.base(this);
};
goog.inherits(dialogs.BackupKey, dialogs.Overlay);


/** @override */
dialogs.BackupKey.prototype.createDom = function() {
  goog.base(this, 'createDom');
  this.decorateInternal(this.getElement());
};


/** @override */
dialogs.BackupKey.prototype.decorateInternal = function(elem) {
  goog.base(this, 'decorateInternal', elem);
  this.setTitle(chrome.i18n.getMessage('keyMgmtBackupKeyringLabel'));
  new e2e.ext.actions.Executor().execute({
    action: constants.Actions.GET_KEYRING_BACKUP_DATA,
    content: ''
  }, this, goog.bind(function(data) {
    if (data.count % 2) {
      throw new e2e.error.InvalidArgumentsError('Odd number of keys');
    }

    this.setContent(goog.crypt.base64.encodeByteArray(
        // count / 2 since we store the number of key PAIRS
        goog.array.concat([data.count / 2 & 0x7F], data.seed)));
  }, this));
};

}); // goog.scope
