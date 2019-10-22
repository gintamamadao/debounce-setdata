const util = require("./util");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const babelOptions = {
    extensions,
    runtimeHelpers: true,
    presets: [
        [
            "@babel/env",
            {
                modules: false,
                targets: { chrome: "58", ie: "11" }
            }
        ]
    ]
};

module.exports = {
    input: util.resolve("src/index.js"),
    plugins: [
        commonjs({ extensions, ignore: ["conditional-runtime-dependency"] }),
        babel(babelOptions)
    ]
};
