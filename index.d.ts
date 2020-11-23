declare module "@reside-ic/vue-dynamic-form" {
    import Vue from "vue";

    export type DynamicControlSection = {
        label: string
        description?: string
        documentation?: string
        collapsible?: boolean
        controlGroups: DynamicControlGroup[]
    }

    export type DynamicControlGroup = {
        label?: string
        controls: Control[]
    }

    export type Option = {
        id: string,
        label: string,
        children?: Option[]
    }

    export type DynamicControlType = "multiselect" | "select" | "number"
    export type Control = SelectControl | MultiSelectControl | NumberControl

    export type DynamicControl = {
        name: string,
        label?: string,
        type: DynamicControlType
        required: boolean
        helpText?: string
        value?: string | string[] | number | null
    }

    export type SelectControl = DynamicControl & {
        options: Option[]
        value?: string | null
    }

    export type MultiSelectControl = DynamicControl & {
        options: Option[]
        value?: string[] | string
    }

    export type NumberControl = DynamicControl & {
        min?: number
        max?: number
        value?: number | null
    }

    export type DynamicFormMeta = {
        controlSections: DynamicControlSection[]
    }

    type Dict<V> = { [k: string]: V }

    export type DynamicFormData = Dict<string | string[] | number | null>

    export class DynamicForm extends Vue {
        formMeta: DynamicFormMeta;
        includeSubmitButton?: boolean;
        submitText?: string;
        id?: string;
    }

    export function isControl(object: any): Boolean

    export function isNumberControl(object: any): object is NumberControl

    export function isSelectControl(object: any): object is SelectControl

    export function isMultiSelectControl(object: any): object is MultiSelectControl

    export function isSelectOption(object: any): object is Option

    export function isDynamicControlGroup(object: any): object is DynamicControlGroup

    export function isDynamicControlSection(object: any): object is DynamicControlSection

    export function isDynamicFormMeta(object: any): object is DynamicFormMeta

}
