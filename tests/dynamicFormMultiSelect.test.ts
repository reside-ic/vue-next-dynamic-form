import {shallowMount, mount} from "@vue/test-utils";
import {SelectControl} from "../src/types";
import TreeSelect from "vue3-treeselect";
import DynamicFormMultiSelect from "../src/DynamicFormMultiSelect.vue";

describe('Dynamic form multi-select component', function () {

    const fakeSelect: SelectControl = {
        name: "id_1",
        type: "multiselect",
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}],
    };

    it("renders treeselect with no value", () => {
        const rendered = shallowMount(DynamicFormMultiSelect, {
            propsData: {
                formControl: fakeSelect,
                selectText: "Select..."
            }
        });

        const treeSelect = rendered.find(TreeSelect);
        expect(treeSelect.props("value")).toStrictEqual([]);
        expect(treeSelect.props("options")).toStrictEqual(fakeSelect.options);
        expect(treeSelect.props("multiple")).toBe(true);
        expect(treeSelect.props("clearable")).toBe(false);
        expect(treeSelect.props("placeholder")).toBe("Select...");
    });

    it("renders treeselect with starting array value", () => {
        const rendered = shallowMount(DynamicFormMultiSelect, {
            props: {
                formControl: {...fakeSelect, value: ["opt2"]}
            }
        });

        const treeSelect = rendered.find(TreeSelect);
        expect(treeSelect.props("value")).toStrictEqual(["opt2"]);
        expect(treeSelect.props("options")).toStrictEqual(fakeSelect.options);
    });

    it("renders treeselect with string starting value", () => {
        const rendered = shallowMount(DynamicFormMultiSelect, {
            props: {
                formControl: {...fakeSelect, value: "opt2"}
            }
        });

        const treeSelect = rendered.find(TreeSelect);
        expect(treeSelect.props("value")).toStrictEqual(["opt2"]);
        expect(treeSelect.props("options")).toStrictEqual(fakeSelect.options);
    });


    it("initialises hidden input with value", () => {
        const rendered = shallowMount(DynamicFormMultiSelect, {
            props: {
                formControl: {...fakeSelect, value: ["opt2"]}
            }
        });

        expect((rendered.find("[name=id_1]").element as HTMLInputElement).value).toBe("opt2");
    });

    it("renders aria-label as groupLabel if no label given", () => {
        const rendered = mount(DynamicFormMultiSelect, {
            props: {
                formControl: fakeSelect,
                groupLabel: "groupLabel"
            }
        });
        expect(rendered.find(".vue-treeselect").attributes("aria-label")).toBe("groupLabel");
    });

    it("renders aria-label as control label if label given", () => {
        const rendered = mount(DynamicFormMultiSelect, {
            props: {
                formControl: {...fakeSelect, label: "controlLabel"},
                groupLabel: "groupLabel"
            }
        });
        expect(rendered.find(".vue-treeselect").attributes("aria-label")).toBe("controlLabel");
    });

});