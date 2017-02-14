/*
 *   功能： gulp任务执行的默认路径
 *   主要插件：
 *       1. gulp                      ---        gulp基础组件
 *       2. del                       ---        删除文件
 *       3. minimist                  ---        解析参数选项变为json对象
 *       4. browser-sync              ---        搭建web服务器
 *
 * */

var gulp = require('gulp'),        // 基础库
    minimist = require('minimist'),
    del = require('del'),
    browserSync = require('browser-sync'),
    runSequence = require("run-sequence"),
    reload = browserSync.reload;

var knownOptions = {
    string: 'env',
    default: {
        env: 'production'
    }
};

// 引入配置参数
var options = minimist(process.argv.slice(2), knownOptions);
var config = require('./gulp/config.js')(options);

/* 引入独立任务模块, 建立多个任务 */
var taskBasePath = "./gulp/tasks/";
var htmlTask = require(taskBasePath + 'htmlTask'),
    cssTask = require(taskBasePath + 'cssTask'),
    scssTask = require(taskBasePath + 'scssTask'),
    scriptsTask = require(taskBasePath + 'scriptsTask'),
    imagesTask = require(taskBasePath + 'imagesTask'),
    sprinteTask = require(taskBasePath + 'sprinteTask'),
    pugTask = require(taskBasePath + 'pugTask');

gulp.task('html', function () {
    return htmlTask.html({}, config, reload);
});
gulp.task('script', function () {
    return scriptsTask.script({}, config, reload);
});
gulp.task('sprite', function () {
    return sprinteTask.sprite(config, reload);
});
gulp.task('images', function () {
    return imagesTask.images({}, config, reload);
});
gulp.task('scss', function () {
    return scssTask.scss({}, config, reload);
});
gulp.task('css', function () {
    return cssTask.css({}, config, reload);
});
gulp.task('htmlInclude', function () {
    return htmlTask.htmlInclude({}, config, reload);
});

/* 手机端雪碧任务 */
gulp.task('phoneSprite', function () {
    return sprinteTask.phoneSprite(config, reload);
});
gulp.task('phoneSpriteBegin', function () {
    return sprinteTask.phoneSpriteBegin(config, reload);
});
gulp.task('phoneCss', function () {
    config.phoneCss = true; // 设置变量为true时，为phoneCss任务
    return cssTask.css({}, config, reload);
});
gulp.task('pug', function () {
    return pugTask.pugBuild({}, config, reload);
});

// 启动web开发环境的服务
gulp.task('serve', function() {
	runSequence(['clean'], ['scss', 'sprite', 'pug'], ['images', 'script', 'html', 'css'], function () {
		browserSync(config.browserSync.development);

		gulp.watch(config.sprintConfig.sprintSrc, ['sprite']); // 监控雪碧图任务
		gulp.watch(config.cssConfig.scssRootSrc + "/*.scss", ['scss']); // 监控scss样式源文件
		gulp.watch(config.cssConfig.cssSrcRoot + "/**/**", function (event) {cssTask.css(event, config, reload); });  // 监控css样式源文件
		gulp.watch(config.imagesConfig.imagesSrcRoot + "/**/**", function (event) { imagesTask.images(event, config, reload); }); // 监控所有图片
		gulp.watch(config.scriptConfig.scriptSrcRoot + "/**/**", function (event) {scriptsTask.script(event, config, reload); }); // 监控js源文件
		gulp.watch([config.htmlConfig.htmlSrc], function (event) {htmlTask.html(event, config, reload);});   // 监控html源文件
		gulp.watch([config.pugConfig.pugSrc], function (event) {pugTask.pugBuild(event, config, reload);});   // 监控pug源文件
		gulp.watch(config.htmlConfig.ignore + "/**/**", ['htmlInclude']); // include模块内容监控
		gulp.watch([config.dist + "/css/main/images/**/**"]).on('change', reload);// 监控目标文件夹下雪碧变化
	});
});

/* 编辑同时适应手机、web端的响应式页面服务器 */
gulp.task('phoneServe', function() {
    runSequence(['clean'], ['scss', 'phoneSpriteBegin', 'pug'], ['images', 'script', 'html', 'phoneCss'], function () {
	    browserSync(config.browserSync.development);

	    gulp.watch(config.sprintConfig.sprintSrc, ['sprite']); // 监控雪碧图任务
	    gulp.watch(config.phoneSprite.sprintSrc, ['phoneSprite']);  // 监控手机雪碧图任务
	    gulp.watch(config.cssConfig.cssSrcRoot + "/**/**", function (event) {cssTask.css(event, config, reload) });  // 监控css样式源文件
	    gulp.watch(config.cssConfig.scssRootSrc + "/*.scss", function (event) {scssTask.scss(event, config, reload) }); // 监控scss样式源文件
	    gulp.watch(config.imagesConfig.imagesSrcRoot + "/**/**", function (event) { imagesTask.images(event, config, reload); }); // 监控所有图片
	    gulp.watch(config.scriptConfig.scriptSrcRoot + "/**/**", function (event) {scriptsTask.script(event, config, reload); }); // 监控js源文件
	    gulp.watch([config.htmlConfig.htmlSrc, "!" + config.htmlConfig.ignore + "/**/**"], function (event) {htmlTask.html(event, config, reload);});   // 监控html源文件
	    gulp.watch(config.htmlConfig.ignore + "/**/**", ['htmlInclude']); // include模块内容监控
	    gulp.watch([config.pugConfig.pugSrc], function (event) {pugTask.pugBuild(event, config, reload);});   // 监控pug源文件
	    gulp.watch([config.pugConfig.ignore + "/**/**"], function (event) {pugTask.pugBuild({}, config, reload);});   // 监控pug模板文件
	    gulp.watch(config.dist + "/css/main/images/**/**").on('change', reload);// 监控目标文件夹下雪碧变化
    });
});

//删除temp和dist下的所有文件 等同于 gulp.task('clean',function(){require('del')(['.tmp','dist'])});
gulp.task('clean', del.bind(null, config.cleanConfig.src, {
    force: true
}));

/* 多雪碧图 */
gulp.task('mulSprite', function () {
    sprinteTask.mulSprite(config.mulSpriteConfig);
});


/* iChoice雪碧图 */
gulp.task('iChoice', function () {
    sprinteTask.iChoice(config);
});