<template>
    <div class="col-md-6 dynamic-form-readonly-value">{{value}}</div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {DynamicControl} from "./types";

    interface Props {
        formControl: DynamicControl
    }

    interface Computed {
        value: string;
    }

    export default Vue.extend<{}, {}, Computed, Props>({
        name: "DynamicFormReadonlyValue",
        model: {
            prop: "formControl"
        },
        props: {
            formControl: {
                type: Object
            }
        },
        computed: {
            value() {
                return String(this.formControl.value);
            }
        }
    });
</script>
