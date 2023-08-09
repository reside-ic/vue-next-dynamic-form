import VueFeather from 'vue-feather';
import {mount, shallowMount} from "@vue/test-utils";
import DynamicFormControl from "../src/DynamicFormControl.vue";
import DynamicFormNumberInput from "../src/DynamicFormNumberInput.vue";
import DynamicFormSelect from "../src/DynamicFormSelect.vue";
import DynamicFormMultiSelect from "../src/DynamicFormMultiSelect.vue";
import {VTooltip} from 'floating-vue';
import {NumberControl, SelectControl} from "../src/types";
import DynamicFormReadonlyValue from "../src/DynamicFormReadonlyValue.vue";
import TreeSelect from "@reside-ic/vue3-treeselect";

const tooltipSpy = jest.spyOn(VTooltip, "beforeMount");

describe('Dynamic form control component', function () {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    const fakeNumber: NumberControl = {
        label: "Number label",
        name: "id_1",
        type: "number",
        required: false
    };

    const fakeSelect: SelectControl = {
        name: "id_2",
        type: "select",
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}]
    };

    const fakeMultiSelect: SelectControl = {
        name: "id_3",
        type: "multiselect",
        required: true,
        options: [{id: "opt1", label: "option 1"}, {id: "opt2", label: "option2"}]
    };

    const getWrapper = (formControl: any, readonly: Boolean = false) => {
        return mount(DynamicFormControl, {
            props: {
                formControl: formControl,
                requiredText: 'compulsory',
                selectText: 'Select',
                readonly,
                groupLabel: 'test'
            }
        });
    };

    it("renders label if it exists", () => {
        const rendered = getWrapper(fakeNumber);
        expect(rendered.find("label").text()).toBe("Number label");
    });

    it("renders tooltip if help text exists", () => {
        const rendered = getWrapper({...fakeNumber, helpText: "Some help text"});
        expect(rendered.find("label").text()).toBe("Number label");

        expect(rendered.findComponent(VueFeather).classes()).toContain("v-popper--has-tooltip");
        expect(tooltipSpy).toHaveBeenCalled();
        expect((tooltipSpy.mock.calls[0][1] as any).value).toBe("Some help text")
    });

    it("renders required indicator if input is required and sets text-danger class if no value given", () => {
        const rendered = getWrapper({...fakeNumber, required: true});
        expect(rendered.find("label").find("span").text()).toBe("(compulsory)");
        expect(rendered.find("label").find("span").attributes("class")).toBe("small text-danger");
    });

    it("renders required indicator if input is required and removes set text-danger class if value given", () => {
        const rendered = getWrapper({...fakeNumber, required: true, value: 123});
        expect(rendered.find("label").find("span").text()).toBe("(compulsory)");
        expect(rendered.find("label").find("span").attributes("class")).toBe("small");
    });

    it("does not render required indicator if readonly", () => {
        const rendered = getWrapper({...fakeNumber, required: true}, true);
        expect(rendered.find("label").find("span").exists()).toBe(false);
    });

    it("does not renders label if it does not exist", () => {
        const rendered = shallowMount(DynamicFormControl, {
            props: {
                formControl: fakeSelect,
                requiredText: 'compulsory',
                selectText: 'Select',
                readonly: false,
                groupLabel: 'test'
            }
        });

        expect(rendered.findAll("label").length).toBe(0);
    });

    it("col has given width", () => {
        const rendered = mount(DynamicFormControl, {
            props: {
                formControl: fakeNumber,
                colWidth: "3"
            }
        });
        expect(rendered.element.classList).toContain("col-md-3");
    });

    it("renders number input when formControl type is number",  () => {
        const control = {...fakeNumber};
        const rendered = getWrapper(control);
        expect(rendered.findAllComponents(DynamicFormNumberInput).length).toBe(1);
        expect(rendered.findComponent(DynamicFormNumberInput).props("groupLabel")).toBe("test");

        rendered.find("input").setValue(123);
        expect(rendered.emitted("change")![0][0]).toStrictEqual({...control, value: 123})
    });

    it("renders select when formControl type is select",  () => {
        const control = {...fakeSelect};
        const rendered = getWrapper(control);
        expect(rendered.findAllComponents(DynamicFormSelect).length).toBe(1);
        expect(rendered.findComponent(DynamicFormSelect).props("selectText")).toBe("Select");
        expect(rendered.findComponent(DynamicFormSelect).props("groupLabel")).toBe("test");

        rendered.find("select").trigger("change");
        expect(rendered.emitted("change")![0][0]).toStrictEqual({...fakeSelect, value: ""});
    });

    it("renders multi-select when formControl type is multiselect",  () => {
        const rendered = getWrapper(fakeMultiSelect);
        expect(rendered.findAllComponents(DynamicFormMultiSelect).length).toBe(1);
        expect(rendered.findComponent(DynamicFormMultiSelect).props("selectText")).toBe("Select");
        expect(rendered.findComponent(DynamicFormMultiSelect).props("groupLabel")).toBe("test");
        rendered.findComponent(DynamicFormMultiSelect).findComponent(TreeSelect).vm.$emit("update:modelValue", "opt1");
        expect(rendered.emitted).toHaveLength(1)
        expect(rendered.emitted("change")![0][0]).toStrictEqual({...fakeMultiSelect, value: "opt1"})
    });

    it("renders readonly value when readonly is true", () => {
        const numberControl = {...fakeNumber};
        const renderedNumber = getWrapper(numberControl, true);
        expect(renderedNumber.findAllComponents(DynamicFormNumberInput).length).toBe(0);
        expect(renderedNumber.findAllComponents(DynamicFormReadonlyValue).length).toBe(1);
        expect((renderedNumber.findComponent(DynamicFormReadonlyValue).vm as any).formControl).toEqual(numberControl);

        const selectControl = {...fakeSelect};
        const renderedSelect = getWrapper(selectControl, true);
        expect(renderedSelect.findAllComponents(DynamicFormSelect).length).toBe(0);
        expect(renderedSelect.findAllComponents(DynamicFormReadonlyValue).length).toBe(1);
        expect((renderedSelect.findComponent(DynamicFormReadonlyValue).vm as any).formControl).toEqual(selectControl);

        const renderedMulti = getWrapper(fakeMultiSelect, true);
        expect(renderedMulti.findAllComponents(DynamicFormMultiSelect).length).toBe(0);
        expect(renderedMulti.findAllComponents(DynamicFormReadonlyValue).length).toBe(1);
        expect((renderedMulti.findComponent(DynamicFormReadonlyValue).vm as any).formControl).toEqual(fakeMultiSelect);
    });

});
