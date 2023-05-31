<template>
    <div>
        <h3 @click="toggleSection" :class="{'cursor-pointer': controlSection.collapsible}">
            {{controlSection.label}}
            <vue-feather v-if="controlSection.collapsible"
                         style="vertical-align: initial"
                         :type="chevronComponent">
            </vue-feather>
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
                        <vue-feather type="info"></vue-feather>
                        How to use these settings
                        <vue-feather style="vertical-align:top"
                                     :type="documentationChevronComponent">
                        </vue-feather>
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
import {computed, defineComponent, onBeforeMount, PropType, ref} from "vue";
    import DynamicFormControlGroup from "./DynamicFormControlGroup.vue";
    import {DynamicControlGroup, DynamicControlSection} from "./types";
    import VueFeather from "vue-feather";
    import {BCollapse, BRow, BCol} from "bootstrap-vue-next";

    export default defineComponent({
        name: "DynamicFormControlSection",
        components: {
            DynamicFormControlGroup,
            VueFeather,
            BCollapse,
            BRow,
            BCol
        },
        props: {
            controlSection: {
                type: Object as PropType<DynamicControlSection>
            },
            requiredText: String,
            selectText: String,
            readonly: Boolean
        },
        emits: ["change", "confirm"],
        setup(props, {emit}) {
            const showDocumentation = ref(false)
            const open = ref(true)

            const controlGroups = computed(() => props.controlSection?.controlGroups || []);

            onBeforeMount(() => {
                if (props.controlSection?.collapsible && props.controlSection.collapsed) {
                    open.value = false
                }
            })

            function change(newVal: DynamicControlGroup, index: number) {
                const innerControlGroups = [...controlGroups.value];
                innerControlGroups[index] = newVal;
                emit("change", {...props.controlSection, controlGroups: innerControlGroups})
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
                    return "chevron-up"
                }
                return "chevron-down"
            })

            const documentationChevronComponent = computed(() => {
                if (showDocumentation.value) {
                    return "chevron-up"
                }
                return "chevron-down"
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
