<template>
    <div class="dynamic-form-readonly-value">{{value}}</div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {DynamicControl, Option} from "./types";

    interface Props {
        formControl: DynamicControl
    }

    interface Computed {
        value: string;
        flattenedOptions: Option[] | null;
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
            flattenedOptions() {
                const options: Option[] | undefined = (this.formControl as any).options;
                if (options) {
                    const flattenOptions = (options: Option[]): Option[] => {
                        let result: Option[] = [];
                        options.forEach(o => {
                            result.push(o);
                            if (o.children) {
                                result = result.concat(flattenOptions(o.children));
                            }
                        });
                        return result;
                    };

                    return flattenOptions(options);
                } else {
                    return null;
                }
            },
            value() {
                const controlValue = this.formControl.value;
                if (!controlValue || (Array.isArray(controlValue) && controlValue.length == 0)) {
                    return "";
                }

                const options = this.flattenedOptions;
                if (options) {
                    const ids = Array.isArray(controlValue) ? controlValue : [controlValue];
                    const readableValues = ids.map(id => {
                        const matchedOption = options.find((o: Option) => o.id == id);
                        return matchedOption ? matchedOption.label : id;
                    });
                    return readableValues.join(", ");
                } else {
                    return String(this.formControl.value);
                }
            }
        }
    });
</script>
