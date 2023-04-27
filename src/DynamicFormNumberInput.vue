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
import {computed, defineComponent, PropType, reactive} from "vue";
    import {BFormInput} from "bootstrap-vue-next";
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
        props: {
            formControl: Object as PropType<NumberControl>,
            groupLabel: String
        },
        emits: ["change"],
        setup(props, {emit}) {

            const {formControl} = reactive(props);

            const value = computed({
                get() {
                    console.log(formControl);
                    return formControl?.value;
                },
                set(newVal: number | null | undefined) {
                    console.log({...formControl, value: newVal})
                    emit("change", {...formControl, value: newVal});
                }
            })
            return {
                value
            }
        }
    })
</script>
