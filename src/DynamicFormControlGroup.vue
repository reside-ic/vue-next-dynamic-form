<template>
    <b-row v-if="controlGroup" class="my-2">
        <label class="col-form-label col-md-5">{{ controlGroup.label }}
            <span v-if="helpText" class="icon-small">
                <vue-feather type="help-circle"
                             v-tooltip="helpText"
                             class="align-text-bottom me-1"></vue-feather>
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
    import {useForm} from "./utils";
    import {computed, defineComponent, PropType} from "vue";

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

            const {valueIsEmpty} = useForm();

            const colWidth = computed(() => {
                const numCols = props.controlGroup?.controls.length;
                if (numCols == 1) {
                    return "6"
                } else {
                    return "3"
                }
            })

            const required = computed(() => {
                return props.controlGroup?.controls.length == 1 && props.controlGroup?.controls[0].required
            })

            const helpText = computed(() => {
                return props.controlGroup?.controls.length == 1 ? props.controlGroup?.controls[0].helpText : ""
            })

            function anyValueEmpty(controlGroup: DynamicControlGroup) {
                return !!controlGroup.controls.find(c => valueIsEmpty(c.value))
            }

            function change(newVal: Control, index: number) {
                const controls = [...props.controlGroup?.controls || []];
                controls[index] = newVal;
                emit("change", {...props.controlGroup, controls})
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