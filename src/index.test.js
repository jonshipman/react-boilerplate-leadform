import * as tests from ".";

Object.keys(tests).forEach((key) => {
  describe(key, () => {
    it("is truthy", () => {
      expect(tests[key]).toBeTruthy();
    });
  });
});
