const {src, dest, watch, series, parallel} = require("gulp");
const browserSync = require("browser-sync").create();

//Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const concat = require("gulp-concat");
const cssimport = require("gulp-cssimport");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const fileInclude = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const size = require("gulp-size");
const groupCssMediaQueries = require("gulp-group-css-media-queries");
const sass = require("gulp-sass")(require("sass"));
// const imagemin = require("gulp-imagemin");
// const newer = require("gulp-newer");
// const fonter = require("gulp-fonter");
// const ttf2woff2 = require("gulp-ttf2woff2");
const del = require("del");


//Обработка html
const html = () => {
    return src("./src/html/*.html")
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: "HTML",
                message: error.message
            }))
        }))
        .pipe(fileInclude())
        .pipe(size({ title: "До сжатия"}))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(size({ title: "После сжатия"}))
        .pipe(dest("./public"))
        .pipe(browserSync.stream())
}

//Обработка css
const css = () => {
    return src("./src/css/*.css", {sourcemaps: true})
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: "CSS",
                message: error.message
            }))
        }))
        .pipe(concat("main.css"))
        .pipe(cssimport())
        .pipe(autoprefixer())
        .pipe(groupCssMediaQueries())
        .pipe(size({ title: "До сжатия"}))
        .pipe(dest("./public/css", {sourcemaps: true}))
        .pipe(rename({ suffix: ".min"}))
        .pipe(csso())
        .pipe(size({ title: "После сжатия"}))
        .pipe(dest("./public/css", {sourcemaps: true}))
        .pipe(browserSync.stream())
}

//Обработка scss
const scss = () => {
    return src("./src/sass/*.scss", {sourcemaps: true})
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: "SCSS",
                message: error.message
            }))
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(groupCssMediaQueries())
        .pipe(size({ title: "До сжатия"}))
        .pipe(dest("./public/css", {sourcemaps: true}))
        .pipe(rename({ suffix: ".min"}))
        .pipe(csso())
        .pipe(size({ title: "После сжатия"}))
        .pipe(browserSync.stream())
        .pipe(dest("./public/css", {sourcemaps: true}))
        .pipe(browserSync.stream())
}

//Обработка js
const js = () => {
    return src("./src/js/*.js", {sourcemaps: true})
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: "JS",
                message: error.message
            }))
        }))
        .pipe(dest("./public/js", {sourcemaps: true}))
        .pipe(browserSync.stream())
}

//Обработка изображений
const img = () => {
    return src("./src/img/*.*")
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: "Image",
                message: error.message
            }))
        }))
        // .pipe(newer("./public/img"))
        // .pipe(imagemin({
        //     verbose: true
        // }))
        .pipe(dest("./public/img"))
        .pipe(browserSync.stream())
}

//Шрифты
const font = () => {
    return src("./src/font/*.*")
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: "Font",
                message: error.message
            }))
        }))
        // .pipe(newer("./public/font"))
        // .pipe(fonter({
        //     formats: ["ttf", "woff", "eot", "svg"]
        // }))
        // .pipe(dest("./public/font"))
        // .pipe(ttf2woff2())
        .pipe(dest("./public/font"))
}


// Удаление директории
const clear = () => {
    return del("./public");
}

//Сервер
const server = () => {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
}


//Наблюдение
const watcher = () => {
    watch("./src/html/**/*.html", html);
    // watch("./src/css/**/*.css", css);
    watch("./src/sass/**/*.scss", scss).on("all", browserSync.reload);
    watch("./src/js/**/*.js", js).on("all", browserSync.reload);
    watch("./src/img/**/*.{png, jpg, jpeg, gif, svg}", img).on("all", browserSync.reload);
    watch("./src/font/*.{eot, ttf, otf, otc, ttc, woff, woff2, svg}", font).on("all", browserSync.reload);
}


//задачи
exports.html = html;
// exports.css = css;
exports.scss = scss;
exports.img = img;
exports.js = js;
exports.font = font;
exports.watch = watcher;
exports.clear = clear;


//сборка
exports.dev = series(
    clear,
    parallel(html, scss, js, img, font),
    parallel(watcher, server)
);
