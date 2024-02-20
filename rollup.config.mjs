import {config} from 'dotenv';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';


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
      nodePolyfills(),
      serve({
         open: true,
         contentBase: './public',
         host: hostname,
         port: port,
         https: https,
         verbose: true,
         onListening: function(server) {
            console.log("server", server);
            const address = server.address()
            const host = address.address === '::' ? 'localhost' : address.address
            // by using a bound function, we can access options as `this`
            const protocol = this.https ? 'https' : 'http'
            console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
         }
      }),
      livereload({ watch: './public' })
   ]
}