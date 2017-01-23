/* gulp配置参数 */
var fs = require("fs");

var src = 'src';    //源码地址
var dist = 'dist';  // 临时开发目录
var publish = "publish";   // 发布目录

module.exports = function (options) {
    if(options.env === "publish"){
        dist = publish;
    }else if(options.env === "local"){
        dist = src;
    }
    var basePath = options.path.replace(/\\/gi, "/").substr(options.path.replace(/\\/gi, "/").indexOf("project"), options.path.replace(/\\/gi, "/").length);
    src = basePath + src;
    dist = basePath + dist;
    console.log(dist);

    // 浏览器服务设置  ----------------------------------------------------------
    var browserConfig = {
        development: {
            notify: false,
            open: "external",
            port: options.port ? options.port:8012,
            startPath: "index.html",
            // 在chrome、firefix下打开该站点
            // browser: ["google chrome", "firefox", "iexplore"],
            server: {
                baseDir: dist
            }
        },
        product: {
            notify: false,
            open: "external",
            port: 9012,
            startPath: "index.html",
            browser: ["google chrome", "firefox", "iexplore"],
            server: {
                baseDir: [src, dist]
            }
        },
        local: {
            notify: false,
            open: "external",
            port: 8013,
            startPath: "index.html",
            // 在chrome、firefix下打开该站点
            // browser: ["google chrome", "firefox", "iexplore"],
            server: {
                baseDir: dist
            }
        }
    };

    // 样式编译设置  -------------------------------------------------------
    var cssConfig = {
        cssSrcRoot: src + "/css",
        cssSrc: src + "/css/**/*.css",
        scssRootSrc: src + '/css/main/scss',
        cssScssSrc: src + "/css/main/scss/*.scss", //需要编译的scss
        cssScssStyleSrc: src + "/css/main/scss/main.scss", //需要编译的scss
        cssStyleSrc: src + "/css/main/scss/main.css", //需要编译的scss
        cssSpriteSrc: src + "/css/main/sprite", // 雪碧图生成的样式文件路径
        cssPhoneSpriteSrc: src + "/css/main/phoneSprite", // 雪碧图生成的样式文件路径
        cssSpriteDist: src + "/css/main/sprite",
        cssDist: dist + "/css", //最终输出目录
        cssMainDist: src + "/css/main",    // main css路径
        cssMsg: "css编译完成！", // 任务完成后的提示
        scssMsg: "scss编译完成！", // 任务完成后的提示
        sassOptions: { //编译scss过程需要的配置，可以为空
            outputStyle: 'nested'
            //indentWidth: 0
            // includePaths: ['.'],
            // noCache: true
        },
        prefixOptions: { // 添加浏览器前缀时的配置，可以为空
            browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }
    };

    // 脚本 参数 --------------------------------------------------------
    var scriptConfig = {
        scriptSrcRoot: src + "/js",
        scriptSrc: src + '/js/**/*.js',
        scriptDist: dist + '/js',
        scriptMsg: "javascript编译完成！", // 任务完成后的提示
        isUglify: false, // 是否压缩
        jshint: false, // 是否语法验证
        loadMaps: false,    // 是否生成
        isRename: false,
        rename: { // 重命名配置
            suffix: '.min' // 加后缀
        },
        loadMapsPath: './' // sourcemaps文件生成位置。不指定的情况下，sourcemaps信息直接写入到当前css文件中
    };

    // html 参数 --------------------------------------------------------
    var htmlConfig = {
        htmlSrcRoot: src,
        htmlSrc: src + '/**/*.html',
        pugUse: false,
        pugSrc: src + "/**/*.pug",
        htmlRootSrc: src,
        htmlDist: dist,
        ignore: src + "/module",
        htmlMsg: "html编译完成"
    };

    // pug 参数 --------------------------------------------------------
    var pugConfig = {
        pugSrcRoot: src,
        pugUse: true,
        pugSrc: src + '/**/*.pug',
        pugDist: dist,
        ignore: src + "/modulePug",
        htmlMsg: "pug编译完成"
    };

    // images 参数 --------------------------------------------------------
    var imagesConfig = {
        imagesSrcRoot: src + '/css/main/images',
        imagesSrc: src + '/css/main/images/**/**',
        imagesDist: dist + "/css/main/images"
    };

    // 雪碧图 生成设置 --------------------------------------------------------
    var spriteConfig = {
        sprintSrc: src + '/css/main/sprite/*.*',
        sprintDist: dist + '/css/main/',
        spriteCssOut: src + '/css/main',
        spriteCssScssOut: src + '/css/main/scss',

        sprintOptions: {
            imgName: 'images/sprite.png', //保存合并后图片的地址
            //cssName: 'sprite.css', //保存合并后对于css样式的地址
            cssName: 'sprite.css', //保存合并后对于css样式的地址
            padding: 5, //合并时两个图片的间距
            //algorithm: '' //注释1
            cssTemplate: './gulp/css.handlebars', // 输出雪碧图css模板
            cssVarMap: function(sprite) {
                // -hover -> :hover     -active -> .active  btn- -> "btn:hover .icon-" btnActive- -> "btn.active .icon-"  btnActiveHover -> "btn.active:hover .icon-"
                // collapsed- -> collapsed.collapsed .  collapsed-fold- -> collapsed .
                var hover = ":hover";
                var active = ".active";
                var btn = "btn:hover .icon-";
                var btnActive = "btn.active .icon-";
                var btnActiveHover = "btn.active:hover .icon-";
                var collapsed = "collapsed.collapsed .icon-";
                var collapsedOpen = "collapsed .icon-";
                var choiced = "choiced .icon-";
                var cName = "";

                var beginName = sprite.name;
                if (beginName.indexOf('-hover') !== -1) {
                    cName = beginName.replace(/-hover/gi, hover);
                }
                if (beginName.indexOf('-active') !== -1) {
                    cName = beginName.replace(/-active/gi, active);
                }
                if (beginName.indexOf('btn-') !== -1) {
                    cName = beginName.replace(/btn-/gi, btn);
                }
                if (beginName.indexOf('btnActive-') !== -1) {
                    cName = beginName.replace(/btnActive-/gi, btnActive);
                }
                if (beginName.indexOf('btnActiveHover-') !== -1) {
                    cName = beginName.replace(/btnActiveHover-/gi, btnActiveHover);
                }
                if (beginName.indexOf('choiced-') !== -1) {
                    cName = beginName.replace(/choiced-/gi, choiced);
                }
                if (beginName.indexOf('collapsed-') !== -1) {
                    if (beginName.indexOf('collapsed-fold-') !== -1) {
                        cName = beginName.replace(/collapsed-fold-/gi, collapsedOpen);
                    }else{
                        cName = beginName.replace(/collapsed-/gi, collapsed);
                    }
                }

                if(cName != ""){
                    sprite.name = cName;
                }
             }
        },
        sprintMsg: "雪碧图生成完成！",
        prefixOptions: { // 添加浏览器前缀时的配置，可以为空
            browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }
    };

    var mulSpriteConfig = {
        sprintMulSrc: 'mulSprite',
        sprintMulDist: 'mulSpriteOut',
        sprintOptions: {
            imgName: 'images/sprite.png', //保存合并后图片的地址
            //cssName: 'sprite.css', //保存合并后对于css样式的地址
            cssName: 'sprite.css', //保存合并后对于css样式的地址
            padding: 10, //合并时两个图片的间距
            cssTemplate: '../../gulp/css.handlebars', // 输出雪碧图css模板
            cssVarMap: function(sprite) {
                // -hover -> :hover     -active -> .active  btn- -> "btn "
                // collapsed- -> collapsed.collapsed .  collapsed-fold- -> collapsed .
                var hover = ":hover";
                var active = ".active";
                var btn = "btn:hover .icon-";
                var btnActive = "btn.active .icon-";
                var btnActiveHover = "btn.active:hover .icon-";
                var collapsed = "collapsed.collapsed .icon-";
                var collapsedOpen = "collapsed .icon-";
                var choiced = "choiced .icon-";
                var cName = "";

                var beginName = sprite.name;
                if (beginName.indexOf('-hover') !== -1) {
                    cName = beginName.replace(/-hover/gi, hover);
                }
                if (beginName.indexOf('-active') !== -1) {
                    cName = beginName.replace(/-active/gi, active);
                }
                if (beginName.indexOf('btn-') !== -1) {
                    cName = beginName.replace(/btn-/gi, btn);
                }
                if (beginName.indexOf('btnActive-') !== -1) {
                    cName = beginName.replace(/btnActive-/gi, btnActive);
                }
                if (beginName.indexOf('btnActiveHover-') !== -1) {
                    cName = beginName.replace(/btnActiveHover-/gi, btnActiveHover);
                }
                if (beginName.indexOf('choiced-') !== -1) {
                    cName = beginName.replace(/choiced-/gi, choiced);
                }
                if (beginName.indexOf('collapsed-') !== -1) {
                    if (beginName.indexOf('collapsed-fold-') !== -1) {
                        cName = beginName.replace(/collapsed-fold-/gi, collapsedOpen);
                    }else{
                        cName = beginName.replace(/collapsed-/gi, collapsed);
                    }
                }

                if(cName != ""){
                    sprite.name = cName;
                }
            }
        },
        sprintMsg: "多雪碧图生成完成！"
    };

    var phoneSprite = {
        sprintSrc: src + '/css/main/phoneSprite/*.*',
        sprintTemp: '.tmp',
        spriteDist: dist + '/css/main/',
        spriteCssOut: src + '/css/main',
        spriteCssScssOut: src + '/css/main/scss',

        sprintOptions: {
            imgName: 'images/phoneSprite.png', //保存合并后图片的地址
            //cssName: 'sprite.css', //保存合并后对于css样式的地址
            cssName: 'phoneSprite.css', //保存合并后对于css样式的地址
            padding: 10, //合并时两个图片的间距
            //algorithm: '' //注释1
            cssTemplate: './gulp/phoneCss.handlebars', // 输出雪碧图css模板
            cssVarMap: function (sprite) {
                // -hover -> :hover     -active -> .active  btn- -> "btn:hover .icon-" btnActive- -> "btn.active .icon-"  btnActiveHover -> "btn.active:hover .icon-"
                // collapsed- -> collapsed.collapsed .  collapsed-fold- -> collapsed .
                var hover = ":hover";
                var active = ".active";
                var btn = "btn:hover .icon-";
                var btnActive = "btn.active .icon-";
                var btnActiveHover = "btn.active:hover .icon-";
                var collapsed = "collapsed.collapsed .icon-";
                var collapsedOpen = "collapsed .icon-";
                var choiced = "choiced .icon-";
                var cName = "";

               /* if(sprite.name == "back-top"){
                    console.log("width:" + sprite.width);
                    console.log("height:" + sprite.height);
                    console.log("x:" + sprite.x);
                    console.log("y:" + sprite.y);
                }*/

                var beginName = sprite.name;
                if (beginName.indexOf('-hover') !== -1) {
                    cName = beginName.replace(/-hover/gi, hover);
                }
                if (beginName.indexOf('-active') !== -1) {
                    cName = beginName.replace(/-active/gi, active);
                }
                if (beginName.indexOf('btn-') !== -1) {
                    cName = beginName.replace(/btn-/gi, btn);
                }
                if (beginName.indexOf('btnActive-') !== -1) {
                    cName = beginName.replace(/btnActive-/gi, btnActive);
                }
                if (beginName.indexOf('btnActiveHover-') !== -1) {
                    cName = beginName.replace(/btnActiveHover-/gi, btnActiveHover);
                }
                if (beginName.indexOf('choiced-') !== -1) {
                    cName = beginName.replace(/choiced-/gi, choiced);
                }
                if (beginName.indexOf('collapsed-') !== -1) {
                    if (beginName.indexOf('collapsed-fold-') !== -1) {
                        cName = beginName.replace(/collapsed-fold-/gi, collapsedOpen);
                    } else {
                        cName = beginName.replace(/collapsed-/gi, collapsed);
                    }
                }

                if (cName != "") {
                    sprite.name = cName;
                }

                /* 1. 图片长宽、位置都除2 */
                sprite.width  = parseInt(sprite.width)/2;
                sprite.height = parseInt(sprite.height)/2;
                sprite.x = parseInt(sprite.x)/2;
                sprite.y = parseInt(sprite.y)/2;

                /* 2.如果总长宽有小数点，图片位置长宽减0.5  */
                var totalW = parseInt(sprite.total_width)/2;
                var totalH = parseInt(sprite.total_height)/2;
                if(totalW.toString().indexOf(".") != -1){
                    if(sprite.x > 0){
                        sprite.x -= 0.5;
                    }
                    sprite.width += 1;
                }
                if(totalH.toString().indexOf(".") != -1){
                    if(sprite.y > 0){
                        sprite.y -= 0.5;
                    }
                    sprite.height += 1;
                }

                /* 3. 将长宽位置都转变为整数 */
                var xFlag = false, yFlag = false;
                if(sprite.x.toString().indexOf(".") != -1){
                    sprite.x = Math.floor(sprite.x);
                    xFlag = true;
                }
                if(xFlag){
                    if(sprite.width.toString().indexOf(".") != -1){
                        sprite.width = Math.ceil(sprite.width);
                    }else{
                        sprite.width += 1;
                    }
                }else{
                    sprite.width = Math.ceil(sprite.width);
                }
                if(sprite.y.toString().indexOf(".") != -1){
                    sprite.y = Math.floor(sprite.y);
                    yFlag = true;
                }
                if(yFlag){
                    if(sprite.height.toString().indexOf(".") != -1){
                        sprite.height = Math.ceil(sprite.height);
                    }else{
                        sprite.height += 1;
                    }
                }else{
                    sprite.height = Math.ceil(sprite.height);
                }
                /*if(sprite.name == "back-top"){
                    console.log("width:" + sprite.width);
                    console.log("height:" + sprite.height);
                    console.log("x:" + sprite.x);
                    console.log("y:" + sprite.y);
                }*/
            }
        },
        sprintMsg: "雪碧图生成完成！",
        prefixOptions: { // 添加浏览器前缀时的配置，可以为空
            browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }
    };

    /* icheckbox、iradio */
    var iChoiceConfig = {
        sprintSrc: 'iChoice/',
        sprintDist: 'iChoiceOut/',

        sprintOptions: {
            imgName: 'images/sprite.png', //保存合并后图片的地址
            cssName: 'iChoice.css', //保存合并后对于css样式的地址
            padding: 10, //合并时两个图片的间距
            cssTemplate: 'gulp/iChoice.handlebars', // 输出雪碧图css模板
            cssVarMap: function (sprite) {
                // checked- -> .checked    ||     -disabeld  -> .disabled       ||       -checked-disabled -> .checked.disabled
                var checked = ".checked";
                var disabled = ".disabled";
                var cName = "";

                var beginName = sprite.name;
                if (beginName.indexOf('-checked') !== -1) {
                    cName = beginName.replace(/-checked/gi, checked);
                }
                if (beginName.indexOf('-disabled') !== -1) {
                    cName = beginName.replace(/-disabled/gi, disabled);
                }

                if (cName != "") {
                    sprite.name = cName;
                }
            }
        },
        sprintMsg: "雪碧图生成完成！"
    };

    // 清除 参数 --------------------------------------------------------
    var cleanConfig = { // 清除目录
        src: [basePath + "dist", basePath + "publish/*.*",  basePath + "publish/js",  basePath + "publish/css", "!" + basePath + "publish/.svn"]
    };

    /* 动态设置 */
    // 用于手机端同时包含字体图标、雪碧图
    function fsExistsSync(path) {
        try{
            fs.accessSync(path,fs.F_OK);
        }catch(e){
            return false;
        }
        return true;
    }

    if(!fsExistsSync(basePath + "src/css/main/sprite")){
        //web端雪碧图目录sprite不存在，则为纯手机端（只包含字体图标、手机端雪碧图）
        phoneSprite.sprintOptions.cssTemplate = './gulp/phoneFontCss.handlebars';
    }

    return {
        src: src,
        dist: dist,
        browserSync: browserConfig,
        cssConfig: cssConfig,
        scriptConfig: scriptConfig,
        sprintConfig: spriteConfig,
        iChoiceConfig: iChoiceConfig,
        mulSpriteConfig: mulSpriteConfig,
        phoneSprite: phoneSprite,
        htmlConfig: htmlConfig,
        pugConfig: pugConfig,
        imagesConfig: imagesConfig,
        cleanConfig: cleanConfig,
        debug: false
    }
};
