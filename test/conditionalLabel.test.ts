import {shallowMount} from "@vue/test-utils";
import ConditionalLabel from "../src/ConditionalLabel.vue";
import {DynamicControlGroup, NumberControl, SelectControl} from "../src/types";
import Vue from "vue";

describe('Conditional label component', function () {

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

    const getWrapper = (readonly = false, controlGroup = fakeFormGroup) => {
        return shallowMount(ConditionalLabel, {
            propsData: {
                controlGroup,
                readonly
            },
            slots: {
                label: "<label-slot />",
                control: "<control-slot />"
            }
        });
    };

    it("renders label if not readonly and renders label slot", () => {
        const rendered = getWrapper()
        const label = rendered.find("label");
        expect(label.exists()).toBe(true);
        const span = rendered.find("span");
        expect(span.exists()).toBe(false);
        expect(rendered.find("label-slot").exists()).toBe(true)
        expect(rendered.find("control-slot").exists()).toBe(true)
    });

    it("renders span if readonly and renders label slot", () => {
        const rendered = getWrapper(true)
        const span = rendered.find("span");
        expect(span.exists()).toBe(true);
        const label = rendered.find("label");
        expect(label.exists()).toBe(false);
        expect(rendered.find("label-slot").exists()).toBe(true)
        expect(rendered.find("control-slot").exists()).toBe(true)
    });

    it("renders label if not readonly and does not render label slot", () => {
        const rendered = getWrapper(false, {...fakeFormGroup, label: ""})
        const label = rendered.find("label");
        expect(label.exists()).toBe(true);
        const span = rendered.find("span");
        expect(span.exists()).toBe(false);
        expect(rendered.find("label-slot").exists()).toBe(false)
        expect(rendered.find("control-slot").exists()).toBe(true)
    });

    it("renders span if readonly and does not render label slot", () => {
        const rendered = getWrapper(true, {...fakeFormGroup, label: ""})
        const span = rendered.find("span");
        expect(span.exists()).toBe(true);
        const label = rendered.find("label");
        expect(label.exists()).toBe(false);
        expect(rendered.find("label-slot").exists()).toBe(false)
        expect(rendered.find("control-slot").exists()).toBe(true)
    });

});
