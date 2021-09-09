import {shallowMount, mount, Wrapper} from "@vue/test-utils";
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

    it("renders label if not readonly", () => {
        const rendered = shallowMount(ConditionalLabel, {
            propsData: {
                controlGroup: fakeFormGroup,
                readonly: false
            }
        });
        const label = rendered.find("label");
        expect(label.classes()).toStrictEqual(["row", "my-2"]);
        const span = rendered.find("span");
        expect(span.exists()).toBe(false);
    });

    it("renders span if readonly", () => {
        const rendered = shallowMount(ConditionalLabel, {
            propsData: {
                controlGroup: fakeFormGroup,
                readonly: true
            }
        });
        const span = rendered.find("span");
        expect(span.classes()).toStrictEqual(["row", "my-2"]);
        const label = rendered.find("label");
        expect(label.exists()).toBe(false);
    });


    it("renders nothing if no control group label", () => {
        const rendered = shallowMount(ConditionalLabel, {
            propsData: {
                controlGroup: {...fakeFormGroup, label: ""},
                readonly: true
            }
        });
        const span = rendered.find("span");
        expect(span.exists()).toBe(false);
        const label = rendered.find("label");
        expect(label.exists()).toBe(false);
    });

});
