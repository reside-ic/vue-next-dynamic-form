import DynamicForm from "./DynamicForm.vue";
import DynamicFormControl from "./DynamicFormControl.vue";
import DynamicFormControlSection from "./DynamicFormControlSection.vue";
import DynamicFormControlGroup from "./DynamicFormControlGroup.vue";
import DynamicFormMultiSelect from "./DynamicFormMultiSelect.vue";
import DynamicFormNumberInput from "./DynamicFormNumberInput.vue";
import DynamicFormSelect from "./DynamicFormSelect.vue";

const components = {
    "VueDynamicForm": DynamicForm,
    DynamicFormControl,
    DynamicFormControlGroup,
    DynamicFormControlSection,
    DynamicFormMultiSelect,
    DynamicFormNumberInput,
    DynamicFormSelect
};

const plugin = {
    install (app) {
        for (const prop in components) {
            app.component(prop, components[prop]);
        }
    }
}

export default plugin;