# projects_kpi
The purpose of this frontend is to make

The choice has been made to make this frontend the most accurate to the fluent 2 design system. The firsts users of this application will be Focal, and employees are fluent with microsoft ecosystem.

This application is a "one page application". "https://vuejs.org/guide/extras/ways-of-using-vue.html#embedded-web-components"

The version of vue is Vue 3 which has not the same syntax than vue 2, and . So in documentation please be carefull to use the Vue 3 documentation.



You can find the sourcecode of frontend in src. The architecture of the application is as follows :
    - components : All components 
    - views :
    - main.ts : is the entrypoint of the application, it is were the application is created.
    - App.vue is the backbone of the components, all the loaded components by the router will be inside this  
    - router : In this folder there is one file that defines routes of the web application : https://router.vuejs.org/
    - stores : Here are defined all the stores of the application. The library used to do that is pinia.  https://pinia.vuejs.org/
    Here I use the "setup store".
    - typing :Here you can find types used in several vue components
    - utilities : Here you can find a set of usefull functions used by components. Be carefull to do not insert vue router, direct utilization of a store, because a store utilisation must be declared in components, it is not recommended to "hide" those
    - directives : A function
    - assets : The static content used in the application. global.css
 
Typescript is a superset of javascript.
The purpose of typescript is to help developpers. It adds static types to javascript.
Is is only used in development, indeed, the web navigators only understand javascript. https://en.wikipedia.org/wiki/TypeScript


The library used are 
- eslint which is a linter, helps . 
- web components from fluent ui
- lodash ????
- date-fns choosed 
- vite
- types packages to work with typescript
(A new library in a Vue application is never harmless.)



How to 