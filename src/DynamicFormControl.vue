<template>
    <b-col :md="colWidth">
        <label v-if="formControl.label">{{formControl.label}}
            <span v-if="formControl.helpText"
                  class="icon-small"
                  v-tooltip="formControl.helpText">
                <help-circle-icon></help-circle-icon>
            </span>
            <span v-if="formControl.required && !readonly" class="small" :class="{'text-danger': valueIsEmpty(formControl.value)}">({{requiredText}})</span>
        </label>
        <component :is="dynamicComponent"
                   :group-label="groupLabel" 
                   v-model="formControlLocal"
                   :select-text="selectText"></component>
    </b-col>
</template>

<script lang="ts">
    import {BCol} from "bootstrap-vue";
    import DynamicFormMultiSelect from "./DynamicFormMultiSelect.vue";
    import DynamicFormSelect from "./DynamicFormSelect.vue";
    import {DynamicControl} from "./types";
    import DynamicFormNumberInput from "./DynamicFormNumberInput.vue";
    import DynamicFormReadonlyValue from "./DynamicFormReadonlyValue.vue";
    import {VTooltip} from 'v-tooltip'
    import {HelpCircleIcon} from "vue-feather-icons";
    import FormsMixin from "./FormsMixin";
    import {computed, defineComponent, PropType} from "vue";

    interface Computed {
        dynamicComponent: string,
        formControlLocal: DynamicControl
    }

    interface Props {
        formControl: DynamicControl,
        colWidth: string
        requiredText?: string
        selectText?: string,
        readonly?: boolean
        groupLabel: string
    }

    export default defineComponent({
        name: "DynamicFormControl",
        mixins: [FormsMixin],
        components: {
            BCol,
            DynamicFormNumberInput,
            DynamicFormSelect,
            DynamicFormMultiSelect,
            DynamicFormReadonlyValue,
            HelpCircleIcon
        },
        directives: {
            tooltip: VTooltip
        },
        model: {
            prop: "formControl",
            event: "change"
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

            const formControlLocal = computed<DynamicControl | undefined>({
                get() {
                    return props.formControl
                },
                set(newVal) {
                    emit("change", newVal);
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
                            return ""
                    }
                }
            })
            return {
                formControlLocal,
                dynamicComponent
            }
        }
    });
</script>
