
import {shallowMount} from "@vue/test-utils";
import FormsMixin from "../src/FormsMixin";

test('it assess if value is empty', () => {
    const wrapper = shallowMount(FormsMixin)
    const valueIsEmpty = wrapper.vm.valueIsEmpty
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