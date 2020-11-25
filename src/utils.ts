export function valueIsEmpty(value: any) { 
    if (value && value.constructor === Array){
        return value.length === 0
    } else if (typeof(value) === 'boolean') {
        return false
    } else return !value
}
  