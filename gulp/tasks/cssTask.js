/*
*     功能： 用于CS样式编译
*    gulp-autoprefixer：设置浏览器版本自动处理浏览器前缀
*    主要插件：
*       1.gulp-sass：        ---   sass/scss编译
*       2.gulp-rename：      ---   重命名
*       3.gulp-sourcemaps：  ---   一个信息文件，里面储存着位置信息
*       4.gulp-cssnano：     ---   cssnano执行各种优化，删除空白和注释，并且压缩代码
*       5.gulp-changed:      ---  监控文件，过滤未改动的文件
*       6.gulp-plumber：     ---   专门为gulp而生的错误处理库
*       7.browser-sync:      ---  浏览器同步测试工具
*       8.gulp-if：          ---   有条件的运行gulp任务
*       9.gulp-csscomb       ---    格式化css
*/

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    changed = require('gulp-changed'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    streamQueue = require("streamqueue"),
    del = require("del"),
    gulpIf = require("gulp-if"),
    vinylPaths = require('vinyl-paths');


// 工具模块
var util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

// 样式文件新增
function css(event, config, reload) {
    var cssConfig = config.cssConfig, cssOthers = [], cssOwn = [];
    if(config.phoneCss){
        // 手机端
        cssOthers.push(cssConfig.cssSrcRoot + "/**/**");
        cssOthers.push("!" + cssConfig.cssSrcRoot + "/main/**/**");
        cssOwn.push(cssConfig.cssSrc);
        cssOwn.push("!" + cssConfig.scssRootSrc + "/**/**");
        cssOwn.push("!" + cssConfig.cssSpriteSrc + "/**/**");
        cssOwn.push("!" + cssConfig.cssPhoneSpriteSrc + "/**/**");
    }else{
        cssOthers.push(cssConfig.cssSrcRoot + "/**/**");
        cssOthers.push("!" + cssConfig.cssSrcRoot + "/main/**/**");
        cssOwn.push(cssConfig.cssSrc);
        cssOwn.push("!" + cssConfig.scssRootSrc + "/**/**");
        cssOwn.push("!" + cssConfig.cssSpriteSrc + "/**/**");
    }

    // 复制css文件，包括层级
    if(event.type === undefined){
        gulp.src(cssOthers)
            .pipe(plumberHandle())
            .pipe(gulp.dest(cssConfig.cssDist));

        return gulp.src(cssOwn)
            .pipe(plumberHandle())
            .pipe(gulp.dest(cssConfig.cssDist))
            //.pipe(msgHandle())
            .pipe(reload({stream: true}));
    } else if(event.type == "added" || event.type == "changed" || event.type == "renamed"){
        gulp.src(cssOthers)
            .pipe(plumberHandle())
            .pipe(changed(cssConfig.cssDist))
            .pipe(gulp.dest(cssConfig.cssDist));

        return gulp.src(cssOwn)
            .pipe(plumberHandle())
            .pipe(changed(cssConfig.cssDist))
            .pipe(gulp.dest(cssConfig.cssDist))
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(reload({stream: true}));
    }else if(event.type == "deleted"){
        var delPath = event.path.replace(/\\/g, "/").replace(config.src, config.dist);  // 对删除路径处理
        return gulp.src(delPath)
            .pipe(vinylPaths(del))
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(reload({stream: true}));
    }
}

module.exports = {
    css: css
};
