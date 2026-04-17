import { createApp } from "vue";
import { defineIdentitySdkElements } from "@identity-verification/sdk/web-components";
import "@identity-verification/sdk/style.css";
import "./styles/globals.css";
import App from "./App.vue";
import { router } from "./routing/router";

// Registers idsdk-* custom elements once at app startup.
defineIdentitySdkElements();

createApp(App).use(router).mount("#app");
