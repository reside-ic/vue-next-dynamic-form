<template>
    <div>
        <h3 @click="toggleSection" :class="{'cursor-pointer': controlSection.collapsible}">
            {{controlSection.label}}
            <component v-if="controlSection.collapsible"
                       style="vertical-align: initial"
                       :is="chevronComponent"></component>
        </h3>
        <b-collapse v-model="open">
            <p v-if="controlSection.description" class="text-muted">{{controlSection.description}}</p>
            <dynamic-form-control-group v-for="(group, index) in controlSection.controlGroups"
                                        :key="index"
                                        :control-group="group"
                                        :readonly="readonly"
                                        @confirm="confirm"
                                        :required-text="requiredText"
                                        :select-text="selectText"
                                        @change="change($event, index)"></dynamic-form-control-group>
            <b-row v-if="controlSection.documentation" class="documentation mb-4">
                <b-col>
                    <a href="#" @click="toggleDocumentation">
                        <info-icon></info-icon>
                        How to use these settings
                        <component style="vertical-align: top"
                                   :is="documentationChevronComponent"></component>
                    </a>
                    <b-collapse v-model="showDocumentation">
                        <div class="my-1" v-html="controlSection.documentation"></div>
                    </b-collapse>
                </b-col>
            </b-row>
        </b-collapse>
    </div>
</template>

<script lang="ts">

import Vue, {computed, defineComponent, onMounted, PropType, reactive, ref} from "vue";
    import DynamicFormControlGroup from "./DynamicFormControlGroup.vue";
    import {DynamicControlGroup, DynamicControlSection} from "./types";
    import {InfoIcon, ChevronDownIcon, ChevronUpIcon} from "vue-feather-icons";
    import {BCollapse, BRow, BCol} from "bootstrap-vue";

    interface Methods {
        change: (newVal: DynamicControlGroup, index: number) => void
        toggleDocumentation: (e: Event) => void
        toggleSection: () => void
        confirm: (e: Event) => void
    }

    interface Props {
        controlSection: DynamicControlSection
        requiredText?: string
        selectText?: string
        readonly: boolean
    }

    interface Data {
        open: boolean
        showDocumentation: boolean
    }

    export default defineComponent({
        name: "DynamicFormControlSection",
        components: {
            DynamicFormControlGroup,
            InfoIcon,
            ChevronDownIcon,
            ChevronUpIcon,
            BCollapse,
            BRow,
            BCol
        },
        props: {
            controlSection: {
                type: Object as PropType<DynamicControlSection>,
            },
            requiredText: String,
            selectText: String,
            readonly: Boolean
        },
        model: {
            prop: "controlSection",
            event: "change"
        },
        emits: ["change", "confirm"],
        setup(props, {emit}) {

            const showDocumentation = ref(false)
            const open = ref(true)

            const controlGroups = reactive(props.controlSection?.controlGroups ?? [])

            onMounted(() => {
                if (props.controlSection?.collapsible && props.controlSection.collapsed) {
                    open.value = false
                }
            })

            function change(newVal: DynamicControlGroup, index: number) {
                const innerControlGroups = [...controlGroups];
                controlGroups[index] = newVal;
                emit("change", {...props.controlSection, innerControlGroups})
            }
            function toggleDocumentation(e: Event) {
                e.preventDefault();
                showDocumentation.value = !showDocumentation.value
            }
            function toggleSection() {
                if (props.controlSection?.collapsible) {
                    open.value = !open.value;
                }
            }
            function confirm(e: Event) {
                emit("confirm", e)
            }

            const chevronComponent = computed(() => {
                if (open.value) {
                    return "chevron-up-icon"
                }
                return "chevron-down-icon"
            })

            const documentationChevronComponent = computed(() => {
                if (showDocumentation.value) {
                    return "chevron-up-icon"
                }
                return "chevron-down-icon"
            })

            return {
                chevronComponent,
                documentationChevronComponent,
                change,
                toggleDocumentation,
                toggleSection,
                confirm,
                showDocumentation,
                open
            }
        }
    })
</script>
