import {mount} from "@vue/test-utils";
import DynamicFormSelect from "../src/DynamicFormSelect.vue";
import {SelectControl} from "../src/types";
import TreeSelect from "@reside-ic/vue3-treeselect";

describe('Dynamic form select component', function () {

    const fakeSelect: SelectControl = {
        name: "id_2",
        type: "select",
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}],
    };

    it("renders options and as expected", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: fakeSelect,
                selectText: 'Select...'
            }
        });
        const formOptions = (rendered.vm as any).formOptions;
        expect(formOptions.length).toBe(3)
        expect(formOptions[1].id).toBe("opt1");
        expect(formOptions[0].label).toBe("Select...");
        expect(formOptions[1].label).toBe("option 1");
        expect(rendered.findComponent(TreeSelect).props("options")).toStrictEqual(formOptions);
        expect(rendered.findComponent(TreeSelect).props("modelValue")).toBe("");
        expect(rendered.findComponent(TreeSelect).props("multiple")).toBe(false);
        expect(rendered.findComponent(TreeSelect).props("clearable")).toBe(false);
    });

    it("value is selected if present", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, value: "opt2"}
            }
        });

        const select = rendered.findComponent(TreeSelect);
        expect(select.props("modelValue")).toBe("opt2");
    });

    it("emits update event with updated formControl when underlying select is changed", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect}
            }
        });

        rendered.findComponent(TreeSelect).vm.$emit("update:modelValue", "");
        expect(rendered.emitted("update:formControl")![0][0]).toStrictEqual({...fakeSelect, value: ""});
    });

    it("default message is selected if no value present", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: fakeSelect
            }
        });

        const select = rendered.findComponent(TreeSelect);
        expect(select.props("modelValue")).toBe("");
    });

    it("first value is selected if excludeNullOption", async () => {
        const formControl = {...fakeSelect, excludeNullOption: true};
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl
            }
        });
        const options = (rendered.vm as any).formOptions;
        expect(options.length).toBe(2);
        expect(options[0].id).toBe("opt1");
        expect(options[0].label).toBe("option 1");

        expect(rendered.emitted("update:formControl")).toBeTruthy();
        expect(rendered.emitted("update:formControl")![0][0]).toEqual({...formControl, value: "opt1"});
    });

    it("is required if formControl.required is true", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, required: true}
            }
        });

        const select = rendered.findComponent(TreeSelect);
        expect(select.props("required")).toBe(true);
    });

    it("is not required if formControl.required is false", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, required: false}
            }
        });

        const select = rendered.findComponent(TreeSelect);
        expect(select.props("required")).toBe(false);
    });

    it("renders aria-label as groupLabel if no label given", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: fakeSelect,
                groupLabel: "groupLabel"
            }
        });
        expect(rendered.findComponent(TreeSelect).attributes("aria-label")).toBe("groupLabel");
    });

    it("renders aria-label as control label if label given", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, label: "controlLabel"},
                groupLabel: "groupLabel"
            }
        });
        expect(rendered.findComponent(TreeSelect).attributes("aria-label")).toBe("controlLabel");
    });

});
