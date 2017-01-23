/*
*     功能： 用于CS样式编译
*    gulp-autoprefixer：设置浏览器版本自动处理浏览器前缀
*    主要插件：
*       1.gulp-sass：        ---   sass/scss编译
*       2.gulp-plumber：     ---   专门为gulp而生的错误处理库
*       3.browser-sync:      ---  浏览器同步测试工具
*       4.gulp-csscomb       ---    格式化css
*/

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cssComb = require("gulp-csscomb"),
    gulpIf = require("gulp-if");

// 工具模块
var util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

/* scss处理(所有scss汇入main.scss，然后编译成main.css) */
function scss(event, config, reload) {
    var cssConfig = config.cssConfig;

    return gulp.src(cssConfig.cssScssStyleSrc)   // sass文件编译成css
        .pipe(sass.sync(cssConfig.sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(cssConfig.prefixOptions))
        .pipe(cssComb())
        .pipe(gulp.dest(cssConfig.cssMainDist))
        .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(reload({stream: true}));
}

module.exports = {
    scss: scss
};
