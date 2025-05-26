import '@testing-library/jest-dom';
import { Request, Response, Headers } from 'node-fetch-commonjs';
import { TextDecoder, TextEncoder } from 'util';

global.Request = Request as any;
global.Response = Response as any;
global.Headers = Headers as any;

global.TextDecoder = TextDecoder as any;
global.TextEncoder = TextEncoder as any;
