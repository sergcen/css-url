import { hash } from './hash';

describe('hash', () => {
    it.only('base', () => {
        expect(hash('some content str')).toMatchSnapshot();
        expect(hash('some content str', 'xxhash32', 10)).toMatchSnapshot();
        expect(hash('some content str', 'xxhash64', 100)).toMatchSnapshot();
        expect(hash('some content str', 'sha512', 20)).toMatchSnapshot();
        expect(hash(Buffer.from('some content str'))).toMatchSnapshot();
    });
})
