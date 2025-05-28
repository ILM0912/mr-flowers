import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = NodeTextDecoder;
}

global.console.warn = () => {};
global.console.error = () => {};