import * as path from 'path';
import { promises as asyncFs } from 'fs';

import makeDir from 'make-dir';
import { hash } from '../hash/hash';

const REGEXP = /\[\\*([\w:]+)\\*\]/gi;

export type TPathVariables =
    | 'contenthash'
    | 'name'
    | 'base'
    | 'ext'
    | 'path'
    | string;

export const getPathVariables: (str: string) => string[] = (str) => {
    const result: string[] = [];

    str.replace(REGEXP, (_, key) => {
        result.push(key);

        return key;
    });

    return result;
};

export const replacePathVariables: (
    str: string,
    data: Record<string, string | number>
) => string = (str, data = {}) => {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        return str;
    }

    return str.replace(REGEXP, (_, key) => {
        return data[key] ? String(data[key]) : _;
    });
};

export type TPathVariablesData = Record<TPathVariables, string>;

export const makeDirForAsset = async (assetPath: string) => {
    const toDir = path.dirname(assetPath);

    await makeDir(toDir);
}

export const prepareDestination = async (
    to: string,
    variables: TPathVariablesData
) => {
    const toWithVariables = replacePathVariables(to, variables);

    const restVariables = getPathVariables(toWithVariables);

    if (restVariables.length) {
        throw Error(`Variables '${restVariables.join(', ')}' not defined in '${to}'`);
    }

    await makeDirForAsset(toWithVariables);

    return toWithVariables;
};

export const saveData:(
    data: string | Buffer,
    to: string,
    variables?: TPathVariablesData
) => Promise<string> = async (data, to, variables = {}) => {
    const variablesList = getPathVariables(to);
    const contentHashParams = variablesList.find(
        (key) => key.indexOf('contenthash') === 0
    );

    const variablesData: Record<TPathVariables, string> = { ...variables };

    if (contentHashParams) {
        const [_, shrink, alg] = contentHashParams.split(':');

        variablesData[contentHashParams] = hash(
            data,
            alg,
            shrink ? Number(shrink) : undefined
        );
    }

    const toWithVariables = await prepareDestination(to, variablesData);

    await asyncFs.writeFile(toWithVariables, data);

    return toWithVariables;
};

export const copy: (
    from: string,
    to: string,
    variables?: TPathVariablesData
) => Promise<string> = async (from, to, variables = {}) => {
    const variablesData: Record<TPathVariables, string> = {};
    const pathData = path.parse(from);

    variablesData.path = pathData.dir;
    variablesData.name = pathData.name;
    variablesData.ext = pathData.ext;
    variablesData.base = pathData.base;

    const allVariables = {
        ...variablesData,
        ...variables,
    };

    const fileBuffer = await asyncFs.readFile(from);

    return saveData(fileBuffer, to, allVariables);
};
