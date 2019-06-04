import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/heyColor.js',
  output: {
    sourcemap: true,
    compact: true,
    format: 'umd',
    name: 'HeyColor',
    file: './dist/heyColor.js'
  },
  plugins: [
    terser()
  ]
}