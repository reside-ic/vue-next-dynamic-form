<template>
    <div v-if="formControl">
        <tree-select :multiple="true"
                     :clearable="false"
                     :aria-label="formControl.label ? formControl.label : groupLabel"
                     v-model="value"
                     :options="formControl.options" 
                     :placeholder="selectText"></tree-select>
        <input type="hidden" :value="formControl.value" :name="formControl.name"/>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
    import {MultiSelectControl} from "./types";
    import TreeSelect from "vue3-treeselect";

    export default defineComponent({
        name: "DynamicFormMultiSelect",
        components: {
            TreeSelect
        },
        props: {
            formControl: Object as PropType<MultiSelectControl>,
            selectText: String,
            groupLabel: String
        },
        emits: ["update:formControl"],
        setup(props, {emit}) {
            const value = computed({
                get() {
                    const formControlValue = props.formControl?.value
                    if (Array.isArray(formControlValue)) {
                        return formControlValue
                    }
                    if (typeof formControlValue == "string") {
                        return [formControlValue]
                    }
                    return []
                },
                set(newVal: string[]) {
                    emit("update:formControl", {...props.formControl, value: newVal});
                }
            })
            return {
                value
            }
        }
    })
</script>
