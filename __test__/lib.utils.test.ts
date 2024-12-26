import { countWords } from "../app/lib/utils";

describe("countWords", () => {
    test("should split words", () => {
        const content = "hello world";
        expect(countWords(content)).toBe(2);
    });
});
