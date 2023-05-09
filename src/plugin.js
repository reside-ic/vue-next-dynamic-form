import DynamicForm from "./DynamicForm.vue";

export default {
    install: (app) => {
        app.component('vue-dynamic-form', DynamicForm)
    }
}