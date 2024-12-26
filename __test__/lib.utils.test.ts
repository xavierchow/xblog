import { countWords } from '../app/lib/utils';

describe('countWords', () => {
    test('should split words', () => {
        const content = 'hello world';
        expect(countWords(content)).toBe(2);
    });
    test('should not count linebreak', () => {
        const content = 'hello world\n the second line';
        expect(countWords(content)).toBe(5);
    });
});
