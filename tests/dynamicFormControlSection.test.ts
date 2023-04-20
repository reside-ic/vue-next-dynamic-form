import {mount, shallowMount} from "@vue/test-utils";
import Vue from "vue";
import DynamicFormControlSection from "../src/DynamicFormControlSection.vue";
import DynamicFormControlGroup from "../src/DynamicFormControlGroup.vue";
import {DynamicControlSection} from "../src/types";
//import {ChevronDownIcon, ChevronUpIcon} from "vue-feather";
import {BCollapse} from "bootstrap-vue-next";

import featherIcons from 'vue-feather';

const ChevronDownIcon = featherIcons.ChevronDownIcon;
const ChevronUpIcon = featherIcons.ChevronUpIcon;

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
        const rendered = shallowMount(DynamicFormControlSection, {
            props: {
                controlSection: fakeFormSection
            }
        });

        expect(rendered.find("h3").text()).toBe("Test 1");
        expect(rendered.find("p").text()).toBe("Desc 1");
    });

    it("can toggle section if collapsible", async () => {
        const rendered = shallowMount(DynamicFormControlSection, {
            props: {
                controlSection: {...fakeFormSection, collapsible: true}
            }
        });

        await Vue.nextTick();

        expect(rendered.find("h3").classes()).toContain("cursor-pointer");
        expect(rendered.findAll(ChevronDownIcon).length).toBe(0);
        expect(rendered.findAll(ChevronUpIcon).length).toBe(1);
        expect(rendered.findComponent(BCollapse).props("visible")).toBe(true);

        await Vue.nextTick();

        rendered.find("h3").trigger("click");

        await Vue.nextTick();

        expect(rendered.findAll(ChevronDownIcon).length).toBe(1);
        expect(rendered.findAll(ChevronUpIcon).length).toBe(0);
        expect(rendered.findComponent(BCollapse).props("visible")).toBe(false);

        rendered.find("h3").trigger("click");
        await Vue.nextTick();

        expect(rendered.findAll(ChevronDownIcon).length).toBe(0);
        expect(rendered.findAll(ChevronUpIcon).length).toBe(1);
        expect(rendered.findComponent(BCollapse).props("visible")).toBe(true);
    });


    it("defaults to collapsed if control section collapsed property is true", async () => {
        const rendered = shallowMount(DynamicFormControlSection, {
            props: {
                controlSection: {...fakeFormSection, collapsible: true, collapsed: true}
            }
        });

        await Vue.nextTick();

        expect(rendered.find("h3").classes()).toContain("cursor-pointer");
        expect(rendered.findAll(ChevronDownIcon).length).toBe(1);
        expect(rendered.findAll(ChevronUpIcon).length).toBe(0);
        expect(rendered.findComponent(BCollapse).props("visible")).toBe(false);

        await Vue.nextTick();

        rendered.find("h3").trigger("click");

        await Vue.nextTick();

        expect(rendered.findAll(ChevronDownIcon).length).toBe(0);
        expect(rendered.findAll(ChevronUpIcon).length).toBe(1);
        expect(rendered.findComponent(BCollapse).props("visible")).toBe(true);
    });

    it("does not render toggle icon if section is not collapsible", () => {
        const rendered = shallowMount(DynamicFormControlSection, {
            props: {
                controlSection: fakeFormSection
            }
        });

        expect(rendered.findAll(ChevronUpIcon).length).toBe(0);
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
        expect(documentation.findComponent(BCollapse).props("visible")).toBe(false);
        expect(documentation.findAll(ChevronDownIcon).length).toBe(1);
        expect(documentation.findAll(ChevronUpIcon).length).toBe(0);
        expect(documentation.find("ul").isVisible()).toBe(false);

        await Vue.nextTick();

        documentation.find("a").trigger("click");

        await Vue.nextTick();

        documentation = rendered.find(".documentation");
        expect(documentation.findComponent(BCollapse).props("visible")).toBe(true);
        expect(documentation.findAll(ChevronDownIcon).length).toBe(0);
        expect(documentation.findAll(ChevronUpIcon).length).toBe(1);
        expect(documentation.find("ul").isVisible()).toBe(true);
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
        expect(rendered.findAllComponents(DynamicFormControlGroup).at(0)?.props("controlGroup"))
            .toStrictEqual(controlSection.controlGroups[0]);
        expect(rendered.findAllComponents(DynamicFormControlGroup).at(0)?.props("selectText")).toBe("Select");
        expect(rendered.findAllComponents(DynamicFormControlGroup).at(0)?.props("requiredText")).toBe("compulsory");
        expect(rendered.findAllComponents(DynamicFormControlGroup).at(0)?.props("readonly")).toBe(false);
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
        rendered.findAllComponents(DynamicFormControlGroup).at(0)
            ?.vm.$emit("change", updatedControlGroup);

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

        rendered.findAllComponents(DynamicFormControlGroup).at(0)
            ?.vm.$emit("confirm","Param");

        const emittedConfirm = rendered.emitted().confirm;

        expect(emittedConfirm.length).toBe(1);
        expect(emittedConfirm[0][0]).toBe("Param");
    });

});
