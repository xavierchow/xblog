import { countWords, parseFrontMatter, debounce, howManyMinsReadForImage } from '../app/lib/utils';

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

describe('parseFrontMatter', () => {
  test('should parse date with ISOString', () => {
    const content = `---
title: Send HTTP requests with netcat
date: 2021-11-15 17:28:18
tags:
  - http
---
Body
`;
    const { data: fm } = parseFrontMatter(content);

    expect(fm.title).toBe('Send HTTP requests with netcat');
    expect(fm.date).toBe('2021-11-16');
  });
  test('should parse date with date only', () => {
    const content = `---
title: Foo
date: 2024-01-01
tags:
  - http
---
Body
`;
    const { data: fm } = parseFrontMatter(content);
    expect(fm.title).toBe('Foo');
    expect(fm.date).toBe('2024-01-01');
  });
  test('should parse tags to ensure it is list', () => {
    const content = `---
title: Foo
date: 2024-01-01
tags: bar
---
Body
`;
    const { data: fm } = parseFrontMatter(content);
    expect(fm.tags).toEqual(['bar']);
  });
});

describe('debounce', () => {
  test('should only execute once', () => {
    let count = 0;
    const fn = debounce(() => {
      count++;
      return;
    }, 2000);
    fn();
    fn();
    fn();
    expect(count).toBe(1);
  });
  test('should execute after duration', async () => {
    let count = 0;
    const fn = debounce(() => {
      count++;
      return;
    }, 1);
    fn();
    fn();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fn();
    expect(count).toBe(2);
  });
});

describe('howManyMinsReadForImage', () => {
  test('less than 10 images', () => {
    const mins = howManyMinsReadForImage(2);
    expect(mins).toBe(23);
  });
  test('5 images', () => {
    const mins = howManyMinsReadForImage(5);
    expect(mins).toBe(12 + 11 + 10 + 9 + 8);
  });
  test('15 images', () => {
    const mins = howManyMinsReadForImage(15);
    expect(mins).toBe(((12 + 3) * 10) / 2 + 5 * 3);
  });
});
