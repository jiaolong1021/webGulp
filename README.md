# gulp项目结构说明

# 重点关注的文件
    config.js                   工程的所有配置信息都在这
    run.cmd                     启动gulp工程，开启服务器
    clean.cmd                   清除生成的目标文件

## 目录结构
    |– gulp                         gulp相关的所有任务、配置文件信息
         |- tasks                    gulp的所有任务文件目录
              |- cssTask.js          css生成、修改、删除的相关任务
              |- htmlTask.js         html生成、修改、删除的相关任务
              |- imagesTask.js       图片生成、修改、删除的相关任务
              |- scriptsTask.js      JavaScript生成、修改、删除的相关任务
              |- sprinteTask.js      雪碧图相关任务
              |- util.js             消息提示等工具任务
         |- config.js                配置文件（工程所有配置信息都在这）
    |- node-modules                  node自动生成目录（所有安装本地插件都在这）
    |- project                       工程放置位置
    |- demo                          示例工程
    |- .csscomb.json                 css格式化格式(csscomb插件配置文件，可在官网直接生成，插件会自动调用，不需管)
    |- package.json                  node工程依赖插件关系包
    |- README.md                     说明文档
    |- README_plugins.MD             插件说明文档

## 单个工程目录结构(demo工程为例)
    demo
    |- src                           源文件目录
    |- css                           css文件放置目录
        |- main                      自己新增的样式目录
            |- images                图片放置目录
            |- scss                  scss文件放置目录
            |- sprite                雪碧图放置目录
            |- main.css              样式主文件
    |- js                            js文件放置目录
    |- index.html                    html文件入口(可自行修改配置文件来定义)
    |- clean.cmd                     清除生成目录
    |- gulpfile.js                   gulp默认入口文件(开启gulp执行的第一个文件)
    |- run.cmd                       开启gulp工程，启动服务器
    
## License
MIT © jiaolong
