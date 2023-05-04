<template>
    <select v-if="formControl" class="form-control"
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
    <div>{{value}}</div>
</template>

<script lang="ts">
    import {computed, defineComponent, onMounted, PropType, reactive} from "vue";
    import {BFormSelect} from "bootstrap-vue-next";
    import {SelectControl} from "./types";

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

            return {
                value
            }
        }
    })
</script>
