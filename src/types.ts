export type Dict<V> = { [k: string]: V }

export type DynamicControlSection = {
    label: string
    description?: string
    documentation?: string
    collapsible?: boolean
    collapsed?: boolean
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
    transform?: string
}

export type SelectControl = DynamicControl & {
    options: Option[]
    value?: string | null
    excludeNullOption?: boolean
}

export type MultiSelectControl = DynamicControl & {
    options: Option[]
    value?: string[] | string
}

export type NumberControl = DynamicControl & {
    min?: number
    max?: number
    value?: number | null
    step?: number
}

export type DynamicFormMeta = {
    controlSections: DynamicControlSection[]
}

export type ControlValue = string | string[] | number | null

export type DynamicFormData = Dict<ControlValue>
