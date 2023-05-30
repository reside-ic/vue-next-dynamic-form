import {mount, shallowMount} from "@vue/test-utils";
import DynamicFormControlSection from "../src/DynamicFormControlSection.vue";
import DynamicFormControlGroup from "../src/DynamicFormControlGroup.vue";
import {DynamicControlSection} from "../src/types";
import {BCollapse} from "bootstrap-vue-next";

describe('Dynamic form control section component', function () {

    const fakeFormSection: DynamicControlSection = {
        label: "Test 1",
        description: "Desc 1",
        controlGroups: [{
            label: "Group 1",
            controls: [{
                type: "number",
                name: "id_1",
                required: false
            }]
        }, {
            label: "Group 2",
            controls: []
        }]
    };

    it("renders label and description", () => {
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: fakeFormSection
            }
        });

        expect(rendered.find("h3").text()).toBe("Test 1");
        expect(rendered.find("p").text()).toBe("Desc 1");
    });

    it("can toggle section if collapsible", async () => {
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: {...fakeFormSection, collapsible: true}
            }
        });

        expect(rendered.find("h3").classes()).toContain("cursor-pointer");
        const vueFeatherIcons = rendered.findAll("svg");
        expect(vueFeatherIcons).toHaveLength(1);
        expect(rendered.find("svg").classes()).toContain("feather-chevron-up");
        await expect(rendered.findComponent(BCollapse).props("modelValue")).toBe(true);

        await rendered.find("h3").trigger("click");

        const vueFeatherIcons2 = rendered.findAll("svg");
        expect(vueFeatherIcons2).toHaveLength(1);
        expect(rendered.find("svg").classes()).toContain("feather-chevron-down");
        expect(rendered.findComponent(BCollapse).props("modelValue")).toBe(false);

        await rendered.find("h3").trigger("click");

        const vueFeatherIcons3 = rendered.findAll("svg");
        expect(vueFeatherIcons3).toHaveLength(1);
        expect(rendered.find("svg").classes()).toContain("feather-chevron-up");
        expect(rendered.findComponent(BCollapse).props("modelValue")).toBe(true);
    });


    it("defaults to collapsed if control section collapsed property is true", async () => {
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: {...fakeFormSection, collapsible: true, collapsed: true}
            }
        });

        expect(rendered.find("h3").classes()).toContain("cursor-pointer");
        const vueFeatherIcons = rendered.findAll("svg");
        expect(vueFeatherIcons).toHaveLength(1);
        expect(rendered.find("svg").classes()).toContain("feather-chevron-down");
        expect(rendered.findComponent(BCollapse).props("modelValue")).toBe(false);

        await rendered.find("h3").trigger("click");

        const vueFeatherIcons2 = rendered.findAll("svg");
        expect(vueFeatherIcons2).toHaveLength(1);
        expect(rendered.find("svg").classes()).toContain("feather-chevron-up");
        expect(rendered.findComponent(BCollapse).props("modelValue")).toBe(true);
    });

    it("does not render toggle icon if section is not collapsible", () => {
        const rendered = shallowMount(DynamicFormControlSection, {
            props: {
                controlSection: fakeFormSection
            }
        });

        expect(rendered.findAll("chevron-up-icon").length).toBe(0);
        expect(rendered.find("h3").classes()).not.toContain("cursor-pointer");
    });

    it("does not render description if absent", () => {
        const rendered = shallowMount(DynamicFormControlSection, {
            props: {
                controlSection: {...fakeFormSection, description: null}
            }
        });

        expect(rendered.findAll("p").length).toBe(0);
    });

    it("does not render documentation if absent", () => {
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: {...fakeFormSection, collapsible: true, documentation: null}
            }
        });

        expect(rendered.findAll(".documentation").length).toBe(0);
        expect(rendered.findAllComponents(BCollapse).length).toBe(1);
    });

    it("can toggle documentation if present", async () => {
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: {...fakeFormSection, documentation: "<ul><li>something</li></ul>"}
            }
        });

        expect(rendered.findAll(".documentation").length).toBe(1);

        let documentation = rendered.find(".documentation");
        expect(documentation.findComponent(BCollapse).props("modelValue")).toBe(false);

        const vueFeatherIcons = documentation.findAll("svg");
        expect(vueFeatherIcons).toHaveLength(2);
        expect(vueFeatherIcons[0].classes()).toContain("feather-info");
        expect(vueFeatherIcons[1].classes()).toContain("feather-chevron-down");

        expect(documentation.findComponent(BCollapse).props("modelValue")).toBe(false);
        await documentation.find("a").trigger("click");

        documentation = rendered.find(".documentation");
        expect(documentation.findComponent(BCollapse).props("modelValue")).toBe(true);
        expect(documentation.findAll("svg")[0].classes()).toContain("feather-info");
        expect(documentation.findAll("svg")[1].classes()).toContain("feather-chevron-up");
    });

    it("renders control groups", async () => {
        const controlSection = {...fakeFormSection};
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: controlSection,
                selectText: "Select",
                requiredText: "compulsory",
                readonly: false
            }
        });

        expect(rendered.findAllComponents(DynamicFormControlGroup).length).toBe(2);
        expect(rendered.findAllComponents(DynamicFormControlGroup)[0].props("controlGroup"))
            .toStrictEqual(controlSection.controlGroups[0]);
        expect(rendered.findAllComponents(DynamicFormControlGroup)[0].props("selectText")).toBe("Select");
        expect(rendered.findAllComponents(DynamicFormControlGroup)[0].props("requiredText")).toBe("compulsory");
        expect(rendered.findAllComponents(DynamicFormControlGroup)[0].props("readonly")).toBe(false);
    });

    it("emits change event when child component does", () => {
        const controlSection = {...fakeFormSection};
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: controlSection
            }
        });

        const updatedControlGroup = {...controlSection.controlGroups[0]};
        updatedControlGroup.controls[0] = "TEST" as any;
        rendered.findAllComponents(DynamicFormControlGroup)[0].vm.$emit("change", updatedControlGroup);

        expect((rendered.emitted("change")![0][0] as DynamicControlSection)
            .controlGroups[0].controls[0]).toBe("TEST");
    });

    it("emits confirmEditing event when child component does", () => {
        const controlSection = {...fakeFormSection};
        const rendered = mount(DynamicFormControlSection, {
            props: {
                controlSection: controlSection
            }
        });

        rendered.findAllComponents(DynamicFormControlGroup)[0].vm.$emit("confirm","Param");

        const emittedConfirm = rendered.emitted("confirm");
        if (emittedConfirm) {
            expect(emittedConfirm).toHaveLength(1);
            expect(emittedConfirm[0][0]).toBe("Param");
        } else {
            fail("No confirm event emitted");
        }
    });

});
