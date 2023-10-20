# Time Management Interface for projects

This frontend application provides employees with an interface to enter the hours they have worked on each of their projects.
This project is a part of a larger project. If the project kpi api is setup, you can build a developpement environment

## Dev setup

In order to setup a developpement server, you need npm v18 installed, an FastAPI backend and setup environment variables.

### Environnment variables


VITE_AUTHORITY=```https://login.microsoftonline.com```/```tenant ID ``` : The Azure Authority URI

The Directory (tenant) ID can be found on the application overview in azure app registrations.

- ```VITE_REDIRECT_URI```: The redirect URI of the application
- ```VITE_CLIENT_ID```: The azure Client Id of the application
- ```VITE_FAST_API_URI```: The fast api endpoint URI
- ```VITE_ORGANIZATIONS='FOCAL NAIM'``` Names of the organisations working together separated with a space.
- ```VITE_SUPPORT_LINK``` Link to a form for support purposes
Names of the organisations working together separated with a space.
- ```SSL_KEY_PATH='/certificates/project-kpi.verventaudio.com.key'```: SSL Key path for https
- ```SSL_CERT_PATH='/certificates/project-kpi.verventaudio.com.cer'```: SSL Certificate path for https
- ```SSL_KEY_PASSPHRASE```: If your SSL key is encrypted and need a passphrase, provide it.

Those environnement variables can be placed in a .env, or .env.local at the root of the frontend application

### Certificates
Pour un server frontend de développement, il est nécessaire d'inclure des certificats et clefs SSL. Ils doivent être placés dans ./certificates
- certificat: ```./certificates/project-kpi.verventaudio.com.cer```
- key: ```./certificates/project-kpi.verventaudio.com.key```

### Install application

```bash
npm install
```

Run local developpement application
```bash
npm run dev
```

Build project for production
```bash
npm run build
```

Type verifications
```bash
npm run type-check
```

Linting check
```bash
npm run lint
```

### Choices made

This frontend has been made the most accurate according to the fluent 2 design system. The first users of this application will be verventudio employees, which are fluent with the Microsoft ecosystem.

## Vue concepts

To understand the code, it is necessary to have an idea of the following notions:

This application is a [one page application](https://vuejs.org/guide/extras/ways-of-using-vue.html#embedded-web-components)

This project uses Vue 3 (not the same syntax as Vue 2)

It uses the [Typescript](https://www.typescriptlang.org/) language, which is a superset of Javascript.
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
- lodash : cloneDeep function, useful to make a copy of an array.
- dayjs: provide utilities for date manipulation. (format dates and weeks manipulation)
- date-fns : to be removed
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


## Change port frontend
Change port on package.json
Check if environnement variables have to change (espacially (VITE_REDIRECT_URI)) 
Change in the azure app declaration

## Vue compotent writting guidelines
The frontend app has quite a few guidelines :

### Vue compotent order
Whenever possible, if you work on this project please write foolowing this order :
It helps to keep the code a bit readabble :

- Imports
- Route, router initialization (useRoute, useRouter)
- Stores initialization (use[...]Store)
- Props
- Emits
- Constants
- Refs (if ref initialization need a computed, computed can be just ahead)
- Computed
- Methods
- Component initialization (onMounted, or plain code, etc...)

### Project data setup

Once the application has been installed, the project database needs to be completed.
In order to obtain reliable and useful KPIs, it is essential to fill in the projects correctly in the associated project page.
- Properties: Define the right properties for each project
- Capitalization: If a project is capitalizable during a given period, it is necessary to define at least the capitalization starts field, but also the capitalization ends field, when the project is no longer capitalizable.
- Project phase: Enter the dates of project phases.
- Forecast: Define a project start and end date, so that a complete forecast can be made each month.
