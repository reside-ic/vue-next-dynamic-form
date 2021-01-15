<template>
    <select class="form-control"
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
    import Vue from "vue";
    import {BFormSelect} from "bootstrap-vue";
    import {SelectControl} from "./types";

    interface Props {
        formControl: SelectControl
        selectText?: string
    }

    interface Computed {
        value: string
    }

    export default Vue.extend<{}, {}, Computed, Props>({
        name: "DynamicFormSelect",
        props: {
            formControl: {
                type: Object
            },
            selectText: String
        },
        model: {
            prop: "formControl",
            event: "change"
        },
        computed: {
            value: {
                get() {
                    return this.formControl.value || ""
                },
                set(newVal: string) {
                    this.$emit("change", {...this.formControl, value: newVal});
                }
            }
        },
        components: {
            BFormSelect
        },
        mounted() {
            if (this.formControl.excludeNullOption && !this.formControl.value) {
                this.value = this.formControl.options[0].id;
            }
        }
    })
</script>
