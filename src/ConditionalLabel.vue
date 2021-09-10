<template>
    <div>
        <!-- <div v-if="controlGroup.label"> -->
        <label v-if="!readonly" class="row my-2">
            <slot name="label" v-if="controlGroup.label"></slot>
            <slot name="control"></slot>
        </label>
        <span v-else class="row my-2">
            <slot name="label" v-if="controlGroup.label"></slot>
            <slot name="control"></slot>
        </span>
        <!-- </div>
      <slot v-else name="control"></slot> -->
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { DynamicControlGroup } from "./types";

    interface Props {
        controlGroup: DynamicControlGroup;
        readonly?: boolean;
    }

    export default Vue.extend<unknown, unknown, unknown, Props>({
        name: "ConditionalLabel",
        props: {
            controlGroup: Object,
            readonly: Boolean,
        },
    });
</script>