# CSS-URL

Utils for work with assets and urls in css

Extracted from [postcss-url](https://github.com/postcss/postcss-url) core

## Encode

```js

import { encodeFile } from 'css-url';

(async () => {
    const encodedStr = await encodeFile('./some/file.svg');
    // data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'...

    const encodedBase64Str = await encodeFile('./some/file.png');
    // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQAAAAA3bvkkAAAAAnRSTlMAAHaTzTgAAAAKSURBVHgBY2AAAAACAAFzdQEYAAAAAElFTkSuQmCC"
})

```



## Parse

```js

import { parse, replace } from 'css-url';

const parsedUrls = parse(`url('./someurl'), url(./another/path/url?query=1), url("./doublequotes/hash")`);
// parsed URL object array

replace('url(./another/path/url?query=1)', (url, before, after) => url.replace('another', 'my'));
// 'url(./my/path/url?query=1)'

```

## Copy

```js

import { copy } from 'css-url';

(async () => {
    const copiedFilePath = await copy('./some/file.svg', '/new/dest/name-[contenthash][ext]');
    // '/new/dest/file-23cgsd7b.svg'
})

```