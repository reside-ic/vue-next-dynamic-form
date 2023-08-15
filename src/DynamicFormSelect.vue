<template>
    <div v-if="formControl">
        <tree-select :aria-label="formControl.label ? formControl.label : groupLabel"
                     v-model="value"
                     :multiple="false"
                     :clearable="false"
                     :options="formOptions">
        </tree-select>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, onMounted, PropType} from "vue";
    import {SelectControl} from "./types";
    import TreeSelect from "@reside-ic/vue3-treeselect";

    export default defineComponent({
        name: "DynamicFormSelect",
        components: {
            TreeSelect
        },
        props: {
            formControl: Object as PropType<SelectControl>,
            selectText: String,
            groupLabel: String
        },
        emits: ["update:formControl"],
        setup(props, {emit}) {
            onMounted(() => {
                if (props.formControl?.excludeNullOption && !props.formControl.value) {
                    value.value = props.formControl.options[0].id;
                }
            })
            const value = computed({
                get() {
                    return props.formControl?.value || "";
                },
                set(newVal: string) {
                    emit("update:formControl", {...props.formControl, value: newVal});
                }
            })

            const formOptions = computed(() => {
                if (props.formControl) {
                    if (!props.formControl.excludeNullOption) {
                        const selectOption = {id: "", label: props.selectText}
                        return [selectOption, ...props.formControl.options];
                    } else {
                        return props.formControl.options
                    }
                }
                return [];
            })

            return {
                value,
                formOptions
            }
        }
    })
</script>
