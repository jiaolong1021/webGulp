/*
*   功能： 用于HTML页面的编译
*   主要插件：
*       1. gulp-changed              ---        监控文件，过滤未改动的文件
*       2. gulp-content-includer     ---        替换html中includer引用的公用模块
*       3. gulp-html-replace         ---        替换html中的代码片段
*       4. gulp-jsbeautifier         ---        美化html、css、js代码
*       5. browser-sync              ---        搭建web服务器
*       6. streamqueue              ---         依次执行流
*
* */

var gulp = require("gulp"),
    changed = require("gulp-changed"),
    pug = require("gulp-pug"),
    beautifier = require("gulp-jsbeautifier"),
    del = require("del"),
    vinylPaths = require('vinyl-paths'),
    gulpIf = require("gulp-if");

// 工具模块
var localUtil = require("./util"),
    plumberHandle = localUtil.plumberHandle,
    msgHandle = localUtil.msgTipHandle;

/*
*   pug编译
* */
function pugBuild(event, config, reload) {
    var pugConfig = config.pugConfig;

    if(pugConfig.pugUse){
        if(event.type === undefined){
            // 刚启动时，pug编译
            return gulp.src([pugConfig.pugSrc, "!" + pugConfig.ignore + "/**/**"])
                .pipe(plumberHandle())
                .pipe(pug({}))
                .pipe(beautifier())
                .pipe(gulp.dest(pugConfig.pugDist))
                .pipe(gulpIf(config.debug, msgHandle()))
                .pipe(reload({ stream: true}));
        }else if(event.type == "added" || event.type == "changed" || event.type == "renamed"){
            // pug新增、有改变
            return gulp.src([pugConfig.pugSrc, "!" + pugConfig.ignore + "/**/**"])
                .pipe(plumberHandle())
                //.pipe(changed(pugConfig.pugDist))
                .pipe(pug({}))
                .pipe(beautifier())
                .pipe(gulp.dest(pugConfig.pugDist))
                .pipe(gulpIf(config.debug, msgHandle()))
                .pipe(reload({ stream: true}));
        }else if(event.type == "deleted"){
            // 删除pug对应的html文件
            var delPath = event.path.replace(/\\/g, "/").replace(config.src, config.dist).replace(".pug", ".html");  // 对删除路径处理
            return gulp.src(delPath)
                .pipe(vinylPaths(del))
                .pipe(gulpIf(config.debug, msgHandle()))
                .pipe(reload({stream: true}));
        }
    }
}

module.exports = {
    pugBuild: pugBuild
};


















