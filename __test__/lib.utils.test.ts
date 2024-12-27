import { countWords } from '../app/lib/utils';

describe('countWords', () => {
    test('should split words', () => {
        const content = 'hello world';
        expect(countWords(content)).toEqual({
            words: 2,
        });
    });
    test('should take linebreak into account', () => {
        const content = 'hello world\nthe second line';
        expect(countWords(content)).toEqual({
            words: 5,
        });
    });
    test('should discard the whitespaces', () => {
        const content = 'hello world space  line      ';
        expect(countWords(content)).toEqual({
            words: 4,
        });
    });

    test('should return numbers of images', () => {
        const content = `Check the transposed list;
![img](https://user-images.githubusercontent.com/2748884/199040330-71c21c00-9c70-42b7-aa35-04f0772f7b37.png)`;

        expect(countWords(content)).toEqual({
            words: 4,
            images: 1,
        });
    });
    test('should return numbers of code blocks', () => {
        const content = 'the transposed list ```js \n this is js  \n ``` ';

        expect(countWords(content)).toEqual({
            words: 3,
            codes: 1,
        });
    });
    test('should recognize different languages', () => {
        const content =
            'the javascript code \
            ```js \
                function histogram(arr)  \
            ``` \
            then, the python code \
            ```python \
                this is python  \
            ``` ';

        expect(countWords(content)).toEqual({
            words: 7,
            codes: 2,
        });
    });
});
