/*
*   功能： 用于HTML页面的编译
*   主要插件：
*       1. gulp-rename：        ----        重命名
*       2. gulp-sourcemaps：    ----        一个信息文件，里面储存着位置信息
*       3. gulp-changed:        ----       监控文件，过滤未改动的文件
*       4. browser-sync:        ----       浏览器同步测试工具
*       5. gulp-if：            ----        有条件的运行gulp任务
*       6. gulp-uglify:         ----       js压缩
*       7. gulp-babel:          ----       支持ECMAScript
*       8. gulp-jshint:         ----       js检查
*/

var gulp = require('gulp'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    del = require("del"),
    vinylPaths = require('vinyl-paths'),
    streamQueue = require("streamqueue"),
    gulpIf = require("gulp-if");

// 工具模块
var localUtil = require('./util');
var util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

function script(event, config, reload) {
    var scriptConfig = config.scriptConfig;

    if(event.type === undefined){
        gulp.src([scriptConfig.scriptSrcRoot + "/**/**", "!" + scriptConfig.scriptSrc])
            .pipe(plumberHandle())    // 防止管道中断
            .pipe(gulp.dest(scriptConfig.scriptDist));
        return gulp.src(scriptConfig.scriptSrc)
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.init()))  // 是否生成sourcemaps, loadMaps为true，执行
            .pipe(plumberHandle())    // 防止管道中断
            .pipe(babel())  //  编译ES6格式代码
            .pipe(gulpIf(scriptConfig.jshint, jshint()))    // javascript语法检验
            .pipe(gulpIf(scriptConfig.jshint, jshint.reporter('default')))
            .pipe(gulpIf(scriptConfig.jshint, jshint.reporter('fail')))
            .pipe(gulpIf(scriptConfig.isUglify, uglify()))  // javascript压缩
            .pipe(gulpIf(scriptConfig.isRename, rename(scriptConfig.rename))) // 重命名
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.write(scriptConfig.loadMapsPath))) // 生成sourcemaps
            .pipe(gulp.dest(scriptConfig.scriptDist)) // 输入到目的文件夹
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(reload({stream: true}));
    } else if(event.type == "added" || event.type == "changed" || event.type == "renamed"){
        gulp.src([scriptConfig.scriptSrcRoot + "/**/**", "!" + scriptConfig.scriptSrc])
            .pipe(plumberHandle())    // 防止管道中断
            .pipe(gulp.dest(scriptConfig.scriptDist));

        return gulp.src(scriptConfig.scriptSrc)
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.init()))  // 是否生成sourcemaps, loadMaps为true，执行
            .pipe(plumberHandle())    // 防止管道中断
            .pipe(changed(scriptConfig.scriptDist))
            .pipe(babel())  //  编译ES6格式代码
            .pipe(gulpIf(scriptConfig.jshint, jshint()))    // javascript语法检验
            .pipe(gulpIf(scriptConfig.jshint, jshint.reporter('default')))
            .pipe(gulpIf(scriptConfig.jshint, jshint.reporter('fail')))
            .pipe(gulpIf(scriptConfig.isUglify, uglify()))  // javascript压缩
            .pipe(gulpIf(scriptConfig.isRename, rename(scriptConfig.rename))) // 重命名
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.write(scriptConfig.loadMapsPath))) // 生成sourcemaps
            .pipe(gulp.dest(scriptConfig.scriptDist)) // 输入到目的文件夹
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
    script: script
};
