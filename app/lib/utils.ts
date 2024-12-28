function isImage(str: string) {
  return str.startsWith('![img](');
}
type CountResult = {
  words: number;
  images?: number;
  codes?: number;
};
export function countWords(content: string) {
  // (?:regex) non-capture group
  // *? Lazy quantifier
  //const codeReg = /```(?:js|haskell|python|yaml|bash|vim)(?:.|\n)*?```/;
  const codeReg = /```(?:.|\n)*?```/;
  const wordsWithoutCodes = content.trim().split(codeReg);

  const codes = { length: wordsWithoutCodes.length - 1 };

  const re = /\s+|\n/;
  const words = wordsWithoutCodes.join(' ').trim().split(re);

  const images = words.filter(isImage);
  let result: CountResult = {
    words: words.length,
  };
  if (images.length > 0) {
    result = { words: words.length - images.length, images: images.length };
  }
  if (codes.length > 0) {
    result = { words: words.length, codes: codes.length };
  }
  return result;
}

export function howManyMinsRead(content: string) {
  const result = countWords(content);
  // 30s for code block
  const seconds4code = (result.codes || 0) * 30;
  const seconds4image = (result.images || 0) * 12; // TODO improve
  const seconds4words = Math.floor(result.words / 265) * 60;
  return Math.floor((seconds4code + seconds4image + seconds4words) / 60);
}
