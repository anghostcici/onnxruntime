// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
// We use "require" instead of "import" here because import statement must be put in top level. Our current code does
// not allow bundler to tree-shaking code as expected because some codes are treated as having side effects.
// So we import code inside the if-clause to allow bundler remove the code safely.

export * from 'onnxruntime-common';
import * as ort from 'onnxruntime-common';
export default ort;

import {registerBackend, env} from 'onnxruntime-common';
import {version} from './version';

if (!BUILD_DEFS.DISABLE_WEBGL) {
  const onnxjsBackend = require('./backend-onnxjs').onnxjsBackend;
  registerBackend('webgl', onnxjsBackend, -10);
}

if (!BUILD_DEFS.DISABLE_WASM) {
  const wasmBackend = BUILD_DEFS.DISABLE_TRAINING ? require('./backend-wasm-inference').wasmBackend :
                                                    require('./backend-wasm-training').wasmBackend;
  if (!BUILD_DEFS.DISABLE_WEBGPU) {
    registerBackend('webgpu', wasmBackend, 5);
  }
  registerBackend('cpu', wasmBackend, 10);
  registerBackend('wasm', wasmBackend, 10);
  if (BUILD_DEFS.DISABLE_TRAINING) {
    registerBackend('xnnpack', wasmBackend, 9);
    if (!BUILD_DEFS.DISABLE_WEBNN) {
      registerBackend('webnn', wasmBackend, 9);
    }
  }
}

Object.defineProperty(env.versions, 'web', {value: version, enumerable: true});
