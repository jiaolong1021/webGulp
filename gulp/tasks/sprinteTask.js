/*
 *   功能： 生成雪碧图
 *   主要插件：
 *       1. gulp.spritesmith          ---        将一个图片集转换成一个雪碧图，并生成对应样式
 *       2. browser-sync              ---       创建web服务器
 *       3. gulp-changed              ---       监控文件，过滤未改动的文件
 *       4. gulp-rename               ---       重命名
 *       5. gulp-concat               ---       合并多个文件
 *       6. del                       ---        删除文件
 *       7. vinyl-paths               ---        动态获取文件路径
 *
 * */

var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    changed = require("gulp-changed"),
    rename = require("gulp-rename"),
    streamQueue = require("streamqueue"),
    concat = require("gulp-concat"),
    fs = require("fs"),
    gulpIf = require("gulp-if");

// 工具模块
var util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

/**
 * 生成雪碧图
 */
function sprite(config, reload) {
    var spriteConfig = config.sprintConfig;
    var spriteData = gulp.src(spriteConfig.sprintSrc)
        .pipe(plumberHandle())
        .pipe(spritesmith(spriteConfig.sprintOptions));
    var imgStream = spriteData.img;
    var cssStream = spriteData.css;

    cssStream
        .pipe(plumberHandle())
        .pipe(rename("sprite.scss"))
        .pipe(gulp.dest(spriteConfig.spriteCssScssOut));

    return imgStream
        .pipe(plumberHandle())
        .pipe(gulp.dest(spriteConfig.sprintDist))
        .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(reload({stream: true}));
}

/*
*   生成手机端用雪碧图
* */
function phoneSpriteBegin(config, reload) {
    var  phoneSprite = config.phoneSprite, spriteConfig = config.sprintConfig;

    // 1.把所有生成文件拷贝到临时文件夹.tmp下
    var spriteData = gulp.src(spriteConfig.sprintSrc)
        .pipe(plumberHandle())
        .pipe(spritesmith(spriteConfig.sprintOptions));
    var imgStream = spriteData.img;
    var cssStream = spriteData.css;

    var phoneSpriteData = gulp.src(phoneSprite.sprintSrc)
        .pipe(plumberHandle())
        .pipe(spritesmith(phoneSprite.sprintOptions));
    var phoneImgStream = phoneSpriteData.img;
    var phoneCssStream = phoneSpriteData.css;

    imgStream
        .pipe(plumberHandle())
        .pipe(gulp.dest(spriteConfig.sprintDist));

    cssStream
        .pipe(plumberHandle())
        .pipe(rename("sprite.scss"))
        .pipe(gulp.dest(spriteConfig.spriteCssScssOut))

     phoneCssStream
        .pipe(plumberHandle())
        .pipe(rename("phoneSprite.scss"))
        .pipe(gulp.dest(phoneSprite.spriteCssScssOut));

    return phoneImgStream
        .pipe(plumberHandle())
        .pipe(gulp.dest(phoneSprite.spriteDist))
        .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(reload({stream: true}));
}

/**
 * 手机端开启后生成雪碧图
 */
function phoneSprite(config, reload) {
    var phoneSprite = config.phoneSprite;
    var phoneSpriteData = gulp.src(phoneSprite.sprintSrc)
        .pipe(plumberHandle())
        .pipe(spritesmith(phoneSprite.sprintOptions));
    var phoneImgStream = phoneSpriteData.img;
    var phoneCssStream = phoneSpriteData.css;

    phoneCssStream
        .pipe(plumberHandle())
        .pipe(rename("phoneSprite.scss"))
        .pipe(gulp.dest(phoneSprite.spriteCssScssOut));

    return phoneImgStream
        .pipe(plumberHandle())
        .pipe(gulp.dest(phoneSprite.spriteDist))
        .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(reload({stream: true}));
}

/*
 *   生成多个雪碧图
 * */
function mulSprite(mulSpriteConfig) {
    var fileList = fs.readdirSync("mulSprite");

    /* 同时生成多个雪碧图 */
    for(var i=0; i<fileList.length; i++){
        if(fileList[i].indexOf(".") == -1){
            mulSpriteConfig.sprintOptions.imgName = "images/" + fileList[i] + ".png";
            // 除去图片、out目录的外的所有目录
            gulp.src(mulSpriteConfig.sprintMulSrc + "/" + fileList[i] + "/*.*")
                .pipe(spritesmith(mulSpriteConfig.sprintOptions))
                .pipe(gulp.dest(mulSpriteConfig.sprintMulDist + "/" + fileList[i]));
        }
    }
}

/*
 *   生成iChoice雪碧图
 * */
function iChoice(config) {
    var iChoiceConfig =  config.iChoiceConfig;
    var basePath = config.src.split('src')[0];
    var fileList = fs.readdirSync(basePath + "/iChoice");

    /* 同时生成多个雪碧图 */
    for(var i=0; i<fileList.length; i++){
        if(fileList[i].indexOf(".") == -1){
            iChoiceConfig.sprintOptions.imgName = "images/" + fileList[i] + ".png";
            // 除去图片、out目录的外的所有目录
            gulp.src(basePath + iChoiceConfig.sprintSrc + "/" + fileList[i] + "/*.*")
                .pipe(spritesmith(iChoiceConfig.sprintOptions))
                .pipe(gulp.dest(basePath + iChoiceConfig.sprintDist + "/" + fileList[i]));
        }
    }
}

module.exports = {
    sprite: sprite,
    mulSprite: mulSprite,
    iChoice: iChoice,
    phoneSprite: phoneSprite,
    phoneSpriteBegin: phoneSpriteBegin
};