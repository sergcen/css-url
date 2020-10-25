import makeDir from 'make-dir';
import { promises as asyncFs } from 'fs';
import { getPathVariables, replacePathVariables, prepareDestination, copy, saveData } from './copy';

jest.mock('make-dir');
asyncFs.writeFile = jest.fn();
asyncFs.readFile = jest.fn().mockReturnValue('data');

describe('copy', () => {
    it('get path variables', () => {
        const variables = getPathVariables(
            '/some/path/[contenthash]/[name].some[ext]'
        );

        expect(variables).toEqual(['contenthash', 'name', 'ext']);
    });

    it('replace path variables', () => {
        const somePath = '/some/path/[contenthash]/[other]/[name].some[ext]';

        expect(
            replacePathVariables(somePath, {
                contenthash: 'sha256',
                name: 'index',
                ext: '.js',
                someVar: '2'
            })
        ).toEqual('/some/path/sha256/[other]/index.some.js');
    });

    it('prepareDestination', async () => {
        await prepareDestination('/some/path/[dir]/[name].js', { name: 'index', dir: 'my' });
        expect(makeDir).toHaveBeenCalledWith('/some/path/my');
    });

    it('copy', async () => {
        await copy('/some/path/sha256/index.some.js', '/some/[contenthash:20:sha512]/[name][ext]');
        expect(asyncFs.readFile).toHaveBeenLastCalledWith('/some/path/sha256/index.some.js');
        expect(makeDir).toHaveBeenLastCalledWith('/some/77c7ce9a5d86bb386d44');
        expect(asyncFs.writeFile).toHaveBeenLastCalledWith('/some/77c7ce9a5d86bb386d44/index.some.js', 'data');
    });

    it('saveData', async () => {
        await saveData('data saveAsset', '/some/[contenthash:20:sha512]/[name].some.js', { name: 'index' });
        expect(makeDir).toHaveBeenLastCalledWith('/some/d861b382485d32ab59d2');
        expect(asyncFs.writeFile).toHaveBeenLastCalledWith('/some/d861b382485d32ab59d2/index.some.js', 'data saveAsset');
    });
});
