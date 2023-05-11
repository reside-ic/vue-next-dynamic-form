import DynamicForm from "./DynamicForm.vue";
import FloatingVue from "floating-vue";

export default {
    install: (app) => {
        app.use(FloatingVue)
        app.component('vue-dynamic-form', DynamicForm)
    }
}