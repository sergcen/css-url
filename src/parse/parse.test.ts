import { parse, replace, parseAndReplace } from './parse';

const urls = [
    'url("one")',
    `url('two')`,
    `url(three)`,
    `url(/five)`,
    'url(#six)',
    'url(./some/path/1.svg)',
    'url(./some/path/1.png)',
    'url(./some/path/1.png#some-hash)',
    'url(./some/path/1.png?query=1)',
    `url('some/path/1.png?query=2#some-hash')`,
    `-filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='path/1.gif',sizingMethod=scale)`
]
const multiUrls = `${urls.join(', ')};`;

describe('parse css url', () => {
    it('parse base', () => {
        expect(parse(multiUrls)).toMatchSnapshot();
    });

    it('replace base', () => {
        expect(replace(multiUrls, (url) => url.replace('path', 'replaced-path'))).toMatchSnapshot();
    });

    it('parse and replace', () => {
        expect(parseAndReplace(multiUrls, (url) => url.replace('path', 'replaced-path'))).toMatchSnapshot();
    });
})
