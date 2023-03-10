import postcss from "postcss";
// See: https://www.npmjs.com/package/postcss-jit-props
import postcssJitProps from "postcss-jit-props";
import postcssImport from "postcss-import";
// See: https://www.npmjs.com/package/open-props
import OpenProps from "open-props";


export const postcssInstance = postcss([
    postcssImport({
      addModulesDirectories: ["css_deps"],
    }),
    postcssJitProps(OpenProps),
  ]);