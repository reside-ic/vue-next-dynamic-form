<template>
    <b-col :md="colWidth">
        <label v-if="formControl.label">{{formControl.label}}
            <span v-if="formControl.helpText"
                  class="icon-small"
                  v-tooltip="formControl.helpText">
                <help-circle-icon></help-circle-icon>
            </span>
            <span v-if="formControl.required" :class="{'text-danger': isRed(formControl.value), small: true}">(required)</span>
        </label>
        <component :is="dynamicComponent"
                   v-model="formControlLocal"></component>
    </b-col>
</template>

<script lang="ts">
    import Vue from "vue";
    import {BCol} from "bootstrap-vue";
    import DynamicFormMultiSelect from "./DynamicFormMultiSelect.vue";
    import DynamicFormSelect from "./DynamicFormSelect.vue";
    import {DynamicControl} from "./types";
    import DynamicFormNumberInput from "./DynamicFormNumberInput.vue";
    import {VTooltip} from 'v-tooltip'
    import {HelpCircleIcon} from "vue-feather-icons";

    interface Computed {
        dynamicComponent: string,
        formControlLocal: DynamicControl
    }

    interface Methods {
        isRed: (value: any) => boolean
    }

    interface Props {
        formControl: DynamicControl,
        colWidth: string
    }

    export default Vue.extend<{}, Methods, Computed, Props>({
        name: "DynamicFormControl",
        model: {
            prop: "formControl",
            event: "change"
        },
        props: {
            formControl: Object,
            colWidth: String
        },
        methods: {
            isRed(value){
                if (value){
                    if(value.constructor === Array){
                        if (value.length > 0){
                            return false
                        } else return true
                    }
                }
                if(value){
                    return false
                } else return true
            }
        },
        computed: {
            formControlLocal: {
                get() {
                    return this.formControl
                },
                set(newVal: DynamicControl) {
                    this.$emit("change", newVal);
                }
            },
            dynamicComponent() {
                switch (this.formControl.type) {
                    case "select":
                        return "dynamic-form-select";
                    case "multiselect":
                        return "dynamic-form-multi-select";
                    case "number":
                        return "dynamic-form-number-input";
                }
            }
        },
        components: {
            BCol,
            DynamicFormNumberInput,
            DynamicFormSelect,
            DynamicFormMultiSelect,
            HelpCircleIcon
        },
        directives: {
            tooltip: VTooltip
        }
    });
</script>
