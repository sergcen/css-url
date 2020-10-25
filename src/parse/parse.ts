import * as URL from 'url';

const URL_PATTERNS = [
    /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g,
    /(AlphaImageLoader\(\s*src=['"]?)([^"')]+)(["'])/g,
];

const getPatterns = (str: string) =>
    URL_PATTERNS.filter((pattern) => pattern.test(str));

export type TReplacerFN = (url: string, before: string, after: string) => string

export const parseAndReplace: (str: string, replacer?: TReplacerFN) => { parsedUrls: URL.Url[], resultUrls: URL.Url[], result: string } = (str, replacer) => {
    const patterns = getPatterns(str);
    const parsedUrls: string[] = [];
    const resultUrls: string[] = [];

    for (let pattern of patterns) {
        str = str.replace(pattern, (_, before, url, after) => {
            parsedUrls.push(url);

            if (replacer) {
                const replaced = replacer(url, before, after);
                resultUrls.push(replaced);

                return before + replaced + after;
            }
            return '';
        });
    }

    return {
        result: str,
        // https://github.com/nodejs/node/issues/12682
        resultUrls: resultUrls.map(url => URL.parse(url)),
        // https://github.com/nodejs/node/issues/12682
        parsedUrls: parsedUrls.map(url => URL.parse(url))
    }
};

export const parse: (str: string) => URL.Url[] = (str) => {
    return parseAndReplace(str).parsedUrls;
};

export const replace: (str: string, replacer: TReplacerFN) => string = (str, replacer) => {
    return parseAndReplace(str, replacer).result;
}
