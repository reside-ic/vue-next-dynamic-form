import { valueIsEmpty } from "../src/utils";

it("it assess if value is empty (or zero)", () => {
    expect(valueIsEmpty([])).toStrictEqual(true);
    expect(valueIsEmpty(["text"])).toStrictEqual(false);
    expect(valueIsEmpty(false)).toStrictEqual(false);
    expect(valueIsEmpty(true)).toStrictEqual(false);
    expect(valueIsEmpty("text")).toStrictEqual(false);
    expect(valueIsEmpty(1)).toStrictEqual(false);
    expect(valueIsEmpty(0)).toStrictEqual(true);
    expect(valueIsEmpty('')).toStrictEqual(true);
    expect(valueIsEmpty(undefined)).toStrictEqual(true);
    expect(valueIsEmpty(null)).toStrictEqual(true);
  });