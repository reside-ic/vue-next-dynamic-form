import Vue from "vue";
import {mount, shallowMount, Wrapper} from "@vue/test-utils";
import DynamicFormComponent from "../src/DynamicForm.vue";
import DynamicForm from "../src/DynamicForm.vue";
import DynamicFormControlSection from "../src/DynamicFormControlSection.vue";
import {DynamicControlSection, DynamicFormMeta, MultiSelectControl, NumberControl, SelectControl} from "../src/types";
import DynamicFormControlGroup from "../src/DynamicFormControlGroup.vue";
import DynamicFormControl from "../src/DynamicFormControl.vue";

describe('Dynamic form component', function () {

    const validFormMeta: DynamicFormMeta = {
        controlSections: [
            {
                label: "Test 1",
                controlGroups: []
            },
            {
                label: "Test 2",
                controlGroups: [{
                    label: "Group 1",
                    controls: [
                        {
                            name: "id_1",
                            type: "number",
                            required: false
                        } as NumberControl,
                        {
                            name: "id_2",
                            type: "number",
                            required: true,
                            value: 10
                        } as NumberControl,
                        {
                            name: "id_3",
                            type: "multiselect",
                            options: [{id: "opt1", label: "option 1"}],
                            required: false,
                            value: ["opt1", "opt2"]
                        } as MultiSelectControl,
                        {
                            name: "id_4",
                            type: "select",
                            options: [{id: "opt2", label: "option 2"}],
                            required: true,
                            value: "opt1"
                        } as SelectControl,
                        {
                            name: "id_5",
                            type: "multiselect",
                            options: [{id: "opt2", label: "option 2"}],
                            required: false
                        } as SelectControl
                    ]
                }]
            }
        ]
    };

    const invalidFormMeta: DynamicFormMeta = {
        controlSections: [
            {
                label: "l1",
                controlGroups: [{
                    controls: [{
                        name: "id_1",
                        type: "select",
                        options: [{id: "opt2", label: "option 2"}],
                        required: true
                    } as SelectControl]
                }]
            }
        ]
    };

    const getWrapper = (formMeta: DynamicFormMeta,
                        propsData: any = {},
                        mount: (component: any, options: any) => Wrapper<Vue>) => {
        return mount(DynamicFormComponent, {
            propsData: {
                formMeta: {...formMeta},
                ...propsData
            }
        });
    };

    it("renders form with id", () => {
        const rendered = getWrapper(validFormMeta, {id: "test-id"}, mount);
        const form = rendered.find("form");
        expect((form.vm.$refs["test-id"] as Element).tagName).toBe("FORM");
        expect(form.classes()).toContain("dynamic-form")
    });

    it("generates default id if not provided", () => {
        const rendered = getWrapper(validFormMeta, {}, shallowMount);
        expect(rendered.vm.$props.id).toBe("d-form");
    });

    it("renders control sections", () => {
        const rendered = getWrapper(validFormMeta, {}, shallowMount);
        expect(rendered.findAll(DynamicFormControlSection).length).toBe(2);
    });

    it("sends default props to control sections", () => {
        const rendered = getWrapper(validFormMeta, {}, shallowMount);
        expect(rendered.findAll(DynamicFormControlSection).at(0).props("requiredText")).toBe("required");
        expect(rendered.findAll(DynamicFormControlSection).at(0).props("selectText")).toBe("Select...");
        expect(rendered.findAll(DynamicFormControlSection).at(1).props("requiredText")).toBe("required");
        expect(rendered.findAll(DynamicFormControlSection).at(1).props("selectText")).toBe("Select...");
    });

    it("sends custom props to control sections", () => {
        const rendered = getWrapper(validFormMeta, {requiredText: 'compulsory', selectText: 'Select'}, shallowMount);
        expect(rendered.findAll(DynamicFormControlSection).at(0).props("requiredText")).toBe("compulsory");
        expect(rendered.findAll(DynamicFormControlSection).at(0).props("selectText")).toBe("Select");
        expect(rendered.findAll(DynamicFormControlSection).at(1).props("requiredText")).toBe("compulsory");
        expect(rendered.findAll(DynamicFormControlSection).at(1).props("selectText")).toBe("Select");
    });

    it("does not render button if includeSubmitButton is false", () => {
        const rendered = getWrapper(validFormMeta, {includeSubmitButton: false}, shallowMount);
        expect(rendered.findAll("button").length).toBe(0);
    });

    it("button is disabled and has btn-secondary class while required values are missing", () => {
        const rendered = getWrapper(invalidFormMeta, {}, shallowMount);
        expect(rendered.find("button").attributes("disabled")).toBe("disabled");
        expect(rendered.find("button").classes()).toStrictEqual(["btn", "btn-secondary"]);
    });

    it("button is enabled and has btn-submit class when required values are present", () => {
        const rendered = getWrapper(validFormMeta, {}, mount);
        expect(rendered.find("button").attributes("disabled")).toBeUndefined();
        expect(rendered.find("button").classes()).toStrictEqual(["btn", "btn-submit"]);
    });

    it("emits event with serialised form data on button submit", async () => {
        const rendered = getWrapper(validFormMeta, {}, mount);
        rendered.find("button").trigger("click");
        expect(rendered.emitted("submit")[0][0]).toStrictEqual({
            "id_1": null,
            "id_2": 10,
            "id_3": ["opt1", "opt2"],
            "id_4": "opt1",
            "id_5": []
        });
    });


    it("emits confirmEditing event when event is emitted ", async() => {
        const rendered = getWrapper(validFormMeta, {}, mount);
        rendered.findAll(DynamicFormControlSection).at(0)
            .vm.$emit("confirm", "Param")

        await Vue.nextTick();
        expect(rendered.emitted().confirm.length).toBe(1);
        expect(rendered.emitted().confirm[0][0]).toBe("Param");
    });

    it("emits event and returns serialised form data on programmatic submit", () => {
        const rendered = getWrapper(validFormMeta, {}, mount);
        const expected = {
            "id_1": null,
            "id_2": 10,
            "id_3": ["opt1", "opt2"],
            "id_4": "opt1",
            "id_5": []
        };

        const result = (rendered.vm as any).submit();
        expect(rendered.emitted("submit")[0][0]).toStrictEqual(expected);
        expect(result).toStrictEqual(expected);
    });

    it("updates v-model when change event is emitted", async () => {

        const vm = {...validFormMeta};
        const parent = Vue.component('parent', {
            template: `<div><span>{{form.controlSections[1].label}}</span><dynamic-form v-model="form" /></div>`,
            data() {
                return {
                    form: vm
                }
            },
            components: {
                DynamicForm
            }
        });

        const newControlSection: DynamicControlSection = {
            label: "TEST",
            controlGroups: []
        };

        const rendered = mount(parent);
        rendered.find(DynamicForm)
            .findAll(DynamicFormControlSection)
            .at(1)
            .vm.$emit("change", newControlSection);

        await Vue.nextTick();
        expect(rendered.find("span").text()).toBe("TEST");
    });

    it("initial validate event is emitted with false value when required values are missing", async () => {
        const rendered = getWrapper(invalidFormMeta, {}, shallowMount);

        await Vue.nextTick();
        expect(rendered.emitted().validate.length).toBe(1);
        expect(rendered.emitted().validate[0][0]).toBe(false);
    });

    it("initial validate event is emitted with true  value when when required values are present", async () => {
        const rendered = getWrapper(validFormMeta, {}, mount);

        await Vue.nextTick();
        expect(rendered.emitted().validate.length).toBe(1);
        expect(rendered.emitted().validate[0][0]).toBe(true);
    });

    it("validate event is emitted with false value when form becomes invalid", async () => {
       const formMeta: DynamicFormMeta = {
            controlSections: [
                {
                    label: "l1",
                    controlGroups: [{
                        controls: [{
                            name: "id_1",
                            type: "select",
                            options: [{id: "opt2", label: "option 2"}],
                            required: true,
                            value: "opt2"
                        } as SelectControl]
                    }]
                }
            ]
        };

        const rendered = getWrapper(formMeta, {}, mount);

        formMeta.controlSections[0].controlGroups[0].controls[0].value = "";
        rendered.setProps({formMeta});

        await Vue.nextTick();

        expect(rendered.emitted().validate.length).toBe(2);
        expect(rendered.emitted().validate[1][0]).toBe(false);
    });

    it("validate event is emitted with true value when form becomes valid", async () => {
        const formMeta: DynamicFormMeta = {
            controlSections: [
                {
                    label: "l1",
                    controlGroups: [{
                        controls: [{
                            name: "id_1",
                            type: "select",
                            options: [{id: "opt2", label: "option 2"}],
                            required: true,
                            value: ""
                        } as SelectControl]
                    }]
                }
            ]
        };

        const rendered = getWrapper(formMeta, {}, mount);

        formMeta.controlSections[0].controlGroups[0].controls[0].value = "opt2";
        rendered.setProps({formMeta});

        await Vue.nextTick();

        expect(rendered.emitted().validate.length).toBe(2);
        expect(rendered.emitted().validate[1][0]).toBe(true);
    });
});
