/*********************************************************
 *
 *   功能： 复制图片
 *   主要插件：
 *       1. gulp-changed              ---        监控文件，过滤未改动的文件
 *       2. browser-sync              ---        搭建web服务器
 *       3. del                       ---        删除文件
 *       4. vinyl-paths               ---        动态获取文件路径
 */

var gulp = require("gulp"),
    changed = require("gulp-changed"),
    del = require("del"),
    vinylPaths = require('vinyl-paths'),
    gulpIf = require("gulp-if");

// 工具模块
var util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

function images(event, config, reload) {
    var imagesConfig = config.imagesConfig;
    if(event.type === undefined) {
        return gulp.src([imagesConfig.imagesSrc])
            .pipe(plumberHandle())
            .pipe(gulp.dest(imagesConfig.imagesDist))
            .pipe(gulpIf(config.debug, msgHandle()));
    }else if(event.type == "added" || event.type == "changed" || event.type == "renamed"){
        return gulp.src(imagesConfig.imagesSrc)
            .pipe(plumberHandle())
            .pipe(gulp.dest(imagesConfig.imagesDist))
            .pipe(gulpIf(config.debug, msgHandle()));
    }else if(event.type == "deleted"){
        var delPath = event.path.replace(/\\/g, "/").replace(config.src, config.dist);  // 对删除路径处理
        return gulp.src(delPath)
            .pipe(vinylPaths(del))
            .pipe(gulpIf(config.debug, msgHandle()));
    }
}

module.exports = {
    images: images
};
