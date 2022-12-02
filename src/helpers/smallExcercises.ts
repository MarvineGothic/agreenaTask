import fs from "fs";

export const transformArrayOfStrings = (array: any[]) => {
  return array.map((element) => {
    if (typeof element === "string") {
      const parsed = parseFloat(element);
      if (!isNaN(parsed)) {
        return parsed;
      }
      return element;
    }
  });
}

export const arrayOfCsvFiles = (dirPath: string) => {
  return fs.readdirSync(dirPath).filter((fileName) => {
    if (fileName.includes(".csv")) {
      return fileName;
    }
  });
}

export const isStringContainsDigit = (str: string) => {
  return /\d/.test(str);
}
