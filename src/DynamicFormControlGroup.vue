<template>
    <b-row v-if="controlGroup" class="my-2">
        <label class="col-form-label col-md-5">{{ controlGroup.label }}
            <span v-if="helpText" class="icon-small" v-tooltip="helpText">
                <vue-feather type="help-circle"></vue-feather>
                </span>
            <span v-if="required && !readonly" class="small"
                  :class="{'text-danger': anyValueEmpty(controlGroup)}">({{ requiredText }})</span>
        </label>
        <dynamic-form-control v-for="(control, index) in controlGroup.controls"
                              :key="control.name"
                              :group-label="controlGroup.label"
                              :form-control="control"
                              :readonly="readonly"
                              @mousedown.native="confirm"
                              @click.native="confirm"
                              :required-text="requiredText"
                              :select-text="selectText"
                              @change="change($event, index)"
                              :col-width="colWidth"></dynamic-form-control>
    </b-row>
</template>
<script lang="ts">
    import {BCol, BRow} from "bootstrap-vue-next";
    import {Control, DynamicControlGroup} from "./types";
    import DynamicFormControl from "./DynamicFormControl.vue";
    import {VTooltip} from 'floating-vue';
    import VueFeather from "vue-feather";
    import {useFormMixin} from "./FormsMixin";
    import {computed, defineComponent, PropType, reactive, ref} from "vue";

    export default defineComponent({
        name: "DynamicFormControlGroup",
        props: {
            controlGroup: Object as PropType<DynamicControlGroup>,
            requiredText: String,
            selectText: String,
            readonly: Boolean
        },
        components: {
            BRow,
            BCol,
            DynamicFormControl,
            VueFeather
        },
        directives: {
            tooltip: VTooltip
        },
        emits: ["change", "confirm"],
        setup(props, {emit}){

            const {valueIsEmpty} = useFormMixin()

            const {controlGroup} = reactive(props);

            const colWidth = computed(() => {
                const numCols = controlGroup?.controls.length;
                if (numCols == 1) {
                    return "6"
                } else {
                    return "3"
                }
            })

            const required = computed(() => {
                return controlGroup?.controls.length == 1 && controlGroup?.controls[0].required
            })

            const helpText = computed(() => {
                return controlGroup?.controls.length == 1 ? controlGroup?.controls[0].helpText : ""
            })

            function anyValueEmpty(controlGroup: DynamicControlGroup) {
                return !!controlGroup.controls.find(c => valueIsEmpty(c.value))
            }

            function change(newVal: Control, index: number) {
                const control = [...controlGroup?.controls || []];
                control[index] = newVal;
                emit("change", {...props.controlGroup, control})
            }

            function confirm(e: Event) {
                emit("confirm", e)
            }

            return{
                anyValueEmpty,
                change,
                confirm,
                colWidth,
                required,
                helpText
            }
        }
    });

</script>