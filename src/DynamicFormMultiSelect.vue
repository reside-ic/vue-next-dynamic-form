<template>
    <div>
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
import {MultiSelectControl, SelectControl} from "./types";
    import TreeSelect from '@riophae/vue-treeselect';

    interface Props {
        formControl: MultiSelectControl
        selectText?: string
        groupLabel: string
    }

    interface Computed {
        value: string[]
    }

    export default defineComponent({
        name: "DynamicFormMultiSelect",
        components: {
            TreeSelect
        },
        model: {
            prop: "formControl",
            event: "change"
        },
        props: {
            formControl: {
                type: Object as PropType<SelectControl>,
                required: false
            },
            selectText: String,
            groupLabel: String
        },
        emits: ["change"],
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
                    emit("change", {...props.formControl, value: newVal});
                }
            })
            return {
                value
            }
        }
    })
</script>
