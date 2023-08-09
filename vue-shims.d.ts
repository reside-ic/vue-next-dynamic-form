// src/vue-shims.d.ts
declare module "*.vue" {
    import { DefineComponent } from 'vue';
    const component: DefineComponent;
    export default component;
}

declare module "@reside-ic/vue3-treeselect";