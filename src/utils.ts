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
