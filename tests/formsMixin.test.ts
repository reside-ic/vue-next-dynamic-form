
import {useFormMixin} from "../src/FormsMixin";

test('it assess if value is empty', () => {
    const {valueIsEmpty} = useFormMixin()
    expect(valueIsEmpty([])).toStrictEqual(true);
    expect(valueIsEmpty(["text"])).toStrictEqual(false);
    expect(valueIsEmpty(false)).toStrictEqual(false);
    expect(valueIsEmpty(true)).toStrictEqual(false);
    expect(valueIsEmpty("text")).toStrictEqual(false);
    expect(valueIsEmpty(1)).toStrictEqual(false);
    expect(valueIsEmpty(0)).toStrictEqual(false);
    expect(valueIsEmpty('')).toStrictEqual(true);
    expect(valueIsEmpty(undefined)).toStrictEqual(true);
    expect(valueIsEmpty(null)).toStrictEqual(true);
  });