<template>
    <select class="form-control"
            :aria-label="formControl.label ? formControl.label : groupLabel"
            v-model="value"
            :name="formControl.name"
            :required="formControl.required">
        <option v-if="!formControl.excludeNullOption" value>{{selectText}}</option>
        <option v-for="opt in formControl.options"
                :key="opt.id"
                :value="opt.id">
            {{opt.label}}
        </option>
    </select>
</template>

<script lang="ts">
import Vue, {computed, defineComponent, onMounted, PropType, reactive, toRefs} from "vue";
    import {BFormSelect} from "bootstrap-vue-next";
    import {SelectControl} from "./types";

    interface Props {
        formControl: SelectControl
        selectText?: string
        groupLabel: string
    }

    interface Computed {
        value: string
    }

    export default defineComponent({
        name: "DynamicFormSelect",
        components: {
            BFormSelect
        },
        props: {
            formControl: Object as PropType<SelectControl>,
            selectText: String,
            groupLabel: String
        },
        emits: ["change"],
        model: {
            prop: "formControl",
            event: "change"
        },
        setup(props, {emit}) {

            const {formControl} = reactive(props)

            onMounted(() => {
                if (formControl?.excludeNullOption && !formControl.value) {
                    value.value = formControl.options[0].id;
                }
            })
            const value = computed({
                get() {
                    return formControl?.value || ""
                },
                set(newVal: string) {
                    emit("change", {...formControl, value: newVal});
                }
            })

            return {
                value
            }
        }
    })
</script>
