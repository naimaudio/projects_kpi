/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "@vue/eslint-config-typescript", "prettier"],
    parser: "vue-eslint-parser",
    plugins: ["@typescript-eslint", "prettier"],
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
    },
    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
    },
};
