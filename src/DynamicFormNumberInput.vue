<template>
    <b-form-input :name="formControl.name"
                  :aria-label="formControl.label ? formControl.label : groupLabel"
                  type="number"
                  :number="true"
                  v-model="value"
                  :min="formControl.min"
                  :max="formControl.max"
                  :step="formControl.step"
                  :required="formControl.required"></b-form-input>
</template>

<script lang="ts">
import Vue, {computed, defineComponent, PropType} from "vue";
    import {BFormInput} from "bootstrap-vue";
import {NumberControl} from "./types";

    interface Props {
        formControl: NumberControl
        groupLabel: string
    }

    interface Computed {
        value: number | null | undefined
    }

    export default defineComponent({
        name: "DynamicFormNumberInput",
        components: {
            BFormInput
        },
        model: {
            prop: "formControl",
            event: "change"
        },
        props: {
            formControl: Object as PropType<NumberControl>,
            groupLabel: String
        },
        emits: ["change"],
        setup(props, {emit}) {

            const value = computed({
                get() {
                    return props.formControl?.value;
                },
                set(newVal: number | null | undefined) {
                    emit("change", {...props.formControl, value: newVal});
                }
            })
            return {
                value
            }
        }
    })
</script>
