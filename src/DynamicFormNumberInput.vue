<template>
    <b-form-input v-if="formControl" :name="formControl.name"
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
import {computed, defineComponent, PropType} from "vue";
    import {BFormInput} from "bootstrap-vue-next";
    import {NumberControl} from "./types";

    export default defineComponent({
        name: "DynamicFormNumberInput",
        components: {
            BFormInput
        },
        props: {
            formControl: Object as PropType<NumberControl>,
            groupLabel: String
        },
        emits: ["update:formControl"],
        setup(props, {emit}) {
            const value = computed({
                get() {
                    return props.formControl?.value;
                },
                set(newVal: number | null | undefined) {
                    emit("update:formControl", {...props.formControl, value: newVal});
                }
            })
            return {
                value
            }
        }
    })
</script>
