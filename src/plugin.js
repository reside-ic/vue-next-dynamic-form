import DynamicForm from "./DynamicForm.vue";
import FloatingVue from "floating-vue";

export default {
    install: (app, floatingVueOptions = {}) => {
        app.component('vue-next-dynamic-form', DynamicForm);
        app.use(FloatingVue, floatingVueOptions);
    }
}