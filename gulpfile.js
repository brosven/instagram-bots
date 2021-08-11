"use strict";

const {src, dest, series, watch} = require("gulp");
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const sourcemap = require("gulp-sourcemaps");
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();

function css () {
    return src("source/sass/style.scss")
    .pipe(plumber({
        errorHandler: function(err) {
          console.log(err);
          this.emit('end');
        }
      }))
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(dest("source/css"))
    .pipe(server.stream());
}; 

function serverStart () {
    server.init({
        server: "source/",
        notify: false,
        open: true,
        cors: true,
        ui: false
      });

    watch(["source/sass/**/*.{scss,sass}"], css);
    watch(["source/*.html"]).on("change", server.reload);
};

exports.css = css;
exports.serverStart = serverStart;
exports.start = series(css, serverStart);
