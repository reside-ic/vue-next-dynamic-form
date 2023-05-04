<template>
    <div class="dynamic-form-readonly-value">{{value}}</div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {Option, SelectControl} from "./types";

    export default defineComponent({
        name: "DynamicFormReadonlyValue",
        props: {
            formControl: {
                type: Object as PropType<SelectControl>,
                required: false
            }
        },
        setup(props) {
            const flattenedOptions = computed(() => {
                const options: Option[] | undefined = (props.formControl as any).options;
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
            })

            const value = computed(() => {
                const controlValue = props.formControl?.value;
                if (!controlValue || (Array.isArray(controlValue) && controlValue.length == 0)) {
                    return "";
                }

                const options = flattenedOptions.value
                if (options) {
                    const ids = Array.isArray(controlValue) ? controlValue : [controlValue];
                    const readableValues = ids.map(id => {
                        const matchedOption = options.find((o: Option) => o.id == id);
                        return matchedOption ? matchedOption.label : id;
                    });
                    return readableValues.join(", ");
                }

                if (typeof props.formControl?.value === "number") {
                    return new Intl.NumberFormat().format(props.formControl.value);
                }

                return props.formControl?.value as string;
            });

            return {
                value,
                flattenedOptions
            }
        }
    });
</script>
