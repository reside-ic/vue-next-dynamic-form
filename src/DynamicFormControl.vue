<template>
    <b-col :md="colWidth">
        <label v-if="formControl.label">{{formControl.label}}
            <span v-if="formControl.helpText"
                  class="icon-small">
               <vue-feather type="help-circle"
                            v-tooltip="formControl.helpText"
                            class="align-text-bottom me-1"></vue-feather>
            </span>
            <span v-if="formControl.required && !readonly" class="small" :class="{'text-danger': valueIsEmpty(formControl.value)}">({{requiredText}})</span>
        </label>
        <component :is="dynamicComponent"
                   :group-label="groupLabel" 
                   v-model:formControl="formControlLocal"
                   :select-text="selectText"></component>
    </b-col>
</template>

<script lang="ts">
    import {BCol} from "bootstrap-vue-next";
    import DynamicFormMultiSelect from "./DynamicFormMultiSelect.vue";
    import DynamicFormSelect from "./DynamicFormSelect.vue";
    import {DynamicControl} from "./types";
    import DynamicFormNumberInput from "./DynamicFormNumberInput.vue";
    import DynamicFormReadonlyValue from "./DynamicFormReadonlyValue.vue";
    import {VTooltip} from 'floating-vue'
    import VueFeather from "vue-feather";
    import {computed, defineComponent, PropType} from "vue";
    import {useForm} from "./utils";

    export default defineComponent({
        name: "DynamicFormControl",
        components: {
            BCol,
            DynamicFormNumberInput,
            DynamicFormSelect,
            DynamicFormMultiSelect,
            DynamicFormReadonlyValue,
            VueFeather
        },
        directives: {
            tooltip: VTooltip
        },
        props: {
            formControl: Object as PropType<DynamicControl>,
            colWidth: String,
            requiredText: String,
            selectText: String,
            readonly: Boolean,
            groupLabel: String
        },
        emits: ["change"],
        setup(props, {emit}) {

            const {valueIsEmpty} = useForm()

            const formControlLocal = computed({
                get() {
                    return props.formControl
                },
                set(newVal: DynamicControl | undefined) {
                    const modifiedVal = {
                        ...newVal,
                        value: newVal!.value || "",
                    };
                    emit("change", modifiedVal);
                }
            })

            const dynamicComponent = computed(() => {
                if (props.readonly) {
                    return "dynamic-form-readonly-value";
                } else {
                    switch (props.formControl?.type) {
                        case "select":
                            return "dynamic-form-select";
                        case "multiselect":
                            return "dynamic-form-multi-select";
                        case "number":
                            return "dynamic-form-number-input";
                        default:
                            return null
                    }
                }
            })

            return {
                formControlLocal,
                dynamicComponent,
                valueIsEmpty
            }
        }
    });
</script>
