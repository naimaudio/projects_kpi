# Time Management Interface for projects

This frontend application has the purpose to provide to employees an interface to input there hours. It will provide to project managers .

## Choices made

The choice has been made to make this frontend the most accurate to the fluent 2 design system. The firsts users of this application will be Focal. Employees from this company are fluent with microsoft ecosystem.

## Vue concepts

To understand the code, it is necessary to have an idea of the notions bellow :

This application is a [one page application](https://vuejs.org/guide/extras/ways-of-using-vue.html#embedded-web-components)

This project uses Vue 3 (not the same syntax as vue 2)

It uses the [Typescript](https://www.typescriptlang.org/) langage.
Typescript is a superset of javascript.
The purpose of typescript is to help developpers. It adds static types to javascript.
Is is only used in development, indeed, web navigators only understand javascript

A [vue Component](https://vuejs.org/guide/essentials/component-basics.html) is reusable set of CSS HTML and Javascript. A ```.vue``` file is a [Single-File Component](https://vuejs.org/guide/scaling-up/sfc.html) contains 3 main tags which are :
    - ```<template>``` tag : The HTML template containing all HTML elements
    - ```<script>``` tag : put here the javascript code
    - ```<style>``` tag : the css will be located. the ```scoped``` atribute means the CSS code will only be applied on current component.

You will probably find the ```props```
A really important is that the logic of have to be. The logic must be located in the most.
Stores make components able

In this application, the API style used is [Composition API](https://vuejs.org/guide/introduction.html#api-styles), only available with Vue 3. (less verbose than option API)

## Libraries

The library used in this app are

- eslint which is a linter, tell the developpers bad practices with a set of rules. It mades the code consistente.
- prettier : tool that make code pretty
- web components from fluent ui.
- lodash : used for the cloneDeep function, useful to make a copy of an array, or object without references.
- date-fns (maybe it is possible to do without it)
- vite : development server.
- types packages : relative to Typescript

You can find the complete list of libraries used in the ```package.json``` file
(A new library in a web application is never harmless.)

## Architecture of the project

You can find the sourcecode of frontend in src. The architecture of the application is as follows :

- main.ts : is the entrypoint of the application. The application is initiated with all the plugins, the stores, directives, routers, and where is main css is loaded.
- App.vue is the backbone of the components. It contains the sidebar. All the loaded components by the router will be inside this component. The ```<RouterView/>``` tag is where the components will be loaded with the router.
- components : All the other components are located hier (parts of the views) . As said earlier, this components have as little logic as possible. They are empty shells, with appearance costumizable with props. They can communicate with parrent components with [events](https://vuejs.org/guide/essentials/event-handling.html#listening-to-events).
- [router](https://router.vuejs.org/) : In this folder there is one file that defines routes of the web application.:
- views : Each route is associated with a view, which are

- stores : Here are defined all the stores of the application. The library used to do that is pinia.  <https://pinia.vuejs.org/>
    Here I use the "setup store".
- typing : Types of objects used in multiple vue components
- utilities : Here you can find a set of usefull functions used by components. Be carefull to do not insert vue router, direct utilization of a store, because a store utilisation must be declared in components, it is not recommended to "hide" those
- directives : A more advanced vue future. It only contains a function that helps doing modal components. (clickoutside the modal, to close it)
- assets : The static content used in the application. global.css contains css usable in the whole app.
