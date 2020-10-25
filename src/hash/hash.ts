import * as crypto from 'crypto';
import * as xxh from 'xxhashjs';

const HEXBASE = 16;

export type THashAlg = 'xxhash32' | 'xxhash64' | string | undefined;

const getxxhash = (content: Buffer | string, method: THashAlg = 'xxhash32') => {
    const hashFunc = method === 'xxhash32' ? xxh.h32 : xxh.h64;
    const seed = 0;

    return hashFunc(seed).update(content).digest().toString(HEXBASE);
};

export const hash: (content: Buffer | string, alg?: THashAlg, shrink?: number | undefined) => string = (
    content,
    method = 'xxhash32',
    shrink = 8,
) => {
    let result;
    if (method === 'xxhash32' || method === 'xxhash64') {
        result = getxxhash(content, method);
    } else {
        const hashFunc = crypto.createHash(method || 'sha256');

        result = hashFunc.update(content).digest('hex');
    }

    return result.slice(0, shrink);
};
