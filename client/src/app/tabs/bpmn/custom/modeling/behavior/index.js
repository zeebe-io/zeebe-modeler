/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import CreateZeebeBoundaryEventBehavior from './CreateZeebeBoundaryEventBehavior';

export default {
  __init__: [
    'createZeebeBoundaryEventBehavior'
  ],
  createZeebeBoundaryEventBehavior: [ 'type', CreateZeebeBoundaryEventBehavior ]
};
