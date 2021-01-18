import {shallowMount, mount, Wrapper} from "@vue/test-utils";
import {BCol} from "bootstrap-vue";
import DynamicFormControlGroup from "../src/DynamicFormControlGroup.vue";
import DynamicFormControl from "../src/DynamicFormControl.vue";
import {VTooltip} from 'v-tooltip';
import {DynamicControlGroup, NumberControl, SelectControl} from "../src/types";
import Vue from "vue";

const tooltipSpy = jest.spyOn(VTooltip, "bind");

describe('Dynamic form control group component', function () {

    const fakeFormGroup: DynamicControlGroup = {
        label: "Test 1",
        controls: [
            {
                name: "id_1",
                type: "number",
                required: true
            } as NumberControl,
            {
                name: "id_2",
                type: "select",
                required: true
            } as SelectControl
        ]
    };

    const fakeFormGroup2: DynamicControlGroup = {
        label: "Test 1",
        controls: [
            {
                name: "id_1",
                type: "number",
                required: true
            } as NumberControl
        ]
    };

    const fakeFormGroup3: DynamicControlGroup = {
        label: "Test 1",
        controls: [
            {
                name: "id_1",
                value: 123,
                type: "number",
                required: true
            } as NumberControl
        ]
    };

    const getWrapper = (controlGroup: any, mount: (component: any, options: any) => Wrapper<Vue>) => {
        return mount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: controlGroup,
                requiredText: 'compulsory',
                selectText: 'Select'
            }
        });
    };

    it("renders label if it exists", () => {
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: fakeFormGroup
            }
        });

        const labelCol = rendered.find("label");
        expect(labelCol.text()).toBe("Test 1");
        expect(labelCol.classes()).toStrictEqual(["col-form-label", "col-md-5"]);
    });

    it("does not render label col if there is no label", () => {
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: {...fakeFormGroup, label: null}
            }
        });

        expect(rendered.findAll(BCol).length).toBe(0);
    });

    it("renders required indicator if input is required and sets text-danger class if no value given", () => {
        const rendered = getWrapper({...fakeFormGroup2}, shallowMount);
        expect(rendered.find("label").find("span").text()).toBe("(compulsory)");
        expect(rendered.find("label").find("span").attributes("class")).toBe("small text-danger");
    });

    it("renders required indicator if input is required and removes set text-danger class if value given", () => {
        const rendered = getWrapper({...fakeFormGroup3}, shallowMount);
        expect(rendered.find("label").find("span").text()).toBe("(compulsory)");
        expect(rendered.find("label").find("span").attributes("class")).toBe("small");
    });

    it("renders tooltip with help text if only one control exists", () => {
        const fakeGroup = {...fakeFormGroup, controls: [{...fakeFormGroup.controls[0]}]};
        fakeGroup.controls[0].helpText = "Some help text";
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: fakeGroup
            }
        });

        expect(rendered.find("label").find("span").classes()).toContain("has-tooltip");
        expect(tooltipSpy).toHaveBeenCalled();
        expect((tooltipSpy.mock.calls[0][1] as any).value).toBe("Some help text")
    });

    it("renders controls", () => {
        const controlGroup = {...fakeFormGroup};
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: controlGroup,
                selectText: "Select",
                requiredText: "compulsory"
            }
        });

        expect(rendered.findAll(DynamicFormControl).length).toBe(2);
        expect(rendered.findAll(DynamicFormControl).at(0).props("formControl"))
            .toStrictEqual(controlGroup.controls[0]);
        expect(rendered.findAll(DynamicFormControl).at(0).props("selectText")).toBe("Select");
        expect(rendered.findAll(DynamicFormControl).at(0).props("requiredText")).toBe("compulsory");
    });

    it("emits change event when a control changes", () => {
        const controlGroup = {...fakeFormGroup};
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: controlGroup
            }
        });

        rendered.findAll(DynamicFormControl).at(0)
            .vm.$emit("change", {...controlGroup.controls[0], value: 123});

        expect((rendered.emitted().change[0][0] as DynamicControlGroup)
            .controls[0].value).toBe(123);
    });


    it("double controls are 3 cols", () => {
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: fakeFormGroup
            }
        });

        expect(rendered.findAll(DynamicFormControl).length).toBe(2);
        expect(rendered.findAll(DynamicFormControl).at(0).props("colWidth")).toBe("3");
    });

    it("single controls are 6 cols", () => {
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: {...fakeFormGroup, controls: fakeFormGroup.controls.slice(0, 1)}
            }
        });

        expect(rendered.findAll(DynamicFormControl).length).toBe(1);
        expect(rendered.findAll(DynamicFormControl).at(0).props("colWidth")).toBe("6");
    });

    it("emits confirmEditing event when click event triggered", async() => {
        const controlGroup = {...fakeFormGroup};
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: controlGroup
            }
        });

        rendered.findAll(DynamicFormControl).at(0).trigger("click")
        await Vue.nextTick();

        expect(rendered.emitted().confirm.length).toBe(1);
    });

    it("emits confirmEditing event when mousedown event triggered", async() => {
        const controlGroup = {...fakeFormGroup};
        const rendered = shallowMount(DynamicFormControlGroup, {
            propsData: {
                controlGroup: controlGroup
            }
        });

        rendered.findAll(DynamicFormControl).at(0).trigger("mousedown")
        await Vue.nextTick();

        expect(rendered.emitted().confirm.length).toBe(1);
    });

});