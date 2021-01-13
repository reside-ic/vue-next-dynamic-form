<template>
    <select class="form-control"
            v-model="value"
            :name="formControl.name"
            :required="formControl.required">
        <option v-if="!formControl.excludeNullOption" value>{{selectText}}</option>
        <!-- <option v-if="!formControl.excludeNullOption" value>{{selectText}}</option> -->
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
    // import selectText from "./DynamicForm.vue"
    // import EventBus from './EventBus.vue';

    interface Props {
        formControl: SelectControl
        selectText?: string
    }

    interface Computed {
        value: string
    }

    export default Vue.extend<{}, {}, Computed, Props>({
        name: "DynamicFormSelect",
        // data() {
        //     return {

        //     }

        // },
        props: {
            formControl: {
                type: Object
            },
        selectText: {
            type: String,
            default: "Select...!!!!£££"
        }
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
            },
            // selectText: {
            //     return
            // }
        },
        components: {
            BFormSelect
        },
        mounted() {
            console.log(this.selectText)
            // EventBus.$on("selectText", function (payLoad: string) {
            //     return payLoad
            // })
            if (this.formControl.excludeNullOption && !this.formControl.value) {
                this.value = this.formControl.options[0].id;
            }
        }
    })
</script>
