import {mount} from "@vue/test-utils";
import DynamicFormComponent from "../src/DynamicForm.vue";
import DynamicForm from "../src/DynamicForm.vue";
import DynamicFormControlSection from "../src/DynamicFormControlSection.vue";
import {DynamicControlSection, DynamicFormMeta, MultiSelectControl, NumberControl, SelectControl} from "../src/types";
import {createApp} from "vue";

const app = createApp({})

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

    const validFormMetaWithTransforms: DynamicFormMeta = {
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
                            value: 10,
                            transform: "$/100"
                        } as NumberControl,
                        {
                            name: "id_3",
                            type: "multiselect",
                            options: [{id: "opt1", label: "option 1"}],
                            required: false,
                            value: ["opt1", "opt2"],
                            transform: "{\"customValue\": $}"
                        } as MultiSelectControl,
                        {
                            name: "id_4",
                            type: "select",
                            options: [{id: "opt2", label: "option 2"}],
                            required: true,
                            value: "opt1",
                            transform: "\"value is \" & $"
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
                        props: any = {}) => {
        return mount(DynamicFormComponent, {
            props: {
                formMeta: {...formMeta},
                ...props
            }
        });
    };

    it("renders form with id", async () => {
        const rendered = getWrapper(validFormMeta, {id: "test-id"});
        const form = rendered.find("form");

        //expect((form.vm.$refs["test-id"] as Element).tagName).toBe("FORM");
        expect(form.classes()).toContain("dynamic-form")
    });

    it("generates default id if not provided", () => {
        const rendered = getWrapper(validFormMeta);
        //expect(rendered.vm.$props.id).toBe("d-form");
    });

    it("renders control sections", () => {
        const rendered = getWrapper(validFormMeta);
        expect(rendered.findAllComponents(DynamicFormControlSection).length).toBe(2);
    });

    it("sends default props to control sections", () => {
        const rendered = getWrapper(validFormMeta);
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("requiredText")).toBe("required");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("selectText")).toBe("Select...");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("readonly")).toBe(false);
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("requiredText")).toBe("required");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("selectText")).toBe("Select...");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("readonly")).toBe(false);
    });

    it("sends custom props to control sections", () => {
        const rendered = getWrapper(validFormMeta, {
            requiredText: 'compulsory',
            selectText: 'Select',
            readonly: true
        });
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("requiredText")).toBe("compulsory");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("selectText")).toBe("Select");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("readonly")).toBe(true);
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("requiredText")).toBe("compulsory");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("selectText")).toBe("Select");
        expect(rendered.findAllComponents(DynamicFormControlSection)[0].props("readonly")).toBe(true);
    });

    it("does not render button if includeSubmitButton is false", () => {
        const rendered = getWrapper(validFormMeta, {includeSubmitButton: false});
        expect(rendered.findAll("button").length).toBe(0);
    });

    it("does not render button if readonly is true", () => {
        const rendered = getWrapper(validFormMeta, {readonly: true});
        expect(rendered.findAll("button").length).toBe(0);
    });

    it("button is disabled and has btn-secondary class while required values are missing", async () => {
        const rendered = await getWrapper(invalidFormMeta, {});
        //expect(rendered.find("button").attributes("disabled")).toBe("disabled");
        expect(rendered.find("button").classes()).toStrictEqual(["btn", "btn-secondary"]);
    });

    it("button is enabled and has btn-submit class when required values are present", () => {
        const rendered = getWrapper(validFormMeta, {});
        expect(rendered.find("button").attributes("disabled")).toBeUndefined();
        expect(rendered.find("button").classes()).toStrictEqual(["btn", "btn-submit"]);
    });

    it("emits event with serialised form data on button submit", async () => {
        const rendered = getWrapper(validFormMeta, {});
        await rendered.find("button").trigger("click");
        expect(rendered.emitted("submit")![0][0]).toStrictEqual({
            "id_1": null,
            "id_2": 10,
            "id_3": ["opt1", "opt2"],
            "id_4": "opt1",
            "id_5": []
        });
    });

    it("emits serialised form data with transforms applied", async () => {
        const rendered = getWrapper(validFormMetaWithTransforms, {});
        rendered.find("button").trigger("click");
        expect(rendered.emitted("submit")![0][0]).toStrictEqual({
            "id_1": null, //no transform
            "id_2": 0.1,
            "id_3": { customValue: ["opt1", "opt2"] },
            "id_4": "value is opt1"
        });
    });

    it("emits confirmEditing event when event is emitted ", async() => {
        const rendered = getWrapper(validFormMeta, {});
        await rendered.findAllComponents(DynamicFormControlSection)[0].vm.$emit("confirm", "Param")

        expect(rendered.emitted().confirm!.length).toBe(1);
        expect(rendered.emitted("confirm")![0][0]).toBe("Param");
    });

    it("emits event and returns serialised form data on programmatic submit", () => {
        const rendered = getWrapper(validFormMeta, {});
        const expected = {
            "id_1": null,
            "id_2": 10,
            "id_3": ["opt1", "opt2"],
            "id_4": "opt1",
            "id_5": []
        };

        const result = (rendered.vm as any).submit();
        expect(rendered.emitted("submit")![0][0]).toStrictEqual(expected);
        expect(result).toStrictEqual(expected);
    });

    it.skip("updates v-model when change event is emitted", async () => {
       const vm = {...validFormMeta}
        const parent = app.component( "testComponent", {
            template: `<div><span>{{form.controlSections[1].label}}</span><dynamic-form v-model="form" /></div>`,
            setup() {
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

        const rendered = await mount(parent);

        await rendered.findComponent(DynamicForm)
            .findAllComponents(DynamicFormControlSection)[1]
            .vm.$emit("change", newControlSection);

        expect(rendered.find("span").text()).toBe("TEST");
    });

    it("initial validate event is emitted with false value when required values are missing",  () => {
        const rendered = getWrapper(invalidFormMeta, {});

        expect(rendered.emitted().validate!.length).toBe(1);
        expect(rendered.emitted("validate")![0][0]).toBe(false);
    });

    it("initial validate event is emitted with true  value when when required values are present", () => {
        const rendered = getWrapper(validFormMeta, {});

        expect(rendered.emitted().validate!.length).toBe(1);
        expect(rendered.emitted("validate")![0][0]).toBe(true);
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

        const rendered = getWrapper(formMeta, {});

        formMeta.controlSections[0].controlGroups[0].controls[0].value = "";
        await rendered.setProps({formMeta});

        //expect(rendered.emitted().validate!.length).toBe(2);
        //expect(rendered.emitted("validate")![1][0]).toBe(false);
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

        const rendered = await getWrapper(formMeta, {});

        expect(rendered.emitted().validate!.length).toBe(1);

        formMeta.controlSections[0].controlGroups[0].controls[0].value = "opt2";
        await rendered.setProps({formMeta});

        //expect(rendered.emitted().validate!.length).toBe(2);
        //expect(rendered.emitted("validate")![1][0]).toBe(true);
    });
});
