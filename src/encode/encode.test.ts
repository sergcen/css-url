import * as fs from 'fs';
import { encodeFile, encode } from './encode';
import * as path from 'path';

const fixturePath = (name: string) => {
    return path.join(__dirname, 'fixtures', name);
}

const SVG = fixturePath('encode-sample.svg');
const PNG = fixturePath('encode-sample.png');
const TXT = fixturePath('encode-text.txt');

describe('parse css url', () => {
    it('encode file', async () => {
        expect(await encodeFile(SVG)).toMatchSnapshot();
        expect(await encodeFile(PNG)).toMatchSnapshot();
    });

    it('encode svg without optimization', async () => {
        expect(await encodeFile(SVG, 'auto', false)).toMatchSnapshot();
    });

    it('encode', async () => {
        const fileBuffer = await fs.promises.readFile(PNG);

        expect(await encode(fileBuffer, 'image/png')).toMatchSnapshot();
    });

    it('encode (string content)', async () => {
        const fileStr = await fs.promises.readFile(TXT, 'utf-8');
        const fileBuffer = await fs.promises.readFile(TXT);

        expect(await encode(fileStr, 'image/png')).toEqual(await encode(fileBuffer, 'image/png'))
    });
});
