import {useForm, checkOptionsValid} from "../src/utils";
import {DynamicFormMeta, MultiSelectControl, NumberControl, SelectControl} from "../src/types";
import {mount} from "@vue/test-utils";
import DynamicFormControl from "../src/DynamicFormControl.vue";
import {Control, DynamicControlSection} from "../index";

const fakeNumber = (value: any) => {
    return {
        label: "Number label",
        name: "id_1",
        type: "number",
        value: value,
        required: false
    } as NumberControl
};

const fakeSelect = (value: any) => {
    return {
        name: "id_2",
        type: "select",
        value: value,
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}]
    } as SelectControl
};

const fakeMultiSelect = (value: any) => {
    return {
        name: "id_3",
        type: "multiselect",
        value: value,
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}]
    } as MultiSelectControl
};

const fakeNestedSelect = (value: any) => {
    return {
        name: "i1",
        required: true,
        type: "select",
        value: value,
        options: [{id: "opt1", label: "l1", children: [{id: "opt2", label: "l2"}]}]
    } as SelectControl
}

const getForm = (controls: Control[]) => {
    return {
        controlSections: [{
            label: "Test 1",
            controlGroups: [{
                label: "Group 1",
                controls: controls
            }]
        }]
    } as DynamicFormMeta
};

test('it assess if value is empty', () => {
    const {valueIsEmpty} = useForm()
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

test('can check if options are valid', () => {
    const validSelect = fakeSelect("opt1")
    const validMultiSelect = fakeMultiSelect(["opt1", "opt2"])
    const validFormMeta = getForm([fakeNumber(2), validSelect, validMultiSelect])
    expect(checkOptionsValid(validFormMeta)).toStrictEqual(true);

    const invalidSelect = fakeSelect("opt3")
    const invalidMultiSelect = fakeMultiSelect(["opt3", "opt2"])
    const invalidFormMeta = getForm([fakeNumber(2), invalidSelect, invalidMultiSelect])

    expect(checkOptionsValid(invalidFormMeta)).toStrictEqual(false);

    const validNestedSelect = fakeMultiSelect("opt2")
    const nestedFormMeta = getForm([fakeNumber(2), validSelect, validNestedSelect])

    expect(checkOptionsValid(nestedFormMeta)).toStrictEqual(true);

    const invalidNestedSelect = fakeMultiSelect("opt3")
    const invalidNestedFormMeta = getForm(
        [fakeNumber(2), validSelect, invalidNestedSelect])

    expect(checkOptionsValid(invalidNestedFormMeta)).toStrictEqual(false);
})
