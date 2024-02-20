import {config} from 'dotenv';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

config();

const devMode = process.env.NODE_ENV !== 'production';
const hostname = devMode ? 'localhost' : process.env.HOSTNAME;
let https = false;
let httpsOptions;
if (!devMode) {
   const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERT)
   };
   https = httpsOptions;   
}
const port = devMode ? 8000 : process.env.PORT;

export default {
   input: 'src/index.js',
   output: {
      file: 'public/bundle.js',
      format: 'iife',
      sourcemap: devMode ? 'inline' : false,
   },
   plugins: [
      nodeResolve({
         extensions: ['.js', '.jsx']
      }),
      babel({
         babelHelpers: 'bundled',
         presets: ['@babel/preset-react'],
         extensions: ['.js', '.jsx'],
         exclude: 'node_modules/**'
      }),
      commonjs(),
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
         'process.env.HOSTNAME': JSON.stringify(process.env.HOSTNAME),
         'process.env.URL_SANDBOX': JSON.stringify(process.env.URL_SANDBOX),
         'process.env.URL_PRODUCTION': JSON.stringify(process.env.URL_PRODUCTION),
      }), 
      json(),
      nodePolyfills()
   ]
}