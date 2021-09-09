<template>
  <div>
      <label v-if="controlGroup.label && !readonly" class="row my-2">
          <slot></slot>
      </label>
      <span v-else-if="controlGroup.label" class="row my-2">
          <slot></slot>
      </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {DynamicControlGroup} from "./types";

interface Props {
    controlGroup: DynamicControlGroup
    readonly?: boolean
}

export default Vue.extend<unknown, unknown, unknown, Props>({
name: "ConditionalLabel",
    props: {
        controlGroup: Object,
        readonly: Boolean
    },
})
</script>