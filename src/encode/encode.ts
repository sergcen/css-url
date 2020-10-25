import { promises as asyncFs } from 'fs';
import * as mime from 'mime';
import svgToTinyDataUri from 'mini-svg-data-uri';
import FileType from 'file-type';

export type TEncodeType = 'auto' | 'base64' | 'svg' | undefined;

export const encodeSvg: (
    content: Buffer | string,
    optimized?: boolean
) => string = (content, optimized = true): string => {
    if (Buffer.isBuffer(content)) {
        content = content.toString('utf8');
    }

    return optimized
        ? /**
           * Optimize encoding SVG files (IE9+, Android 3+)
           * @see https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
           */
          svgToTinyDataUri(content)
        : `data:image/svg+xml,${encodeURIComponent(content)}`;
};

export const encodeBase64: (
    content: Buffer | string,
    mime: string
) => string = (content, mime) => {
    if (typeof content === 'string') {
        content = Buffer.from(content);
    }

    const dataMime = `data:${mime};base64`;

    return `${dataMime},${content.toString('base64')}`;
};

export const encode: (
    content: Buffer | string,
    mime?: FileType.MimeType | 'image/svg+xml' | string,
    encodeType?: TEncodeType,
    optimizeSvgEncode?: boolean,
) => string = (
    content,
    mime,
    encodeType = 'auto',
    optimizeSvgEncode = true,
) => {    
    if (!mime) {
        throw Error('Mime type not recognized');
    }

    if (encodeType === 'auto') {
        encodeType = mime === 'image/svg+xml' ? 'svg' : 'base64';
    }

    if (encodeType === 'base64') {
        return encodeBase64(content, mime);
    }

    return encodeSvg(content, optimizeSvgEncode);
};

export const encodeFile: (
    filePath: string,
    encodeType?: TEncodeType,
    optimizeSvgEncode?: boolean
) => Promise<string> = async (filePath, encodeType, optimizeSvgEncode) => {
    let fileMime: string | null | undefined = mime.getType(filePath);
    const fileContentBuffer = await asyncFs.readFile(filePath);

    if (!fileMime && Buffer.isBuffer(fileContentBuffer)) {
        fileMime = (await FileType.fromBuffer(fileContentBuffer))?.mime;
    }

    if (!fileMime) {
        throw Error(`Couldn\'t parse mime type from ${filePath}`);
    }


    return encode(fileContentBuffer, fileMime, encodeType, optimizeSvgEncode);
};
