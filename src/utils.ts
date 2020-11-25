export function valueIsEmpty(value: any) { 
    if (value && value.constructor === Array){
        return value.length === 0
    // As the role of this function is to check for empty values rather than do any validation, 
    // it might make more sense for zero values not to trigger it (as in the commented out line below)?
    // } else if (typeof(value) === 'boolean' || value === 0) {
    // In the example form, 0 is not considered a valid value so I decided to make it trigger the red required text
    } else if (typeof(value) === 'boolean') {
        return false
    } else return !value
}
  