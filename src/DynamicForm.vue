<template>
    <b-form :ref="id" :id="id" class="dynamic-form" novalidate>
        <dynamic-form-control-section v-if="formMeta" v-for="(section, index) in formMeta.controlSections"
                                      :key="index"
                                      :control-section="section"
                                      :readonly="readonly"
                                      @confirm="confirm"
                                      :required-text="requiredText"
                                      :select-text="selectText"
                                      @change="change($event, index)">
        </dynamic-form-control-section>
        <button v-if="includeSubmitButton && !readonly"
                class="btn"
                :class="disabled? 'btn-secondary' : 'btn-submit'"
                :disabled="disabled"
                @click="submit">{{submitText}}
        </button>
    </b-form>
</template>

<script lang="ts">

    import {computed, defineComponent, onMounted, PropType, watch} from "vue";
    import {BForm} from "bootstrap-vue-next";
    import jsonata from "jsonata";
    import DynamicFormControlGroup from "./DynamicFormControlGroup.vue";
    import DynamicFormControlSection from "./DynamicFormControlSection.vue";
    import {
        Control, ControlValue,
        DynamicControl,
        DynamicControlSection,
        DynamicFormData,
        DynamicFormMeta
    } from "./types";
    import { install } from "floating-vue";

    const props = {
        id: {
            type: String,
            default: "d-form"
        },
        submitText: {
            type: String,
            default: "Submit"
        },
        includeSubmitButton: {
            type: Boolean,
            default: true
        },
        formMeta: {
            type: Object as PropType<DynamicFormMeta>,
        },
        requiredText: {
            type: String,
            default: "required"
        },
        selectText: {
            type: String,
            default: "Select..."
        },
        readonly:{
            type: Boolean,
            default: false
        }
    };

    export default defineComponent({
        name: "DynamicForm",
        props: props,
        components: {
            BForm,
            DynamicFormControlGroup,
            DynamicFormControlSection
        },
        emits: ["validate", "update:formMeta", "submit", "confirm"],

        setup(props, {emit}) {
            const options = {
                // Set float distance so that the arrow does not overlap
                // the tooltip icon. This was causing multiple mouse
                // events to be triggered causing the tooltip to flicker
                distance: 12,
                themes: {
                    'tooltip': {
                        html: true,
                        delay: {
                            show: 0,
                            hide: 0,
                        },
                    },
                }
            };
            // we hijack the install function and give it a dummy app
            // so it doesn't error when it executes app.directive or
            // app.component but we want it to deep assign the options
            // to floating vue's internal config object

            // This is a way to configure global options of a directive
            // in a component, i.e. local version of app.use(plugin, options)
            const dummyApp = {
                directive: function (name: string, component: any) {},
                component: function (name: string, component: any) {}
            };
            install(dummyApp, options);

            onMounted(() =>  emit("validate", !disabled.value))

            const controlSections = computed(() => props.formMeta?.controlSections || []);

            onMounted(() => {
                controlSections.value.map(s => {
                    s.controlGroups.map(g => {
                        g.controls.map(c => {
                            c.value = buildValue(c)
                        })
                    })
                });
            })

            const controls = computed(() =>  {
                const controls: Control[] = [];
                controlSections.value.map(s => {
                    s.controlGroups.map(g => {
                        g.controls.map(c => {
                            controls.push(c);
                        })
                    })
                });
                return controls;
            })

            const disabled = computed(() => {
                return controls.value
                    .filter(c => c.required && (c.value == null || c.value == ""))
                    .length > 0
            })

            function change(newVal: DynamicControlSection, index: number) {
                const innerControlSections = [...controlSections.value];
                innerControlSections[index] = newVal;
                emit("update:formMeta", {...props.formMeta, controlSections: innerControlSections})
            }
            function buildValue(control: DynamicControl) {
                if (control.type == "multiselect" && !control.value) {
                    return []
                } else return control.value == undefined ? null : control.value;
            }
            function transformValue(value: ControlValue, transform: string) {
                return jsonata(transform).evaluate(value);
            }
            function submit(e: Event) {
                if (e) {
                    e.preventDefault();
                }
                const result = controls.value
                    .reduce((formData, control) => {
                        let value = buildValue(control);
                        if (control.transform) {
                            value = transformValue(value, control.transform);
                        }
                        formData[control.name] = value;
                        return formData
                    }, {} as DynamicFormData);
                emit("submit", result);
                return result;
            }
            function confirm(e: Event) {
                emit("confirm", e)
            }

            watch(disabled, (newValue) => emit("validate", !newValue));

            return {
                confirm,
                change,
                submit,
                disabled,
                controls
            }
        }
    })
</script>
