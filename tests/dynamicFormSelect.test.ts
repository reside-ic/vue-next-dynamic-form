import {mount} from "@vue/test-utils";
import DynamicFormSelect from "../src/DynamicFormSelect.vue";
import {SelectControl} from "../src/types";

describe('Dynamic form select component', function () {

    const fakeSelect: SelectControl = {
        name: "id_2",
        type: "select",
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}],
    };

    it("renders options", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: fakeSelect,
                selectText: 'Select...'
            }
        });
        const options = rendered.findAll("option");
        expect(options.length).toBe(3);
        expect((options[1].element as HTMLOptionElement).value).toBe("opt1");
        expect(options[0].text()).toBe("Select...");
        expect(options[1].text()).toBe("option 1");
    });

    it("value is selected if present", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, value: "opt2"}
            }
        });

        const select = rendered.find("select");
        expect((select.element as HTMLSelectElement).value).toBe("opt2");
    });

    it("emits update event with updated formControl when underlying select is changed", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect}
            }
        });

        rendered.find("select").trigger("change");
        expect(rendered.emitted("update:formControl")![0][0]).toStrictEqual({...fakeSelect, value: ""});
    });

    it("default message is selected if no value present", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: fakeSelect
            }
        });

        const select = rendered.find("select");
        expect((select.element as HTMLSelectElement).value).toBe("");
    });

    it("first value is selected if excludeNullOption", async () => {
        const formControl = {...fakeSelect, excludeNullOption: true};
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl
            }
        });
        const options = rendered.findAll("option");
        expect(options.length).toBe(2);
        expect((options[0].element as HTMLOptionElement).value).toBe("opt1");
        expect(options[0].text()).toBe("option 1");

        expect(rendered.emitted("update:formControl")).toBeTruthy();
        expect(rendered.emitted("update:formControl")![0][0]).toEqual({...formControl, value: "opt1"});
    });

    it("is required if formControl.required is true", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, required: true}
            }
        });

        const select = rendered.find("select");
        expect((select.element as HTMLSelectElement).required).toBe(true);
    });

    it("is not required if formControl.required is false", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, required: false}
            }
        });

        const select = rendered.find("select");
        expect((select.element as HTMLSelectElement).required).toBe(false);
    });

    it("renders aria-label as groupLabel if no label given", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: fakeSelect,
                groupLabel: "groupLabel"
            }
        });
        expect(rendered.find("select").attributes("aria-label")).toBe("groupLabel");
    });

    it("renders aria-label as control label if label given", () => {
        const rendered = mount(DynamicFormSelect, {
            props: {
                formControl: {...fakeSelect, label: "controlLabel"},
                groupLabel: "groupLabel"
            }
        });
        expect(rendered.find("select").attributes("aria-label")).toBe("controlLabel");
    });

});
