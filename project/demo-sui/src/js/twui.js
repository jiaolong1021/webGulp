var twui = {
    //截取文字(英文算0.5个字符)
    cutText: function (str, num) {
        var textLength = 0,
            i = 0;

        for (; i < str.length; i++) {
            if (str.charCodeAt(i) < 255) {
                textLength += 0.5;
            } else {
                textLength++;
            }

            if (textLength >= num) {
                break;
            }
        }

        return str.substr(0, i);
    },
    //初始化升缩文本的展开与收起
    initRsText: function ($rsTexts) {
        $rsTexts.each(function () {
            var rstext = '',
                dataparam = '',
                charnum = 200,
                subStr = '',
                textLength = 0,
                $riseSwitch = null,
                $shrinkSwitch = null,
                $temp = $('<div></div>'),
                riseSwitchHtml = '<span class="u-rstext-switch" data-as="rstext-riseswitch">展开<span>︾</span></span>',
                shrinkSwitchHtml = '<span class="u-rstext-switch" data-as="rstext-shrinkswitch">收起<span>︽</span></span>';

            $riseSwitch = $(this).find('[data-as="rstext-riseswitch"]');
            $shrinkSwitch = $(this).find('[data-as="rstext-shrinkswitch"]');

            //如果存在自定义的展开开关，获取其对应的html
            if ($riseSwitch.length > 0) {
                $temp.append($riseSwitch);
                riseSwitchHtml = $temp.html();
            }

            //如果存在自定义的关闭开关，获取其对应的html
            if ($shrinkSwitch.length > 0) {
                $temp = $('<div></div>');
                $temp.append($shrinkSwitch);
                shrinkSwitchHtml = $temp.html();
            }

            rstext = $(this).text();

            for (var i = 0; i < rstext.length; i++) {
                if (rstext.charCodeAt(i) <= 255) {
                    textLength += 0.5;
                } else {
                    textLength++;
                }
            }

            dataparam = $(this).data('param');

            //如果指定了限制字符数且指定的字符数能转换为整数就用指定的字符数作限制字符数，否则默认最多显示200个字符
            if (typeof dataparam != "undefined") {
                charnum = isNaN(parseInt(dataparam)) ? 200 : parseInt(dataparam);
            }

            //仅当文本字符数大于限制字符个数时，才显示切换开关
            if (textLength > charnum) {
                subStr = twui.cutText(rstext, charnum);
                $(this).html(subStr + '...' + riseSwitchHtml);
            }

            //单击展开开关:显示全部文字
            $(this).on('click', '[data-as="rstext-riseswitch"]', function () {
                var $rstext = $(this).parent();
                $rstext.html(rstext + shrinkSwitchHtml);
            });

            //单击收起开关:截断部份文字
            $(this).on('click', '[data-as="rstext-shrinkswitch"]', function () {
                var $rstext = $(this).parent();
                subStr = twui.cutText(rstext, charnum);
                $rstext.html(subStr + '...' + riseSwitchHtml);
            });
        });
    },
    //初始化滚动才显示的头部
    initHeader: function ($headerbox) {
        $headerbox.off('scroll.header');
        $headerbox.on('scroll.header', function () {
            var $this = $(this),
            $header = $('.js-header');

            if ($this.scrollTop() > 10) {
                $header.slideDown();
            } else {
                $header.slideUp();
            }
        });
    },
    //覆盖背景层
    cover: $('<div class="m-cover u-cover"></div>'),
    //初始化自定义下拉列表高度,使超出浏览器高度时能显示滚动条
    initSelect: function ($select) {
        var height = $(window).height() - 100,
            $options = $select.find('.options-box');

        $options.css('max-height', height);
    },
    //关闭自定义下拉列表
    closeSelect: function ($select) {
        $select.removeClass('dropdown');
        $(twui.cover).remove();
    },
    //初始化显示弹窗菜单按钮
    initBtnSwhoPop: function ($btnShowPop) {
        $btnShowPop.off('click.showpop');

        if (!$btnShowPop) {
            $btnShowPop = $('.js-btn-showpop');
        }

        $btnShowPop.on('click.showpop', function (event) {
            var $target = $($(this).data('target'));

            event.stopPropagation();
            $target.show();

            $(document).on('click.showpop', function () {
                $target.hide();
                $(this).off('click.showpop');
            });
        });
    },
    //初始化弹出菜单
    initPopMenu: function ($popMenu) {
        var $menus = $();

        if (!$popMenu) {
            $popMenu = $('.js-poptools');
        }

        $menus = $popMenu.find('.js-menu');

        $menus.off('click.popmenu');
        $menus.on('click.popmenu', function () {
            $(this).parent().hide();
        });
    },
    //初始化下拉列表值容器
    initDropListValueBox: function ($dropListValueBox) {
        $dropListValueBox.off('click.droplist');

        $dropListValueBox.on('click.droplist', function (event) {
            var $dropList = $(this).parents('.js-droplist'),
                $activeDropList = $('.js-droplist.dropdown');

            event.stopPropagation();

            if (!$dropList.is($activeDropList)) {
                $activeDropList.removeClass('dropdown');
            }

            $dropList.toggleClass('dropdown');

            $(document).on('click.droplist', function () {
                $dropList.removeClass('dropdown');
                $(this).off('click.droplist');
            });
        });
    },
    //初始化下拉列表值容器选项
    initDropListOption: function ($dropListOption) {
        $dropListOption.off('click.droplist');

        $dropListOption.on('click.droplist', function () {
            var $dropList = $(this).parents('.js-droplist'),
                $dropValue = $dropList.find('.js-droplist-value'),
                value = '';

            $dropList.removeClass('dropdown');
            value = $(this).text();
            $dropValue.text(value);
            $dropList.trigger('change', [$(this)]);
        });
    },
    //初始化下拉列表
    initDropList: function ($dropList) {
        var $dropListValueBox = $dropListOption = $();

        if (!$dropList) {
            $dropList = $('.js-droplist');
        }

        $dropListValueBox = $dropList.find('.js-droplist-valuebox');
        $dropListOption = $dropList.find('.js-droplist-option');

        twui.initDropListValueBox($dropListValueBox);
        twui.initDropListOption($dropListOption);
    },
    //初始化显示弹出层按钮
    initBtnShowPopLayer: function ($btnShowPopLayer) {
        $btnShowPopLayer.off('click.popLayer');

        $btnShowPopLayer.on('click.popLayer', function (event) {
            var $target = $($(this).data('target'));

            event.stopPropagation();
            $('body').append(twui.cover);
            if ($target.is(':hidden')) {
                $target.show();
                $(document).on('click.popLayer', function () {
                    $target.hide();
                    twui.cover.remove();
                    $(document).off('click.popLayer');
                });
            } else {
                $target.hide();
                twui.cover.remove();
            }
        });
    }
};

//页面初使化时，检查当前页是否存在相关元素，如果存在，绑定相应的事件
$(document).ready(function () {
    var $rsTexts = $('[data-as="rstext"]'),
        $headerbox = $('.js-headerbox'),
        $btnShowPop = $('.js-btn-showpop'),
        $popMenu = $('.js-poptools'),
        $dropList = $('.js-droplist'),
        $selectValue = $('.m-select .value'),
        $btnShowPopLayer = $('.js-btn-show-poplayer');

    //初始化sui
    if (typeof Zepto === 'function') {
        Zepto.init();
    }

    //当页面存在收缩文本,对升缩文本进行初始化
    if ($rsTexts.length > 0) {
        twui.initRsText($rsTexts);
    }

    if ($headerbox.length > 0) {
        twui.initHeader($headerbox);
    }

    if ($btnShowPop.length > 0) {
        twui.initBtnSwhoPop($btnShowPop);
    }

    if ($popMenu.length > 0) {
        twui.initPopMenu($popMenu);
    }

    if ($dropList.length > 0) {
        twui.initDropList($dropList);
    }

    //初始化显示popLayer层按钮
    if ($btnShowPopLayer.length > 0) {
        twui.initBtnShowPopLayer($btnShowPopLayer);
    }

    //自定义select的值默认为第一项
    if ($selectValue.length > 0) {
        $selectValue.each(function () {
            var text = $(this).parent().parent().find('.option:first-child').text();

            $(this).text(text);
        });
    }

    //点击打开或关闭自定义下拉列表
    $('.m-select').on('click', '.value-box', function () {
        var $select = $(this).parent(),
            index = $select.index(),
            $selects = null;

        $select.addClass('js-active');
        $selects = $('.m-select:not(".js-active")');

        $selects.each(function () {
            twui.closeSelect($(this));
        });

        if (!$select.hasClass('dropdown')) {
            $select.addClass('dropdown');
            $('.content').append(twui.cover);
            twui.initSelect($select);

            //在document中注册关闭自定义下拉列表事件
            $(document).on('click.select', function () {
                var $selects = $('.m-select');

                $selects.each(function () {
                    twui.closeSelect($(this));
                });

                $(document).off('click.select');
            });
        } else {
            twui.closeSelect($select);
        }

        $select.removeClass('js-active');
    });

    //阻止自定义下拉列表事件冒泡
    $('.m-select').click(function (event) {
        event.stopPropagation();
    });

    //选择select控件中的值后收起
    $('.m-select').on('click', '.option', function () {
        var $select = $(this).parents('.m-select'),
            $value = $select.find('.value'),
            value = $(this).text();

        $value.text(value);
        $(this).siblings('.selected').removeClass('selected');
        $(this).addClass('selected');
        $select.trigger('change', [$(this)]);
        twui.closeSelect($select);
    });

    //浏览器改变大小重新初始化自定义下拉列表
    $(window).resize(function () {
        var $selects = $('.m-select.dropdown');

        $selects.each(function () {
            twui.initSelect($(this));
        });
    });
});