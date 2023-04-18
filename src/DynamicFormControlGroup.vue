<template>
    <b-row class="my-2">
        <label v-if="controlGroup.label" class="col-form-label col-md-5">{{controlGroup.label}}
            <span v-if="helpText" class="icon-small" v-tooltip="helpText">
                    <help-circle-icon></help-circle-icon>
                </span>
            <span v-if="required && !readonly" class="small" :class="{'text-danger': anyValueEmpty(controlGroup)}">({{requiredText}})</span>
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
    import {BCol, BRow} from "bootstrap-vue";
    import {Control, DynamicControl, DynamicControlGroup} from "./types";
    import DynamicFormControl from "./DynamicFormControl.vue";
    import {VTooltip} from 'v-tooltip';
    import {HelpCircleIcon} from "vue-feather-icons";
    import FormsMixin from "./FormsMixin";
    import {computed, defineComponent, PropType, reactive, ref} from "vue";

    interface Methods {
        anyValueEmpty: (controlGroup: DynamicControlGroup) => boolean
        change: (newVal: Control, index: number) => void
        confirm:(e: Event) => void
    }

    interface Computed {
        colWidth: string,
        required: boolean
        helpText: string | undefined
    }

    interface Props {
        controlGroup: DynamicControlGroup
        requiredText?: string
        selectText?: string
        readonly?: boolean
    }

    export default defineComponent({
        name: "DynamicFormControlGroup",
        props: {
            controlGroup: Object as PropType<DynamicControlGroup>,
            requiredText: String,
            selectText: String,
            readonly: Boolean
        },
        model: {
            prop: "controlGroup",
            event: "change"
        },
        components: {
            BRow,
            BCol,
            DynamicFormControl,
            HelpCircleIcon
        },
        directives: {
            tooltip: VTooltip
        },
        emits: ["change", "confirm"],
        setup(props, {emit}){

            const {valueIsEmpty} = FormsMixin

            const controls = reactive(props.controlGroup?.controls ?? [])

            const colWidth = computed(() => {
                const numCols = controls.length;
                if (numCols == 1) {
                    return "6"
                } else {
                    return "3"
                }
            })

            const required = computed(() => {
                return controls.length == 1 && controls[0].required
            })

            const helpText = computed(() => {
                return controls.length == 1 ? controls[0].helpText : ""
            })

            function anyValueEmpty(controlGroup: DynamicControlGroup) {
                return !!controlGroup.controls.find(c => valueIsEmpty(c.value))
            }
            function change(newVal: Control, index: number) {
                const control = [...controls];
                controls[index] = newVal;
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