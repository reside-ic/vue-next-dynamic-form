<template>
    <label class="row my-2">
        <div v-if="controlGroup.label" class="col-form-label col-md-5">
            {{controlGroup.label}}
            <span v-if="helpText" class="icon-small" v-tooltip="helpText">
                    <help-circle-icon></help-circle-icon>
                </span>
            <span v-if="required && !readonly" class="small" :class="{'text-danger': anyValueEmpty(controlGroup)}">({{requiredText}})</span>
        </div>
        <dynamic-form-control v-for="(control, index) in controlGroup.controls"
                            :key="control.name"
                            :form-control="control"
                            :readonly="readonly"
                            @mousedown.native="confirm"
                            @click.native="confirm"
                            :required-text="requiredText"
                            :select-text="selectText"
                            @change="change($event, index)"
                            :col-width="colWidth"></dynamic-form-control>
    </label>
</template>
<script lang="ts">
    import {Control, DynamicControlGroup} from "./types";
    import DynamicFormControl from "./DynamicFormControl.vue";
    import {VTooltip} from 'v-tooltip';
    import {HelpCircleIcon} from "vue-feather-icons";
    import FormsMixin from "./FormsMixin";

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

    export default FormsMixin.extend<{}, Methods, Computed, Props>({
        name: "DynamicFormControlGroup",
        props: {
            controlGroup: Object,
            requiredText: String,
            selectText: String,
            readonly: Boolean
        },
        model: {
            prop: "controlGroup",
            event: "change"
        },
        components: {
            DynamicFormControl,
            HelpCircleIcon
        },
        directives: {
            tooltip: VTooltip
        },
        methods: {
            anyValueEmpty(controlGroup: DynamicControlGroup){
                return !!controlGroup.controls.find(c => this.valueIsEmpty(c.value))
            },
            change(newVal: Control, index: number) {
                const controls = [...this.controlGroup.controls];
                controls[index] = newVal;
                this.$emit("change", {...this.controlGroup, controls})
            },
          confirm(e: Event) {
              this.$emit("confirm", e)
          }
        },
        computed: {
            colWidth() {
                const numCols = this.controlGroup.controls.length;
                if (numCols == 1) {
                    return "6"
                } else {
                    return "3"
                }
            },
            required() {
                return this.controlGroup.controls.length == 1
                    && this.controlGroup.controls[0].required
            },
            helpText() {
                return this.controlGroup.controls.length == 1 ?
                    this.controlGroup.controls[0].helpText : ""
            }
        }
    });

</script>
