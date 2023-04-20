import {defineComponent} from "vue";


interface Methods {
    valueIsEmpty: (value: any) => boolean
}

export default ({
    setup() {
        const valueIsEmpty = (value: any) => {
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
});
