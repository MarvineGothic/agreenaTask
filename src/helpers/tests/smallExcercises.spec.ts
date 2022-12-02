import { arrayOfCsvFiles, isStringContainsDigit, transformArrayOfStrings } from "helpers/smallExcercises";

describe(("Small code excercises"), () => {
  it(("transformArrayOfStrings"), () => {
    const result = transformArrayOfStrings(["super", "20.5", "test", "23", 50, 20.78]);
    expect(result).toEqual(["super", 20.5, "test", 23]);
  });

  it(("arrayOfCsvFiles"), () => {
    const result = arrayOfCsvFiles("./files");
    expect(result).toEqual(["export.csv", "import.csv"])
  })

  it.each([
    ["should contain digit", { str: "test-string23", result: true }],
    ["should not contain digit", { str: "test-string", result: false }]
  ])("%s", (_, payload) => {
    expect(isStringContainsDigit(payload.str)).toEqual(payload.result);
  });
});
