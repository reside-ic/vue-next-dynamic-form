import DynamicForm from "./DynamicForm.vue";

export default {
    install: (app) => {
        app.component('vue-next-dynamic-form', DynamicForm)
    }
}