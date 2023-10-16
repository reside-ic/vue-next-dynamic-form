import {
    Control,
    ControlWithOptions,
    DynamicFormData,
    DynamicFormMeta,
    MultiSelectControl,
    SelectControl,
    Option
} from "./types";

export function useForm() {
    function valueIsEmpty(value: any): boolean {
        if (value && value.constructor === Array) {
            return value.length === 0
        } else if (typeof (value) === 'boolean' || value === 0) {
            return false
        } else return !value
    }

    return {
        valueIsEmpty
    }
}


export function checkOptionsValid(formMeta: DynamicFormMeta): boolean {

    let valid = true
    formMeta.controlSections.forEach(section => {
        section.controlGroups.forEach(group => {
            group.controls.forEach(control => {
                if (control.value != null && hasOptions(control)) {
                    valid = valid && checkControlOptionValid(control)
                }
            })
        })
    })
    return valid
}

function hasOptions(control: Control): control is ControlWithOptions {
    return control.type === "select" || control.type === "multiselect"
}

function checkControlOptionValid(control: ControlWithOptions): boolean {
    let valid: boolean = true;

    let options = getAllOptions(control)
    let value = control.value
    // Check string and array types, otherwise we assume valid
    if (typeof value === 'string') {
        valid = options.includes(value)
    } else if (Array.isArray(value)) {
        valid = value.every(item => options.includes(item))
    }

    return valid
}

function getAllOptions(control: ControlWithOptions): string[] {
    let options= control.options.map(option => getOptions(option))
    return options.flat()
}

function getOptions(option: Option): string[] {
    let options = [option.id]
    if (option.children !== undefined) {
        options.concat(...option.children.map(child => getOptions(child)))
    }
    return options
}
