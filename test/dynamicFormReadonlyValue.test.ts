import {mount} from "@vue/test-utils";
import DynamicFormReadonlyValue from "../src/DynamicFormReadonlyValue.vue";

describe("dynamicFormReadyonlyValue", () => {
    it("renders number control value", () => {
        const propsData = {
            formControl: {
                value: 7
            }
        };
        const rendered = mount(DynamicFormReadonlyValue, { propsData });
        expect(rendered.find("div").text()).toBe("7");
    });

    it("renders number control value with separator", () => {
        const propsData = {
            formControl: {
                value: 7_654_321.99
            }
        };
        const rendered = mount(DynamicFormReadonlyValue, { propsData });
        expect(rendered.find("div").text()).toBe("7,654,321.99");
    });

    it("renders select control value", () => {
        const propsData = {
            formControl: {
                value: "2",
                options: [
                    {id: "1", label: "one"},
                    {id: "2", label: "two"}
                ]
            }
        };
        const rendered = mount(DynamicFormReadonlyValue, { propsData });
        expect(rendered.find("div").text()).toBe("two");
    });

    it("renders multi-select control value", () => {
        const propsData = {
            formControl: {
                value: ["2", "1.2"],
                options: [
                    {id: "1", label: "one", children: [
                            {id: "1.1", label: "child one"},
                            {id: "1.2", label: "child two"}
                        ]},
                    {id: "2", label: "two"}
                ]
            }
        };
        const rendered = mount(DynamicFormReadonlyValue, { propsData });
        expect(rendered.find("div").text()).toBe("two, child two");
    });

    it("renders null value", () => {
        const propsData = {
            formControl: {
                value: null
            }
        };
        const rendered = mount(DynamicFormReadonlyValue, { propsData });
        expect(rendered.find("div").text()).toBe("");
    });

    it("renders empty array value", () => {
        const propsData = {
            formControl: {
                value: [],
                options: [
                    {id: "1", label: "one"},
                    {id: "2", label: "two"}
                ]
            }
        };
        const rendered = mount(DynamicFormReadonlyValue, { propsData });
        expect(rendered.find("div").text()).toBe("");
    });
});
