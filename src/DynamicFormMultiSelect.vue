<template>
    <div>
        <tree-select :multiple="true"
                     :clearable="false"
                     v-model="value"
                     :options="formControl.options" 
                     :placeholder="selectText"></tree-select>
        <input type="hidden" :value="formControl.value" :name="formControl.name" :id="uniqueId"/>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {MultiSelectControl} from "./types";
    import TreeSelect from '@riophae/vue-treeselect';

    interface Props {
        uniqueId: string,
        formControl: MultiSelectControl
        selectText?: string
    }

    interface Computed {
        value: string[]
    }

    export default Vue.extend<{}, {}, Computed, Props>({
        name: "DynamicFormMultiSelect",
        model: {
            prop: "formControl",
            event: "change"
        },
        props: {
        uniqueId: String,
            formControl: {
                type: Object
            },
            selectText: String
        },
        computed: {
            value: {
                get() {
                    if (Array.isArray(this.formControl.value)) {
                        return this.formControl.value
                    }
                    if (typeof this.formControl.value == "string") {
                        return [this.formControl.value]
                    }
                    return []
                },
                set(newVal: string[]) {
                    this.$emit("change", {...this.formControl, value: newVal});
                }
            },
        },
        components: {
            TreeSelect
        },
        mounted(){
            console.log("this.uniqueId", this.uniqueId)
        }
    })
</script>
