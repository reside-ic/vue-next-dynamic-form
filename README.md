# vue-dynamic-form
Vue component for generating a form dynamically from metadata.

## Installation
* Install from npm:
  ```
  npm install @reside-ic/vue-dynamic-form
  ```
* Import into your project and register as a global or local component:
  ```
  import {DynamicForm} from "@reside-ic/vue-dynamic-form"
  
  // global
  Vue.component("dynamic-form", DynamicForm)
  
  // or local
  new Vue({
    el: '#app',
    components: {
      DynamicForm
    }
  })
  
  ```
* Include the following css file in your style bundle: 
    ```
    node_modules/@reside-ic/vue-dynamic-form/dist/css/style.min.css
    ```

## Usage
### Example
The form structure is specified via the `form-meta` prop. On user submission the 
form emits a `submit` event with a payload that contains the form data. In the below example,
the payload would be of the form:
```
{
    area_scope: "MWI,MWI.1",
    area_level: null,
    art_t1: "q1",
    art_t2: null,
    num_sim: null
}
```

```
    <template>
        <dynamic-form :form-meta="myFormMeta" @submit="handleSubmit"></dynamic-form>
    </template>
    <script>
    
    export default {
        data() {
            return {
                myFormMeta: myFormMeta          
            }
        },
        methods: {
            submit(data) {
                axios.post("/my-form", data)
            }
        }
    }

    const myFormMeta = {   
        controlSections: [
            {
                label: "General",
                description: "Select general model options:",
                controlGroups: [
                    {
                        label: "Area scope",
                        controls: [
                            {
                                name: "area_scope",
                                type: "multiselect",
                                options: [{id: "MWI", label: "Malawi"}, {id: "MWI.1", label: "Central"}],
                                value: ["MWI","MWI.1"],
                                required: true
                            }]
                    },
                    {
                        label: "Area level",
                        controls: [
                            {
                                name: "area_level",
                                type: "multiselect",
                                options: [{id: "q1", label: "Apr - Jun 2015"}, {id: "q2", label: "Jul - Sep 2015"}],
                                required: true
                            }]
                    }
                ]
            },
            {
                label: "ART",
                description: "Optionally select which quarter of data to use at time point 1 and 2",
                controlGroups: [
                    {
                        label: "Number on ART",
                        controls: [
                            {
                                name: "art_t1",
                                label: "Time 1",
                                type: "select",
                                value: "q1",
                                helpText: "Quarter matching midpoint of survey",
                                options: [{id: "q1", label: "Jan - Mar 2015"}, {id: "q2", label: "Apr - Jun 2015"}],
                                required: true
                            },
                            {
                                name: "art_t2",
                                label: "Time 2",
                                type: "select",
                                helpText: "Quarter matching midpoint of survey",
                                options:  [{id: "q1", label: "Jan - Mar 2015"}, {id: "q2", label: "Apr - Jun 2015"}],
                                required: false
                            }
                        ]
                    }
                ]
            },
            {
                label: "Advanced options",
                controlGroups: [
                    {
                        label: "Number of simulations",
                        controls: [{
                            name: "num_sim",
                            type: "number",
                            required: true
                        }]
                    }
                ]
            }
        ]
    }

    </script>
```

### Example with v-model
Optionally pass the form metadata as a `v-model`. In this case the `value` fields of the 
individual controls will be updated as the user makes changes to the form. This allows 
for pre-submission validation, or just keeping track of form changes outside the component.

For example, user changes can be persisted even when the form is hidden:

```
    <dynamic-form v-if="showForm" v-model="myFormMeta" @submit="handleSubmit"></dynamic-form>
```

### Optional component props
As well as the required `v-model` or `form-meta`, you can optionally customize
the submit button text by passing `submit-text`, and the HTML element's id by 
passing `id`:

```
    <dynamic-form id="my-dynamic-form" 
                  v-model="myFormMeta"
                  @submit="handleSubmit"
                  submit-text="Validate">
    </dynamic-form>
```

### Control types
At the moment only 3 control types are supported:
* select
* multiselect
* number