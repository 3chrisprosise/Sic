﻿(function () {
    var cache = {};
    this.tmpl = function tmpl(str, data) {
        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
        return data ? fn(data) : fn
    }
})();
$(document).on("focusin", function (e) {
    if (e != null) {
        if ($(e.target).find(".mce-window").length) {
            e.stopImmediatePropagation()
        }
    }
});

function getE(name) {
    if (document.getElementById) {
        var elem = document.getElementById(name)
    } else {
        if (document.all) {
            var elem = document.all[name]
        } else {
            if (document.layers) {
                var elem = document.layers[name]
            }
        }
    }
    return elem
}
function OpenWindow(query, w, h, scroll) {
    var l = (screen.width - w) / 2;
    var t = (screen.height - h) / 2;
    winprops = "resizable=0, height=" + h + ",width=" + w + ",top=" + t + ",left=" + l + "w";
    if (scroll) {
        winprops += ",scrollbars=1"
    }
    var f = window.open(query, "_blank", winprops)
}
function setLocation(url) {
    window.location.href = url
}
function displayAjaxLoading(display) {
    if (display) {
        $(".ajax-loading-block-window").show()
    } else {
        $(".ajax-loading-block-window").hide("slow")
    }
}
function AddFavorite(sURL, sTitle) {
    try {
        window.external.addFavorite(sURL, sTitle)
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "")
        } catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加")
        }
    }
}
function SetHome(url) {
    if (document.all) {
        document.body.style.behavior = "url(#default#homepage)";
        document.body.setHomePage(url)
    } else {
        alert("您好,您的浏览器不支持自动设置页面为首页功能,请您手动在浏览器里设置该页面为首页!")
    }
}
function displayPopupNotification(message, messagetype, modal) {
    var container;
    if (messagetype == "success") {
        container = $("#dialog-notifications-success")
    } else {
        if (messagetype == "error") {
            container = $("#dialog-notifications-error")
        } else {
            container = $("#dialog-notifications-success")
        }
    }
    var htmlcode = "";
    if ((typeof message) == "string") {
        htmlcode = "<p>" + message + "</p>"
    } else {
        for (var i = 0; i < message.length; i++) {
            htmlcode = htmlcode + "<p>" + message[i] + "</p>"
        }
    }
    container.html(htmlcode);
    var isModal = (modal ? true : false);
    container.dialog({
        modal: isModal
    })
}
var barNotificationTimeout;

function displayBarNotification(message, messagetype, timeout) {
    clearTimeout(barNotificationTimeout);
    var cssclass = "success";
    if (messagetype == "success") {
        cssclass = "success"
    } else {
        if (messagetype == "error") {
            cssclass = "error"
        }
    }
    $("#bar-notification").removeClass("success").removeClass("error");
    $("#bar-notification .content").remove();
    var htmlcode = "";
    if ((typeof message) == "string") {
        htmlcode = '<p class="content">' + message + "</p>"
    } else {
        for (var i = 0; i < message.length; i++) {
            htmlcode = htmlcode + '<p class="content">' + message[i] + "</p>"
        }
    }
    $("#bar-notification").append(htmlcode).addClass(cssclass).fadeIn("slow").mouseenter(function () {
        clearTimeout(barNotificationTimeout)
    });
    $("#bar-notification .close").unbind("click").click(function () {
        $("#bar-notification").fadeOut("slow")
    });
    if (timeout > 0) {
        barNotificationTimeout = setTimeout(function () {
            $("#bar-notification").fadeOut("slow")
        }, timeout)
    }
}
function DynamicLoad(img) {
    var currentImg = $(img);
    var isload = currentImg.attr("isload");
    if (isload != 1) {
        if (currentImg.hasClass("lazyload")) {
            currentImg.attr("isload", 1);
            currentImg.attr("src", currentImg.attr("data-original"))
        }
    }
}
function ShowMessageInBar(message) {
    var options = {};
    var bar = $("#progressbar", window.parent.document);
    bar.html(message);
    bar.show();
    setTimeout(hideTheProgressbar, 300)
}
function hideTheProgressbar() {
    var bar = $("#progressbar", window.parent.document);
    bar.hide()
}
function htmlEncode(value) {
    return $("<div/>").text(value).html()
}
function htmlDecode(value) {
    return $("<div/>").html(value).text()
}
try {
    (function ($, undefined) {
        var that;
        $.widget("ui.ajaxdialog", $.ui.dialog, {
            version: "1.10.3",
            options: {
                ajaxurl: "",
                httpType: "Get",
                data: null,
                processData: null
            },
            open: function () {
                this._super();
                that = this;
                if (this.options.ajaxurl != "") {
                    this.element.html("<div class='floatbar-loading'><div class='floatbar-loading-img'><img src='/plugins/designer/content/css/images/floatbar-loading.gif' /></div><div class='floatbar-loading-text'>loading...</div></div>");
                    if (this.options.data != null) {
                        $.ajax({
                            cache: false,
                            url: this.options.ajaxurl,
                            type: this.options.httpType,
                            data: this.options.data,
                            success: this._processHtml,
                            error: this.ajaxFailure
                        })
                    } else {
                        $.ajax({
                            cache: false,
                            url: this.options.ajaxurl,
                            type: this.options.httpType,
                            success: this._processHtml,
                            error: this.ajaxFailure
                        })
                    }
                }
            },
            _processHtml: function (data) {
                that._trigger("processData", $, {
                    htmlElement: that.element,
                    httpData: data
                })
            },
            ajaxFailure: function () {
                this.element.html("loading Error!");
            },
            _makeDraggable: function () {
                var that = this,
					options = this.options;

                function filteredUi(ui) {
                    return {
                        position: ui.position,
                        offset: ui.offset
                    }
                }
                this.uiDialog.draggable({
                    cancel: " .ui-dialog-titlebar-close",
                    handle: ".contentDragHandler,.ui-dialog-titlebar",
                    containment: "document",
                    start: function (event, ui) {
                        $(this).addClass("ui-dialog-dragging");
                        that._blockFrames();
                        that._trigger("dragStart", event, filteredUi(ui))
                    },
                    drag: function (event, ui) {
                        that._trigger("drag", event, filteredUi(ui))
                    },
                    stop: function (event, ui) {
                        options.position = [ui.position.left - that.document.scrollLeft(), ui.position.top - that.document.scrollTop()];
                        $(this).removeClass("ui-dialog-dragging");
                        that._unblockFrames();
                        that._trigger("dragStop", event, filteredUi(ui))
                    }
                })
            }
        })
    })(jQuery)
} catch (e) { }
try {
    (function ($, undefined) {
        $.widget("ui.boxsable", $.ui.mouse, {
            version: "1.10.3",
            widgetEventPrefix: "boxs",
            options: {
                appendTo: "body",
                autoRefresh: true,
                distance: 0,
                filter: "*",
                tolerance: "touch",
                disabled: false,
                draging: null,
                start: null,
                stop: null
            },
            _create: function () {
                that = this;
                this.element.addClass("ui-boxable");
                this.dragged = false;
                this._mouseInit();
                this.helper = $(".ui-selectable-helper").length > 0 ? $(".ui-selectable-helper") : $("<div class='ui-selectable-helper'></div>")
            },
            _destroy: function () {
                this.element.removeClass("ui-boxable ui-selectable-disabled");
                this._mouseDestroy()
            },
            _mouseStart: function (event) {
                var that = this,
					options = this.options;
                this.helper.html("");
                this.opos = [event.pageX, event.pageY];
                if (this.options.disabled) {
                    return
                }
                this._trigger("start", event);
                $(options.appendTo).append(this.helper);
                this.helper.css({
                    "left": event.pageX,
                    "top": event.pageY,
                    "width": 0,
                    "height": 0,
                    "zIndex": 99999
                })
            },
            _mouseDrag: function (event) {
                this.dragged = true;
                if (this.options.disabled) {
                    return
                }
                this._propagate("draging", event);
                var tmp, that = this,
					options = this.options,
					x1 = this.opos[0],
					y1 = this.opos[1],
					x2 = event.pageX,
					y2 = event.pageY;
                if (x1 > x2) {
                    tmp = x2;
                    x2 = x1;
                    x1 = tmp
                }
                if (y1 > y2) {
                    tmp = y2;
                    y2 = y1;
                    y1 = tmp
                }
                this.helper.css({
                    left: x1,
                    top: y1,
                    width: x2 - x1,
                    height: y2 - y1
                });
                this._trigger("draging", event, this.ui());
                return false
            },
            _mouseStop: function (event) {
                if (this.options.disabled) {
                    return
                }
                var that = this;
                this.dragged = false;
                this._trigger("stop", event, this.ui());
                this.options.disabled = true;
                return false
            },
            _propagate: function (n, event) {
                $.ui.plugin.call(this, n, [event, this.ui()]);
                (n !== "dragging" && this._trigger(n, event, this.ui()))
            },
            plugins: {},
            ui: function () {
                return {
                    element: this.element,
                    helper: this.helper
                }
            }
        })
    })(jQuery)
} catch (e) { }
function toHexColor(r, g, b) {
    var hex = "#";
    var hexStr = "0123456789ABCDEF";
    low = r % 16;
    high = (r - low) / 16;
    hex += hexStr.charAt(high) + hexStr.charAt(low);
    low = g % 16;
    high = (g - low) / 16;
    hex += hexStr.charAt(high) + hexStr.charAt(low);
    low = b % 16;
    high = (b - low) / 16;
    hex += hexStr.charAt(high) + hexStr.charAt(low);
    return hex
}
function addStrToArrayString(addStr, sourceStr) {
    var arr = sourceStr.split(",");
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (arr[i] == addStr) {
            return sourceStr
        }
    }
    arr.push(addStr);
    var retStr = arr.join(",");
    if (retStr.indexOf(",") == 0) {
        retStr = retStr.substring(1)
    }
    return retStr
}

function removeStrFromArrayString(removeStr, sourceStr) {
    var arr = sourceStr.split(",");
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (arr[i] == removeStr) {
            arr.splice(i, 1);
            var retStr = arr.join(",");
            if (retStr.indexOf(",") == 0) {
                retStr = retStr.substring(1)
            }
            return retStr
        }
    }
    return sourceStr
}
//判断是否存在当前字符串
function isExsitInSem(addStr, sourceStr) {
    var arr = sourceStr.split("^&");
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (arr[i] == addStr) {
            return true;
        }
    }
    return false;
}

function addStrToArrayStringSem(addStr, sourceStr) {
    var arr = sourceStr.split("^*");
    arr.push(addStr);
    var retStr = arr.join("^*");
    if (retStr.indexOf("^*") == 0) {
        retStr = retStr.substring(2)
    }
    return retStr
}

function removeStrFromArrayStringSem(removeStr, sourceStr) {
    var arr = sourceStr.split("^*");
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (arr[i] == removeStr) {
            arr.splice(i, 1);
            var retStr = arr.join("^*");
            if (retStr.indexOf("^*") == 0) {
                retStr = retStr.substring(2)
            }
            return retStr
        }
    }
    return sourceStr
}

function TurnPageSmartView(pageId, smartViewId, isDesign, pageNumber, isAppend, formFields, searchCategory, searchKeyword, isMobile, callback) {
    var loadingObj = $("#bakload");
    if (loadingObj != "" && loadingObj != null && typeof (loadingObj) != undefined) {
        loadingObj.show()
    }
    var isloadDesign = "true";
    var viewId = smartViewId.split("_")[2];
    var href = "/Plugins/RunTime/TurnPageSmartView?pagenumber=" + pageNumber + "&loaddesign=" + isloadDesign + "&pageId=" + pageId + "&smartViewId=" + viewId + "&isDesign=" + isDesign;
    if (typeof (searchCategory) != "undefined") {
        href = href + "&keyword=" + searchKeyword + "&searchCategory=" + searchCategory
    }
    var fields = formFields.split(",");
    var strData = "isAppend=" + isAppend;
    if (isMobile != "undefined") {
        strData += "&yibu_IsMobileDevice=" + isMobile
    }
    for (var i = 0; i < fields.length - 1; i++) {
        strData = str + "&" + fields[i] + "=" + $("#" + smartViewId + " .yibuFrameContent input[name='" + fields[i] + "']").val();
    }
    $.ajax({
        cache: false,
        url: href,
        data: strData,
        type: "get",
        success: function (data) {
            if (!isAppend) {
                $("#" + smartViewId + " .yibuFrameContent").html(data);
            } else {

                if (typeof callback == "function") {
                    callback(viewId, $(data));
                } else {
                    $("#" + smartViewId + " .yibuFrameContent .pager.f_clearfix").remove();
                    $("#" + smartViewId + " .yibuFrameContent .w_pager").remove();
                    $("#" + smartViewId + " .yibuFrameContent").append($(data));
                    $("#" + smartViewId + " .yibuFrameContent .pager").not(".f_clearfix").not(":first").remove();
                }

            }
            if (loadingObj != "" && loadingObj != null && typeof (loadingObj) != 'undefined') {
                loadingObj.hide();
            }
        }
    });
}
//新分页结果列表页
function TurnNewPageSmartView(pageId, smartViewId, isDesign, searchKeyword, isMobile, categoryId, categoryName, callback) {
    var isloadDesign = "true";
    var viewId = smartViewId.split("_")[2];
    var href = "/Plugins/RunTime/TurnPageSmartView?pagenumber=1&loaddesign=" + isloadDesign + "&pageId=" + pageId + "&smartViewId=" + viewId + "&isDesign=" + isDesign;
    href = href + "&keyword=" + searchKeyword + "&categoryId=" + categoryId + "&categoryName=" + categoryName;
    var strData = "";
    if (isMobile != "undefined") {
        strData += "yibu_IsMobileDevice=" + isMobile
    }
    $.ajax({
        cache: false,
        url: encodeURI(href),
        data: strData,
        type: "get",
        success: function (data) {
            $("#" + smartViewId + " .yibuFrameContent").html($(data));
        }
    });
}
function TurnPageCategoryListSmartView(pageId, smartViewId, isDesign, pageNumber, isAppend, formFields, entityName, categoryId, isMobile, callback) {
    var loadingObj = $("#bakload");
    if (loadingObj != "" && loadingObj != null && typeof (loadingObj) != undefined) {
        loadingObj.show()
    }
    var isloadDesign = "true";
    var viewId = smartViewId.split("_")[2];
    var href = "/Plugins/RunTime/TurnPageSmartView?pagenumber=" + pageNumber + "&loaddesign=" + isloadDesign + "&pageId=" + pageId + "&smartViewId=" + viewId + "&isDesign=" + isDesign;
    if (typeof (categoryId) != "undefined") {
        href = href + "&EntityTypeName=" + entityName + "&categoryId=" + categoryId
    }
    var fields = formFields.split(",");
    var strData = "isAppend=" + isAppend;
    if (typeof (isMobile) != "undefined") {
        strData += "&yibu_IsMobileDevice=" + isMobile
    }
    for (var i = 0; i < fields.length - 1; i++) {
        strData = str + "&" + fields[i] + "=" + $("#" + smartViewId + " .yibuFrameContent input[name='" + fields[i] + "']").val()
    }
    $.ajax({
        cache: false,
        url: encodeURI(href),
        data: strData,
        type: "get",
        success: function (data) {
            if (!isAppend) {
                $("#" + smartViewId + " .yibuFrameContent").html(data)
            } else {
                if (typeof callback == "function") {
                    callback(viewId, $(data));
                } else {
                    $("#" + smartViewId + " .yibuFrameContent .w_pager").remove();
                    $("#" + smartViewId + " .yibuFrameContent .pager.f_clearfix").remove();
                    $("#" + smartViewId + " .yibuFrameContent").append($(data))
                    $("#" + smartViewId + " .yibuFrameContent .pager").not(".f_clearfix").not(":first").remove();
                }
            }
            if (loadingObj != "" && loadingObj != null && typeof (loadingObj) != undefined) {
                loadingObj.hide()
            }
        }
    })
}
//PC端翻页
function PcListPagination(htmlId, listType, pagerStyle, pageSize, totalPage, categoryIds, entityIds, dateStyle, orderByField, orderByType, isCategoryList, postData, searchKeyWord, showImage, showPrice, callBack) {
    //运用$符号
    kino.razor.use("$");
    //处理样式逻辑
    if (pagerStyle == "PageNumber") {
        //翻页样式一上下页翻页
        $("#" + htmlId + " #prePage").click(function () {
            var currentA = $("#" + htmlId + " #pagerHtml a[class *='activi']");
            if (currentA.html() == "1") {
                return;
            }
            var numberA = $("#" + htmlId + " #pagerHtml li[class !='dom'] a:not(a[class *='w-page-flip'])");
            $.each(numberA, function (i, o) {
                if (parseInt($(this).html()) == parseInt(currentA.html()) - 1) {
                    $(this).click();
                }
            });
        });
        $("#" + htmlId + " #nextPage").click(function () {
            var currentA = $("#" + htmlId + " #pagerHtml a[class *='activi']");
            if (currentA.html() == totalPage.toString()) {
                return;
            }
            var numberA = $("#" + htmlId + " #pagerHtml li[class !='dom'] a:not(a[class *='w-page-flip'])");
            $.each(numberA, function (i, o) {
                if (parseInt($(this).html()) == parseInt(currentA.html()) + 1) {
                    $(this).click();
                }
            });
        });
        $("#" + htmlId + " #pagerHtml li[class !='dom'] a:not(a[class *='w-page-flip'])").click(function () {
            var pageIndex = parseInt($(this).html());
            var pageIndexStr = $(this).html();
            if (totalPage > 5) {
                if (pageIndex < 4) {
                    $("#" + htmlId + " #firstdom").hide();
                    $("#" + htmlId + " #lasedom").show();
                    $("#" + htmlId + " #secondPage").html(2);
                    $("#" + htmlId + " #thirdPage").html(3);
                    $("#" + htmlId + " #forthPage").html(4);
                }
                else if (pageIndex > totalPage - 3) {
                    $("#" + htmlId + " #firstdom").show();
                    $("#" + htmlId + " #lasedom").hide();
                    $("#" + htmlId + " #secondPage").html(totalPage - 3);
                    $("#" + htmlId + " #thirdPage").html(totalPage - 2);
                    $("#" + htmlId + " #forthPage").html(totalPage - 1);
                } else {
                    $("#" + htmlId + " #firstdom").show();
                    $("#" + htmlId + " #lasedom").show();
                    $("#" + htmlId + " #secondPage").html(pageIndex - 1);
                    $("#" + htmlId + " #thirdPage").html(pageIndex);
                    $("#" + htmlId + " #forthPage").html(pageIndex + 1);
                }
            }
            $("#" + htmlId + " #pagerHtml").find("a").removeClass("activi");
            $.each($("#" + htmlId + " #pagerHtml").find("a"), function (i, o) {
                if ($(this).html() == pageIndexStr) {
                    $(this).addClass("activi");
                }
            });
            AssembleData(htmlId, listType, pagerStyle, pageSize, pageIndex, totalPage, categoryIds, entityIds, dateStyle, orderByField, orderByType, isCategoryList, postData, searchKeyWord, showImage, showPrice, callBack);
        });
    } else if (pagerStyle == "NextPreview") {
        //跳转翻页
        $("#" + htmlId + " #prePage").click(function () {
            var pageIndex = parseInt($("#" + htmlId + " #firstNum").html());
            if (pageIndex == 1) {
                return;
            } else {
                pageIndex = pageIndex - 1;
                $("#" + htmlId + " #firstNum").html(pageIndex);
            }
            AssembleData(htmlId, listType, pagerStyle, pageSize, pageIndex, totalPage, categoryIds, entityIds, dateStyle, orderByField, orderByType, isCategoryList, postData, searchKeyWord, showImage, showPrice, callBack);
        });
        $("#" + htmlId + " #nextPage").click(function () {
            var pageIndex = parseInt($("#" + htmlId + " #firstNum").html());
            if (pageIndex == totalPage) {
                return;
            } else {
                pageIndex = pageIndex + 1;
                $("#" + htmlId + " #firstNum").html(pageIndex);
            }
            AssembleData(htmlId, listType, pagerStyle, pageSize, pageIndex, totalPage, categoryIds, entityIds, dateStyle, orderByField, orderByType, isCategoryList, postData, searchKeyWord, showImage, showPrice, callBack);
        });
        $("#" + htmlId + " #goPage").click(function () {
            var turnPage = $("#" + htmlId + " #turnPage").val();
            var pageIndex = parseInt(turnPage)
            if (!isNaN(pageIndex) && pageIndex <= totalPage && pageIndex >= 1) {
                $("#" + htmlId + " #firstNum").html(pageIndex);
                AssembleData(htmlId, listType, pagerStyle, pageSize, pageIndex, totalPage, categoryIds, entityIds, dateStyle, orderByField, orderByType, isCategoryList, postData, searchKeyWord, showImage, showPrice, callBack);
                $("#" + htmlId + " #turnPage").val("");
            }
        });
    } else if (pagerStyle == "MoreButton") {
        var pageIndex = 1;
        $("#" + htmlId + " #searchMore").click(function () {
            pageIndex++;
            if (pageIndex == totalPage) {
                $(this).parent().hide();
            };
            AssembleData(htmlId, listType, pagerStyle, pageSize, pageIndex, totalPage, categoryIds, entityIds, dateStyle, orderByField, orderByType, isCategoryList, postData, searchKeyWord, showImage, showPrice, callBack);
        });
    }
}
//组装数据
function AssembleData(htmlId, listType, pagerStyle, pageSize, pageIndex, totalPage, categoryIds, entityIds, dateStyle, orderByField, orderByType, isCategoryList, postData, searchKeyWord, showImage, showPrice, callBack) {
    var param = {
        listType: listType,
        pageIndex: pageIndex - 1,
        pageSize: pageSize,
        showImgUrl: showImage,
        categoryIds: categoryIds,
        isCategoryList: isCategoryList,
        postData: postData,
        searchKeyWord: searchKeyWord,
        entityIds: entityIds,
        dateStyle: dateStyle,
        orderByField: orderByField,
        orderByType: orderByType
    };
    $.post("/Plugins/ListDataCommon/GetListItems", param, function (data) {
        if (pagerStyle == "PageNumber" || pagerStyle == "NextPreview") {
            $("#ulList_" + htmlId + " li").remove();
            $.each(data.Items, function (i, o) {
                $("#ulList_" + htmlId).append(kino.razor($("#listTemplate_" + htmlId).html(), {
                    data: o
                }));
            });
        } else if (pagerStyle == "MoreButton") {
            var preAddHetght = $("#" + htmlId + " .yibuFrameContent").height();
            $.each(data.Items, function (i, o) {
                $("#ulList_" + htmlId).append(kino.razor($("#listTemplate_" + htmlId).html(), {
                    data: o
                }));
            });
            ReComputeVisibleSmartViewTop();
        }
        if (isExitsFunction(callBack)) {
            var func = eval(callBack);
            func();
        }
    }, 'json')
}
function isExitsFunction(funcName) {
    try {
        if (typeof (eval(funcName)) == "function") {
            return true;
        }
    } catch (e) { }
    return false;
}
function createBaiduMap(mapSettings, flag) {
    try {
        var mapOpts = {
            offset: new BMap.Size(10, 5)
        };
        var map = new BMap.Map(mapSettings.id);
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        if (mapSettings.ShowNavigation) {
            map.addControl(new BMap.NavigationControl())
        }
        if (mapSettings.ShowScale) {
            map.addControl(new BMap.ScaleControl(mapOpts))
        }
        if (mapSettings.ShowMapType) {
            map.addControl(new BMap.MapTypeControl())
        }
        map.enableScrollWheelZoom();
        var startPoint;
        var endPoint;
        var content = '<div style="margin:0;line-height:20px;padding:2px;">' + mapSettings.content + "</div>";
        var searchInfoWindow = null;
        var windowSettings = {};
        windowSettings.title = mapSettings.title;
        windowSettings.width = 100;
        windowSettings.height = 105;
        windowSettings.panel = "panel";
        windowSettings.enableAutoPan = true;
        var searchTypes = [];
        if (mapSettings.ShowSearch) {
            searchTypes.push(BMAPLIB_TAB_SEARCH)
        }
        if (mapSettings.ShowToHere) {
            searchTypes.push(BMAPLIB_TAB_TO_HERE)
        }
        if (mapSettings.ShowFromHere) {
            searchTypes.push(BMAPLIB_TAB_FROM_HERE)
        }
        windowSettings.searchTypes = searchTypes;
        searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, windowSettings);
        var myGeo = new BMap.Geocoder();
        var newMarker;
        myGeo.getPoint(mapSettings.address, function (spoint) {
            if (spoint) {
                endPoint = spoint;
                map.centerAndZoom(spoint, 16);
                newMarker = new BMap.Marker(spoint);
                map.addOverlay(newMarker);
                if (mapSettings.ShowWindow) {
                    searchInfoWindow.open(newMarker)
                }
                newMarker.addEventListener("click", function (e) {
                    searchInfoWindow.open(newMarker)
                });
                if (startPoint != undefined) {
                    var driving = new BMap.DrivingRoute(map, {
                        renderOptions: {
                            map: map,
                            autoViewport: true
                        }
                    });
                    driving.search(startPoint, endPoint)
                }
            }
        }, "");
        map.addEventListener("tilesloaded", function () {
            jQuery(".anchorBL").hide();
            var cpy = jQuery(".BMap_cpyCtrl");
            cpy.hide();
            jQuery(".BMap_scaleCtrl").show()
        });
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                startPoint = r.point;
                if (endPoint != undefined) {
                    var driving = new BMap.DrivingRoute(map, {
                        renderOptions: {
                            map: map,
                            autoViewport: true
                        }
                    });
                    driving.search(r.point, endPoint)
                }
            } else { }
        }, {
            enableHighAccuracy: true
        })
    } catch (e) {
        if (flag == 0) {
            createBaiduMap(mapSettings, 1)
        }
    }
}
function ShowCommonImageDialog(selectedIds, successFunc) {
    var url = "/Plugins/Image/AddPicListPanel";
    var buttons = [{
        text: "确定",
        click: function () {
            $.ajax({
                type: "post",
                url: "/Plugins/Image/ReturnImageJson",
                data: {
                    ids: $("#hfImgId").val()
                },
                dataType: "json",
                success: function (data) {
                    successFunc(data)
                }
            });
            $(this).ajaxdialog("close")
        }
    }, {
        text: "取消",
        click: function () {
            $(this).ajaxdialog("close")
        }
    }];
    var processData = function (event, srcObj) {
        srcObj.htmlElement.html(srcObj.httpData)
    };
    ShowTopDialog(url, "选择图片", 600, 480, buttons, processData)
}
function DisplayLang() {
    if ($("#wapPreview").length == 0) {
        if ($("#langyY").length == 0) {
            $.ajax({
                cache: false,
                url: "/Plugins/LanSwitchSmartView/QueryLang",
                type: "post",
                success: function (data) {
                    if (data != "") {
                        var _divdisplay = "<div id='langyY' style='height: 100%;width: 100%;position: fixed;z-index: 1;top: 0; display:none;'>";
                        _divdisplay += "<div style='width: 284px;margin-left: auto;margin-right: auto;margin-top:15%' class='cke_1_dialog cke_editor_body_dialog cke_skin_kama' id='artcon'>";
                        _divdisplay += "<table style='z-index: 10010;' class='cke_dialog cke_browser_gecko cke_ltr'>";
                        _divdisplay += "<tbody><tr><td role='presentation'><div role='presentation' class='cke_dialog_body'><div role='presentation' class='cke_dialog_title'>提示</div>";
                        _divdisplay += "<a role='button' title='关闭' onclick='displaylangClose()' href='javascript:void(0)' class='cke_dialog_close_button' id='cke_dialog_close_button_86'>";
                        _divdisplay += "<span class='cke_label'>X</span></a><table role='presentation' class='cke_dialog_contents'><tbody><tr>";
                        _divdisplay += "<td role='presentation' class='cke_dialog_contents ' style='width: 240px;'>";
                        var str = data.split("|");
                        for (var i = 0; i < str.length; i++) {
                            if (str[i] != "") {
                                var str1 = str[i].split(",");
                                if (str1[0] == "CN") {
                                    _divdisplay += "<div class='btn-add change-btn' onclick='btnDisplay(" + str1[1] + ")'>切换至中文版本</div>"
                                } else {
                                    if (str1[0] == "English") {
                                        _divdisplay += "<div class='btn-add change-btn' onclick='btnDisplay(" + str1[1] + ")'>切换至英文版本</div>"
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
    }
}
function OnReviewsSubmit() {
    $.ajax({
        cache: false,
        url: "/Plugins/ProductInfoSmartView/AddProductReview",
        data: {
            ReviewTitle: $("#reviewtitle").val(),
            ReviewContent: $("#reviewcontent").val()
        },
        type: "post",
        success: function (data) {
            if (data == "1") { }
        },
        error: function (e) {
            alert(e)
        }
    })
}
var _phct = true;
$(function () {
    $("#Pcolor0 li").click(function () {
        $("#Pcolor0 li").removeClass("selected");
        $(this).addClass("selected")
    });
    $("#Pcolor1 li").click(function () {
        $("#Pcolor1 li").removeClass("selected");
        $(this).addClass("selected")
    });
    $("#Pcolor2 li").click(function () {
        $("#Pcolor2 li").removeClass("selected");
        $(this).addClass("selected")
    });
    $("#Pcolor3 li").click(function () {
        $("#Pcolor3 li").removeClass("selected");
        $(this).addClass("selected")
    });
    $("#Pcolor4 li").click(function () {
        $("#Pcolor4 li").removeClass("selected");
        $(this).addClass("selected")
    });
    $("#ptabs #t1_1").click(function () {
        $("#ptabs li").removeClass("current");
        $(this).addClass("current");
        $("#d1_1").css("display", "block");
        $("#d1_2").css("display", "none")
    });
    $("#ptabs #t1_2").click(function () {
        $("#ptabs li").removeClass("current");
        $(this).addClass("current");
        $("#d1_2").css("display", "block");
        $("#d1_1").css("display", "none")
    });
    $("#pshare").click(function () {
        if ($(".p_share_bd ul").width() == 77) {
            $(".p_share_bd ul").removeClass("p_share_list_items");
            $("#pshare").addClass("p_share_fts")
        } else {
            $(".p_share_bd ul").addClass("p_share_list_items");
            $("#pshare").removeClass("p_share_fts")
        }
    });
    $(".u_nav_item").mouseenter(function (obj) {
        var subMenu = $(this).children(".u_nav_submain");
        $("#tempSubMenuId").remove();
        if (subMenu.length > 0) {
            var ret = GetAbsoluteLocationEx($(this)[0]);
            var className = $(this).attr("class");
            var parentClass = $(this).parent().attr("class");
            var topParentClass = $(this).parent().parent().attr("class");
            var cloneMenu = subMenu.clone();
            var container = $("<div class='" + topParentClass + "'><div class='" + parentClass + "' style='width:100%;'><div class='" + className + "'  style='width:100%;'></div></div></div>").appendTo($("body"));
            cloneMenu.appendTo(container.find("div>div"));
            container.css({
                "top": parseInt(ret.absoluteTop) + (parentClass == "u_nav_main_vleft" || parentClass == "u_nav_main_vright" ? 0 : parseInt($(this).height())) + "px",
                "left": ret.absoluteLeft - (parentClass == "u_nav_main_vright" ? parseInt(ret.offsetWidth) * 2 : 0) + "px",
                "position": "absolute",
                "min-width": $(this).width(),
                "height": "auto",
                "z-index": 99999
            });
            container.attr("id", "tempSubMenuId");
            cloneMenu.css("width", "100%");
            cloneMenu.css("display", "block");
            container.show()
        }
    });
    $(document).on("click", function () {
        $("#tempSubMenuId").remove()
    })
});

function setRenderFullScreen(fullView, dependOn) {
    var position = fullView.css("position");

    var offsetLeft = fullView.parent().offset().left;

    offsetLeft += fullView.position().left;
    var height = fullView.height();
    var windowWith = $(window).width();
    if (dependOn != "window") {
        var documentWidth = $(document).width();
        if (windowWith < documentWidth) {
            windowWith = documentWidth;
        }
        if (dependOn == "auto" && windowWith > window.screen.width) {
            windowWith = window.screen.width;
        }
    } else {
        windowWith = window.screen.width;
    }
    var winWidthCopy = windowWith;
    var rightWidth = parseInt(fullView.children("div").find(".renderfullScreen").css("border-right-width"), 10);
    var leftWidth = parseInt(fullView.children("div").find(".renderfullScreen").css("border-left-width"), 10);
    if (!isNaN(rightWidth) && !isNaN(leftWidth)) {
        windowWith = windowWith - rightWidth - leftWidth
    }
    if (windowWith > winWidthCopy) {
        windowWith = winWidthCopy
    }
    if ($(window).height() < $(document).height()) {
        windowWith = windowWith - 1
    }
    if (position === 'fixed') {
        offsetLeft = 0;
        windowWith = $(window).width();
        var controlTop = fullView.css('top');
        var controlBottom = fullView.css('bottom');
        var controlMargin = "auto";
        fullView.children()
            .css("overflow", "visible")
            .children("div:eq(0)")
            .css({
                "left": -offsetLeft + "px",
                "width": windowWith,
                "height": height,
                "top": controlTop,
                "bottom": controlBottom,
                "margin": controlMargin,
                "position": "fixed"
            });
    } else {
        fullView.children()
            .css("overflow", "visible")
            .children("div:eq(0)")
            .css({
                "left": -offsetLeft + "px",
                "width": windowWith,
                "height": height
            });
    }

}
function setRenderMobileFullScreen(fullView) {
    var position = fullView.css("position");
    var height = fullView.height();
    var windowWith = $(window).width();
    var documentWidth = 0;
    var documentWidth = $(document).width();
    fullView.css("left", "0px");
    if (windowWith < documentWidth) {
        windowWith = documentWidth
    }
    if ($(window).height() < $(document).height()) {
        windowWith = windowWith - 1
    }
    fullView.children().css("overflow", "visible").children("div:eq(0)").css({
        "width": windowWith,
        "height": height
    })
}
$(window).resize(function () {
    $(".renderfullScreen").each(function () {
        var fullView = $(this).parentsUntil(".yibuSmartViewMargin").parent();
        setRenderFullScreen(fullView, "auto");
    })
    $(".rendermobilefullScreen").each(function () {
        var fullView = $(this).parentsUntil(".yibuSmartViewMargin").parent();
        setRenderMobileFullScreen(fullView)
    })
});
Array.prototype.indexOf = function (el) {
    for (var i = 0, n = this.length; i < n; i++) {
        if (this[i] === el) {
            return i
        }
    }
    return -1
};
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key])
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i])
                }
            }
        }
    }
    return result
};
jQuery.cookie = function (name, value, options) {
    if (typeof value != "undefined") {
        options = options || {};
        if (value === null) {
            value = "";
            options.expires = -1
        }
        var expires = "";
        if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == "number") {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
            } else {
                date = options.expires
            }
            expires = "; expires=" + date.toUTCString()
        }
        var path = options.path ? "; path=" + options.path : "";
        var domain = options.domain ? "; domain=" + options.domain : "";
        var secure = options.secure ? "; secure" : "";
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("")
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break
                }
            }
        }
        return cookieValue
    }
};

function SetNavSelectedStyle(navId, navType) {
    var rawurl = decodeURI(window.location.pathname) + window.location.search;
    $("#" + navId).children("li").each(function () {
        var href = $(this).find("a").attr("href");
        if (href != null) {
            href = href.replace(" ", "%20");
            if (href.toLowerCase() == rawurl.toLowerCase()) {
                if (navType == "nav") {
                    $(this).addClass("w_nav_item_current")
                } else {
                    $(this).addClass("w_vnav_item_current")
                }
                return
            }
        }
        if ($(this).children("ul").length > 0) {
            $(this).children("ul").children("li").each(function () {
                href = $(this).find("a").attr("href");
                if (href != null) {
                    href = href.replace(" ", "%20");
                    if (href.toLowerCase() == rawurl.toLowerCase()) {
                        if (navType == "nav") {
                            $(this).addClass("w_subnav_item_current")
                        } else {
                            $(this).addClass("w_subvnav_item_current")
                        }
                        return
                    }
                }
            })
        }
    })
}
this.ShowFileDialog = function (maxSelect, callback) {
    var editor = KindEditor.editor({
        fileManagerJson: "/admin/picture/GetImageFileList"
    });
    $("#filemanager").unbind("click").click(function () {
        editor.loadPlugin("filemanager", function () {
            editor.plugin.filemanagerDialog({
                viewType: "VIEW",
                dirName: "image",
                maxSelect: maxSelect,
                selectedIds: $("#selectedIds") == undefined ? "" : $("#selectedIds").val(),
                success: function (pictureList) {
                    callback(pictureList);
                    editor.hideDialog()
                }
            })
        })
    })
};

function GetAbsoluteLocationEx(element) {
    if (arguments.length != 1 || element == null) {
        return null
    }
    var elmt = element;
    var offsetTop = elmt.offsetTop;
    var offsetLeft = elmt.offsetLeft;
    var offsetWidth = elmt.offsetWidth;
    var offsetHeight = elmt.offsetHeight;
    while (elmt = elmt.offsetParent) {
        if (elmt.style.position == "absolute" || elmt.style.position == "relative" || (elmt.style.overflow != "visible" && elmt.style.overflow != "")) {
            break
        }
        offsetTop += elmt.offsetTop;
        offsetLeft += elmt.offsetLeft
    }
    return {
        absoluteTop: offsetTop,
        absoluteLeft: offsetLeft,
        offsetWidth: offsetWidth,
        offsetHeight: offsetHeight
    }
}
var _eventBoundArray = new Array();
var YibuPropertyBinder = {
    createNew: function (srcElement, eventKey, srcProType, srcProName, targetSelector, targetProType, targetProName) {
        var binder = {};
        binder.srcElement = srcElement;
        binder.eventKey = eventKey;
        binder.srcProType = srcProType;
        binder.srcProName = srcProName;
        binder.targetSelector = targetSelector;
        binder.targetProType = targetProType;
        binder.targetProName = targetProName;
        return binder
    }
};
var YibuEventBinder = {
    createNew: function (srcElement, eventKey, eventFunc) {
        var binder = {};
        binder.srcElement = srcElement;
        binder.eventKey = eventKey;
        binder.eventFunc = eventFunc;
        return binder
    }
};

function BindOnePropertyToSmartView(srcElement, eventKey, srcProType, srcProName, targetSelector, targetProType, targetProName) {
    var binder = YibuPropertyBinder.createNew(srcElement, eventKey, srcProType, srcProName, targetSelector, targetProType, targetProName);
    _eventBoundArray.push(binder)
}
function BindOneEventFuncToSmartVeiw(srcElement, eventKey, func) {
    var binder = YibuEventBinder.createNew(srcElement, eventKey, func);
    _eventBoundArray.push(binder)
}
function BindAllEventsToSmartView(htmlElementId) {
    var len = _eventBoundArray.length;
    for (var i = 0; i < len; i++) {
        var binder = _eventBoundArray[i];
        if (binder.targetSelector != null && binder.targetSelector != "undefined") {
            binder.srcElement.bind(binder.eventKey, {
                bd: binder
            }, function (event) {
                var _binder = event.data.bd;
                var obj = $("#" + htmlElementId + " " + _binder.targetSelector, $("#mainFrame")[0].contentWindow.document);
                var srcValue = "";
                var that = $(this);
                switch (_binder.srcProType) {
                    case "attr":
                        srcValue = that.attr(_binder.srcProName);
                        break;
                    case "css":
                        srcValue = that.css(_binder.srcProName);
                        break;
                    case "val":
                        srcValue = that.val();
                        break;
                    case "html":
                        srcValue = that.html();
                        break
                }
                switch (_binder.targetProType) {
                    case "attr":
                        obj.attr(_binder.targetProName, srcValue);
                        break;
                    case "css":
                        obj.css(_binder.targetProName, srcValue);
                        break;
                    case "html":
                        obj.html(srcValue);
                        break;
                    case "val":
                        obj.val(srcValue);
                        break
                }
            })
        } else {
            binder.srcElement.bind(binder.eventKey, {
                bd: binder
            }, function (event) {
                event.data.bd.eventFunc(event.data.bd.srcElement)
            })
        }
    }
}
function GetCurrentStrWidth(text, font) {
    var currentObj = $("<span>").hide().appendTo(document.body);
    $(currentObj).html(text).css("font-size", font);
    var width = currentObj.width();
    currentObj.remove();
    return width
}
function slideMenu(navId) {
    jQuery("#" + navId).slide({
        type: "menu",
        titCell: ".w_nav_item",
        targetCell: ".w_subnav",
        effect: "slideDown",
        delayTime: 300,
        triggerTime: 0,
        returnDefault: true
    })
}
function ChangeImage(HElement) {
    var autoimg = $("#autosize_" + HElement + " img");
    var aotoparent = $("#autosize_" + HElement);
    var w = $(aotoparent).parent().width();
    var h = $(aotoparent).parent().height();
    $(autoimg).css({
        "max-width": w,
        "max-height": h,
        "_width": w,
        "vertical-align": "middle"
    });
    $(aotoparent).css({
        "line-height": h + "px"
    })
}
function IsPositionBehind(lastExpanView, view) {
    var minHeight = lastExpanView.css("min-height");
    minHeight = _.isUndefined(minHeight) || minHeight == 0 ? lastExpanView.height() : parseInt(minHeight.substring(0, minHeight.length - 2));
    if (lastExpanView.offset()) {
        var lastViewBottom = parseInt(lastExpanView.offset().top) + minHeight;
        var lastViewRight = parseInt(lastExpanView.offset().left) + parseInt(lastExpanView.width())
    }
    if (parseInt(view.offset().top) >= lastViewBottom && parseInt(view.offset().left + view.width()) > parseInt(lastExpanView.offset().left) && parseInt(view.offset().left) < lastViewRight) {
        return true
    }
    return false
}
function IsInContainerBehind(lastExpanView, view) {
    var minHeight = lastExpanView.css("min-height");
    minHeight = _.isUndefined(minHeight) || minHeight == 0 ? lastExpanView.height() : parseInt(minHeight.substring(0, minHeight.length - 2));
    var oldHeight = lastExpanView.attr('oheight');
    if (typeof (oldHeight) !== 'undefined' && !isNaN(oldHeight)) {
        minHeight = parseInt(oldHeight, 10);
    }
    if (lastExpanView.offset()) {
        var lastViewBottom = parseInt(lastExpanView.offset().top) + minHeight;
        var lastViewRight = parseInt(lastExpanView.offset().left) + parseInt(lastExpanView.width())
    }
    if (parseInt(view.offset().top) >= lastViewBottom && parseInt(view.offset().left + view.width()) > parseInt(lastExpanView.offset().left) && parseInt(view.offset().left) < lastViewRight) {
        return true
    }
    return false
}
function RefreshAutoExpandHeight(container, expandedAreaHeight) {
    if (expandedAreaHeight > 0) {
        var content = $(container).parentsUntil(".yibuFrameContent");

        if (content.length > 0) {
            var containerView = content.last().parent().parent();
            if (containerView.css("overflow") == "visible" && containerView.css("min-height") != "0px") {
                var initContainerHeight = containerView.height();
                var oInitHeight = containerView.attr('oheight');
                if (typeof (oInitHeight) === 'undefined') {
                    oInitHeight = initContainerHeight;
                    containerView.attr('oheight', oInitHeight);
                } else {
                    oInitHeight = parseInt(oInitHeight, 10);
                }
                var newHeight = oInitHeight + expandedAreaHeight;
                var cheight = containerView.attr('cheight');
                if (typeof (cheight) !== 'undefined') {
                    cheight = parseInt(cheight, 10);
                } else {
                    cheight = 0;
                }
                if (newHeight > cheight) {
                    content.each(function (index, el) {
                        $(el).height(newHeight)
                    });
                    containerView.height(newHeight);
                    containerView.css({ 'min-height': newHeight + 'px' });
                    containerView.attr('cheight', newHeight);
                    var oldExpandH = containerView.attr('expandH');
                    if (typeof (oldExpandH) === 'undefined') {
                        oldExpandH = 0;
                    } else {
                        oldExpandH = parseInt(oldExpandH, 10);
                    }
                    if (expandedAreaHeight > oldExpandH) {
                        containerView.attr('expandH', expandedAreaHeight);
                    }
                }
                container.css({ 'min-height': newHeight + 'px' });
                container.attr('expandH', expandedAreaHeight);
            } else {
                var initContainerHeight = containerView.height();
                var oInitHeight = containerView.attr('oheight');
                if (typeof (oInitHeight) === 'undefined') {
                    oInitHeight = initContainerHeight;
                    containerView.attr('oheight', oInitHeight);
                } else {
                    oInitHeight = parseInt(oInitHeight, 10);
                }
                var cheight = containerView.attr('cheight');
                if (typeof (cheight) !== 'undefined') {
                    cheight = parseInt(cheight, 10);
                } else {
                    cheight = 0;
                }
                var newHeight = oInitHeight + expandedAreaHeight;
                if (newHeight > cheight) {
                    content.each(function (index, el) {
                        $(el).height(expandedAreaHeight)
                    });
                    containerView.height(newHeight);
                    containerView.css({ 'min-height': newHeight + 'px' });
                    containerView.attr('cheight', newHeight);
                    containerView.attr('expandH', expandedAreaHeight);
                    var viewId = containerView.attr('id');
                    var viewArray = viewId.split('_');
                    if (viewArray.length == 4) {
                        var viewType = viewArray[1];
                        if (viewType === 'banner' || viewType === 'v2banner') {
                            $('#fullScreen_' + viewId).height(oInitHeight + expandedAreaHeight);
                        }
                    }
                }
                container.css({ 'min-height': newHeight + 'px' });
                container.attr('expandH', expandedAreaHeight);
            }
        } else {
            if ($(container).parent().hasClass("yibuFrameContent")) {
                var containerView = $(container).parent().parent();
                var containerViewchild = $(container).parent();
                var initContainerHeight = containerView.height();
                var oInitHeight = containerView.attr('oheight');
                if (typeof (oInitHeight) === 'undefined') {
                    oInitHeight = initContainerHeight;
                    containerView.attr('oheight', oInitHeight);
                    //var newHeight = oInitHeight + expandedAreaHeight;
                    //containerView.height(newHeight);
                    //containerViewchild.height(containerView.height());
                } else {
                    oInitHeight = parseInt(oInitHeight, 10);
                }
                var oldExpandH = containerView.attr('expandH');
                if (typeof (oldExpandH) === 'undefined') {
                    oldExpandH = 0;
                } else {
                    oldExpandH = parseInt(oldExpandH, 10);
                }
                if (expandedAreaHeight > oldExpandH) {
                    containerView.attr('expandH', expandedAreaHeight);
                }

                containerView.height(oInitHeight + expandedAreaHeight);
                containerViewchild.height(oInitHeight + expandedAreaHeight);
                var viewId = containerView.attr('id');
                var viewArray = viewId.split('_');
                if (viewArray.length == 4) {
                    var viewType = viewArray[1];
                    if (viewType === 'banner' || viewType === 'v2banner') {
                        container.height(oInitHeight + expandedAreaHeight);
                        $('#fullScreen_' + viewId).height(oInitHeight + expandedAreaHeight);
                    }
                }
            }
        }
    }
}
function parsePxToInt(px) {
    return parseInt(px.substring(0, px.length - 2))
}
function ReComputeVisibleSmartViewTop(func) {
    var recomputeObj = new ReComputeVisibleSmartView(func);
    recomputeObj.recomputeTopV1()
}
function ReComputeVisibleSmartView(func) {
    this.callback = func
}
ReComputeVisibleSmartView.prototype.IsDynamicLoaded = function (dynamicList, callback) {
    var timeCount = 1000 * 5;
    var exeTime = 0;
    var timer = setInterval(function () {
        var loaded = true;
        _.each(dynamicList, function (one, index) {
            if (one && $(one).is("img") && !one.complete) {
                loaded = false
            }
            if ($(one).attr("data-isload") == 0) {
                loaded = false
            }
        });
        exeTime += 50;
        if (loaded || exeTime >= timeCount) {
            clearInterval(timer);
            callback(dynamicList)
        }
    }, 50)
};
ReComputeVisibleSmartView.prototype.sort = function (a, b) {
    return $(a).offset().top > $(b).offset().top ? 1 : -1;
}
ReComputeVisibleSmartView.prototype.isAutoHeight = function (view) {
    var child = $(view).children(".yibuFrameContent");
    return child.hasClass("overflow_hidden") == false && child.hasClass("overflow_auto") == false && $(view).css("min-height") != "0px"
}
ReComputeVisibleSmartView.prototype.recomputeTopV1 = function () {
    var that = this;
    var $main = $('.main');
    var areas = null;
    if ($main.length > 0) {
        areas = $main.find(".runTimeflowsmartView,.isflowcontainer");
    } else {
        areas = $('.mainSamrtView').find(".runTimeflowsmartView,.isflowcontainer");
    }
    areas = _.sortBy(areas, function (oneArea) {
        if ($(oneArea).hasClass('runTimeflowsmartView')) {
            return 9999999;
        } else {
            return $(oneArea).parentsUntil('.yibuSmartViewMargin').position().top;
        }
    });
    _.each(areas, function (el, index) {
        var oneArea = $(el);
        var displaystatus = oneArea.css("display");
        if (displaystatus == "none") {
            oneArea.addClass("notvisible").show()
        }
        var allViews = oneArea.children("div[class^='yibuSmartViewMargin absPos']");
        allViews = allViews.sort(that.sort);
        allViews.each(function (index, el) {
            var oneEl = $(this);
            var child = oneEl.children(".yibuFrameContent");
            var oldHeight;
            if (child.hasClass("overflow_hidden") == false && child.hasClass("overflow_auto") == false) {
                oldHeight = _.isUndefined(oneEl.css("min-height")) || oneEl.css("min-height") == "0px" ? oneEl.height() : parsePxToInt(oneEl.css("min-height"))
            } else {
                oldHeight = oneEl.height()
            }
            var oldTop = parsePxToInt(oneEl.css("top"));
            $(this).attr("oldBottom", oldTop + oldHeight)
        });
        var dynamicList = new Array();
        var autoExpanViews = _.filter(allViews, function (oneView) {
            var $view = $(oneView);
            var viewId = $view.attr('id');
            var viewType = viewId.split('_')[1];
            var child = $view.children(".yibuFrameContent");
            return viewType !== 'v2dropdownlist' &&
                viewType !== 'v2search'&&
                viewType !== 'v2address' &&
                viewType !== 'v2formdate' &&
                child.hasClass("overflow_hidden") == false &&
                child.hasClass("overflow_auto") == false &&
                $(oneView).css("min-height") != "0px";
        });
        autoExpanViews = _.sortBy(autoExpanViews, function (oneView) {
            return $(oneView).offset().top;
        });
        for (var k in autoExpanViews) {
            try {
                var view = $(autoExpanViews[k]);
                var minHeight = view.css("min-height");
                if (typeof (minHeight) !== "undefined") {
                    minHeight = parseInt(minHeight, 10)
                } else {
                    minHeight = 0
                }
                var viewHeight = view.height();
                var cviewHeight = view.attr('cheight');
                if (typeof (cviewHeight) !== 'undefined') {
                    cviewHeight = parseInt(cviewHeight, 10);
                    viewHeight = cviewHeight;
                }
                var expandedHeight = viewHeight - minHeight;
                var viewOldExpandH = view.attr('expandH');
                if (typeof (viewOldExpandH) !== 'undefined') {
                    viewOldExpandH = parseInt(viewOldExpandH, 10);
                } else {
                    viewOldExpandH = 0;
                }
                var isContainer = view.find('.isflowcontainer').length > 0 ? true : false;
                if (isContainer) {
                    expandedHeight = viewOldExpandH;
                }
                if (expandedHeight > 0) {
                    if (!isContainer) {
                        allViews.each(function (index, el) {
                            var x = $(this);
                            if (x != view && IsPositionBehind(view, x)) {
                                var myTop = parsePxToInt(x.css("top"));
                                x.css("top", (myTop + expandedHeight) + "px");
                                var oldExpandH = x.attr('expandH');
                                if (typeof (oldExpandH) !== 'undefined') {
                                    oldExpandH = parseInt(oldExpandH, 10);
                                } else {
                                    oldExpandH = 0;
                                }
                                var isContainer = x.find('.isflowcontainer').length > 0 ? true : false;
                                var isAutoHeight = that.isAutoHeight(x);
                                if (!isContainer || !isAutoHeight) {
                                    x.attr('expandH', expandedHeight + oldExpandH);
                                } else {
                                    if (index == allViews.length - 1) {
                                        x.attr('expandH', expandedHeight + oldExpandH);
                                    }
                                }

                            }
                        })

                        var newMinHeight = minHeight + expandedHeight;
                        view.css("min-height", newMinHeight);

                        view.attr('expandH', expandedHeight + viewOldExpandH);
                    } else {
                        allViews.each(function (index, el) {
                            var x = $(this);
                            if (x != view && IsInContainerBehind(view, x)) {
                                var myTop = parsePxToInt(x.css("top"));
                                x.css("top", (myTop + expandedHeight) + "px");
                                var oldExpandH = x.attr('expandH');
                                if (typeof oldExpandH === 'undefined') {
                                    oldExpandH = 0;
                                } else {
                                    oldExpandH = parseInt(oldExpandH, 10);
                                }
                                var isContainer = x.find('.isflowcontainer').length > 0 ? true : false;
                                var isAutoHeight = that.isAutoHeight(x);
                                if (!isContainer || !isAutoHeight) {
                                    x.attr('expandH', expandedHeight + oldExpandH);
                                } else {
                                    if (index == allViews.length - 1) {
                                        x.attr('expandH', expandedHeight + oldExpandH);
                                    }
                                }
                            }
                        });
                    }
                }
            } catch (e) { }
        }
        var maxBottomView = null;
        var maxBottom = 0;
        allViews.each(function (index, el) {
            var x = $(this);
            if (maxBottomView == null || parsePxToInt(x.css("top")) + x.height() > maxBottom) {
                maxBottom = parsePxToInt(x.css("top")) + x.height();
                maxBottomView = x
            }
        });
        if (maxBottomView != null && maxBottom >= parseInt(maxBottomView.attr("oldBottom"))) {
            var expandedAreaHeight = parseInt(maxBottomView.attr("expandH"), 10);
            if (expandedAreaHeight > 0) {
                RefreshAutoExpandHeight(oneArea, expandedAreaHeight);
            }
        }
        if (!_.isUndefined(that.callback)) {
            that.callback()
        }
        if (displaystatus == "none") {
            oneArea.hide().removeClass("notvisible")
        }
    })
}
ReComputeVisibleSmartView.prototype.recomputeTop = function () {
    var that = this;
    var areas = $(".runTimeflowsmartView,.isflowcontainer");
    areas = _.sortBy(areas, function (oneArea) {
        return -$(oneArea).parents().length
    });
    _.each(areas, function (el, index) {
        var oneArea = $(el);
        var displaystatus = oneArea.css("display");
        if (displaystatus == "none") {
            oneArea.addClass("notvisible").show()
        }
        var allViews = oneArea.children("div[class^='yibuSmartViewMargin absPos']");
        allViews.each(function (index, el) {
            var oneEl = $(this);
            var child = oneEl.children(".yibuFrameContent");
            var oldHeight;
            if (child.hasClass("overflow_hidden") == false && child.hasClass("overflow_auto") == false) {
                oldHeight = _.isUndefined(oneEl.css("min-height")) || oneEl.css("min-height") == "0px" ? oneEl.height() : parsePxToInt(oneEl.css("min-height"))
            } else {
                oldHeight = oneEl.height()
            }
            var oldTop = parsePxToInt(oneEl.css("top"));
            $(this).attr("oldBottom", oldTop + oldHeight)
        });
        var dynamicList = new Array();
        var autoExpanViews = _.filter(allViews, function (oneView) {
            $(oneView).find("img").each(function () {
                if ($(this).hasClass("lazyload")) {
                    $(this).attr("src", $(this).attr("data-original"))
                }
                dynamicList.push(this)
            });
            $(oneView).find(".comment_area").each(function () {
                dynamicList.push(this)
            });
            var child = $(oneView).children(".yibuFrameContent");
            return child.hasClass("overflow_hidden") == false && child.hasClass("overflow_auto") == false && $(oneView).css("min-height") != "0px"
        });
        that.IsDynamicLoaded(dynamicList, function (dynamicList) {
            autoExpanViews = _.sortBy(autoExpanViews, function (oneView) {
                return $(oneView).offset().top
            });
            for (var k in autoExpanViews) {
                try {
                    var view = $(autoExpanViews[k]);
                    var minHeight = view.css("min-height");
                    if (typeof (minHeight) !== "undefined") {
                        minHeight = parseInt(minHeight, 10)
                    } else {
                        minHeight = 0
                    }
                    var expandedHeight = view.height() - minHeight;

                    allViews.each(function (index, el) {
                        var x = $(this);
                        if (x != view && IsPositionBehind(view, x)) {
                            var myTop = parsePxToInt(x.css("top"));
                            x.css("top", (myTop + expandedHeight) + "px")
                        }
                    })
                } catch (e) { }
            }
            var maxBottomView = null;
            var maxBottom = 0;
            allViews.each(function (index, el) {
                var x = $(this);
                if (maxBottomView == null || parsePxToInt(x.css("top")) + x.height() > maxBottom) {
                    maxBottom = parsePxToInt(x.css("top")) + x.height();
                    maxBottomView = x
                }
            });
            if (maxBottomView != null && maxBottom > parseInt(maxBottomView.attr("oldBottom"))) {
                var expandedAreaHeight = maxBottom - parseInt(maxBottomView.attr("oldBottom"));
                RefreshAutoExpandHeight(oneArea, expandedAreaHeight)
            }
            if (!_.isUndefined(that.callback)) {
                that.callback()
            }
            if (displaystatus == "none") {
                oneArea.hide().removeClass("notvisible")
            }
        })
    })
};
//tag 当前下拉控件(需判断控件是否在模板中)，bottom 当前下拉控件底部y值，offset 下拉高度
function ReComputMobileTop(tag, bottom, offset) {
    var isInTemp = tag.parents(".page_header");
    //当前下拉控件在模板页中，则模板页中的控件curtop不变，模板页外的curtop需加上 模板高度
    if (isInTemp.length > 0) {
        var header = $(".page_header");
        var main = $(".page_main");
        var headerViews = header.find("div[class^='yibuSmartViewMargin absPos']");
        var mainViews = main.find("div[class^='yibuSmartViewMargin absPos']");
        var headerHeight = header.height();
        headerViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            if (curTop > bottom) {
                var oldBottom = $(this).attr("oldbottom");
                //获取原top值 只计算实际偏移量，不对中间过程进行处理
                var oldtop = parseFloat(oldBottom) - parseFloat($(this).css("min-height").replace("px", "")) + 2;
                var newtop = oldtop + offset;
                $(this).css("top", newtop + "px");
            }
        });
        mainViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", "")) + headerHeight;
            if (curTop > bottom) {
                var oldBottom = $(this).attr("oldbottom");
                //获取原top值 只计算实际偏移量，不对中间过程进行处理
                var oldtop = parseFloat(oldBottom) - parseFloat($(this).css("min-height").replace("px", "")) + 2;
                var newtop = oldtop + offset;
                $(this).css("top", newtop + "px");
            }
        });
    } else {
        var $main;
        if ($(".page_header").length > 0) {
            $main = $('.page_main');
        } else {
            $main = $('.mainSamrtView');
        }
        var allViews = $main.find("div[class^='yibuSmartViewMargin absPos']");
        allViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            if (curTop > bottom) {
                var oldBottom = $(this).attr("oldbottom");
                var oldtop;
                //获取原top值 只计算实际偏移量，不对中间过程进行处理
                if ($(this).css("min-height") == "0px") {
                    oldtop = parseFloat(oldBottom) - parseFloat($(this).css("height").replace("px", "")) + 2;
                } else {
                    oldtop = parseFloat(oldBottom) - parseFloat($(this).css("min-height").replace("px", "")) + 2;
                }

                var newtop = oldtop + offset;
                $(this).css("top", newtop + "px");
            }
        });
    }
}

function Pagination(TagId, First, Last, Previous, Next, callback) {
    var HtmlId = TagId;
    var canSeePage = 5;
    var leftIndex = 0,
        rightIndex = 0;
    var newContainer = $("#" + HtmlId);
    if (newContainer.html() != null) {
        var contents = newContainer.find("div").html().split("_ueditor_page_break_tag_");
        var length = contents.length;
        if (length != 1) {
            var paginationDiv = $("<div />", {
                "class": "pagination"
            });
            newContainer.append(paginationDiv);
            if (length > canSeePage) {
                paginationDiv.append("<span id=first_page_" + HtmlId + ">" + ((First == null || First == undefined) ? "首页" : First) + "</span>");
                paginationDiv.append("<span id=pre_page_" + HtmlId + ">" + ((Previous == null || Previous == undefined) ? "上一页" : Previous) + "</span>")
            }
            for (var i = 0; i < length; i++) {
                paginationDiv.append("<a class='page' id=" + i + " >" + (i + 1) + "</a>")
            }
            var page = newContainer.find(".page");
            page.first().addClass("hover");
            newContainer.find(".page:gt(" + (canSeePage - 1) + ")").hide();
            page.click(function () {
                var currentId = parseInt($(this).attr("id"));
                if (length < canSeePage) {
                    page.removeClass("hover");
                    newContainer.find("div:eq(0)").html(contents[currentId]);
                    $(this).addClass("hover")
                } else {
                    if (length >= canSeePage && currentId > Math.floor(canSeePage / 2)) {
                        page.removeClass("hover");
                        newContainer.find("div:eq(0)").html(contents[currentId]);
                        $(this).addClass("hover");
                        canSeePage % 2 === 0 ? (leftIndex = currentId - canSeePage / 2 + 1, rightIndex = currentId + canSeePage / 2) : (leftIndex = currentId - Math.floor(canSeePage / 2), rightIndex = currentId + Math.floor(canSeePage / 2));
                        if (leftIndex > length - canSeePage) {
                            newContainer.find(".page:gt(" + (length - canSeePage) + ")").show();
                            newContainer.find(".page:lt(" + (length - canSeePage) + ")").hide()
                        } else {
                            newContainer.find(".page:lt(" + leftIndex + ")").hide();
                            newContainer.find(".page:gt(" + rightIndex + ")").hide();
                            page.slice(leftIndex, rightIndex + 1).show()
                        }
                    } else {
                        if (length >= canSeePage && currentId <= Math.floor(canSeePage / 2)) {
                            page.removeClass("hover");
                            newContainer.find("div:eq(0)").html(contents[currentId]);
                            $(this).addClass("hover");
                            newContainer.find(".page:gt(" + (canSeePage - 1) + ")").hide();
                            newContainer.find(".page:lt(" + canSeePage + ")").show()
                        }
                    }
                }
                if (length > canSeePage) {
                    var currentPageId = parseInt(newContainer.find(".hover").attr("id")) + 1;
                    $("#current_page_" + HtmlId).text(currentPageId + "/" + length)
                }
                if (typeof (callback) == "function") {
                    callback();
                }
            });
            if (length > canSeePage) {
                var currentPageId = parseInt(newContainer.find(".hover").attr("id")) + 1;
                paginationDiv.append("<span id=current_page_" + HtmlId + ">" + currentPageId + "/" + length + "</span>");
                paginationDiv.append("<span id=post_page_" + HtmlId + ">" + ((Next == null || Next == undefined) ? "下一页" : Next) + "</span>");
                paginationDiv.append("<span id=last_page_" + HtmlId + ">" + ((Last == null || Last == undefined) ? "尾页" : Last) + "</span>")
            }
            var prepage = $("#pre_page_" + HtmlId);
            var postpage = $("#post_page_" + HtmlId);
            var firstpage = $("#first_page_" + HtmlId);
            var lastpage = $("#last_page_" + HtmlId);
            var topage = $("#to_page_" + HtmlId);
            var gopage = $("#go_page_" + HtmlId);
            prepage.click(function () {
                var btn = $(this).parent().find(".hover");
                if (btn.attr("id") !== "0") {
                    page.removeClass("hover");
                    btn.prev().addClass("hover");
                    btn.prev().click();
                }
                ReComputeVisibleSmartViewTop();
            });
            postpage.click(function () {
                var nextBtn = $(this).parent().find(".hover").next();
                if (nextBtn.attr("id") < $(this).parent().children("a").length) {
                    page.removeClass("hover");
                    nextBtn.addClass("hover");
                    nextBtn.click()
                }
                ReComputeVisibleSmartViewTop()
            });
            firstpage.click(function () {
                page.removeClass("hover");
                page.first().addClass("hover");
                var firstBtn = page.first();
                firstBtn.click()
            });
            lastpage.click(function () {
                page.removeClass("hover");
                page.last().addClass("hover");
                var nextBtn = page.last();
                nextBtn.click()
            });
            gopage.click(function () {
                var topageMun = topage.val();
                var reg = /^[0-9]*[1-9][0-9]*$/;
                var flag = reg.test(topageMun);
                if (parseInt(topageMun) > length || !flag) {
                    alert("无第【" + topageMun + "】页,请重新键入");
                    return
                }
                page.removeClass("hover");
                newContainer.find(".page:eq(" + (topageMun - 1) + ")").addClass("hover");
                var hoverBtn = $(this).parent().find(".hover");
                hoverBtn.click()
            })
        }
        newContainer.find("div:eq(0)").html(contents[0])
    }
}

function ListPagination(pagerStyle, pageIndex) {

}

var AjaxLoginCheck = {
    callback: null,
    checkLogin: function () {
        $.ajax({
            cache: false,
            url: "/customer/CheckLoginState",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    window[AjaxLoginCheck.callback]()
                } else {
                    AjaxLoginCheck.openLoginDialog(AjaxLoginCheck.callback)
                }
            }
        })
    },
    openLoginDialog: function () {
        $.ajax({
            cache: false,
            url: "/customer/logindialog?callback=" + AjaxLoginCheck.callback,
            type: "get",
            success: function (data) {
                if ($("#loginForm").length > 0) {
                    $("#loginForm").remove()
                }
                $("body").append(data)
            }
        })
    }
};

function BindHoldPlace(element, holdText) {
    var $inputTxt = $(element);
    $inputTxt.val(holdText);
    $inputTxt.css("color", "rgb(171, 169, 177)");
    $inputTxt.focusin(function () {
        if ($(this).val() == holdText) {
            $(this).css("color", "rgb(171, 169, 177)");
            $(this).val("")
        } else {
            $(this).css("color", "#000000")
        }
    });
    $inputTxt.focusout(function () {
        if ($(this).val() == "" || $(this).val() == holdText) {
            $(this).css("color", "rgb(171, 169, 177)");
            $(this).val(holdText)
        } else {
            $(this).css("color", "#000000")
        }
    });
    $inputTxt.keyup(function () {
        if ($(this).val() == "") {
            $(this).css("color", "rgb(171, 169, 177)");
            $(this).val(holdText)
        } else {
            $(this).css("color", "#000000")
        }
    });
}
function GetStateProvince(stateProvinceId, obj) {
    $.ajax({
        cache: false,
        url: "/Customer/GetStateProvinces",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data != null) {
                $.each(data, function (i, item) {
                    if (item["Id"] == stateProvinceId) {
                        obj.append("<option value=" + item["Id"] + " selected>" + item["Name"] + "</option>")
                    } else {
                        obj.append("<option value=" + item["Id"] + ">" + item["Name"] + "</option>")
                    }
                })
            }
        },
        error: function () { }
    })
}
function GetCity(stateProvinceId, cityId, obj) {
    $.ajax({
        cache: false,
        url: "/Customer/GetCitysByStateProvince",
        data: {
            "stateProvinceId": stateProvinceId
        },
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data != null) {
                $.each(data, function (i, item) {
                    if (item["Id"] == cityId) {
                        obj.append("<option value=" + item["Id"] + " selected>" + item["Name"] + "</option>")
                    } else {
                        obj.append("<option value=" + item["Id"] + ">" + item["Name"] + "</option>")
                    }
                })
            }
        },
        error: function () { }
    })
};
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function SetCategorySelectedStyle(cId) {
    var cid = getQueryString("categoryId");
    $("#" + cId + ' .for_search').each(function () {
        var data_cid = $(this).attr("data-cid");
        if (cid == data_cid) {
            $(this).addClass("category_select");
            return;
        }
    })
}
function SetCategorySelectedById(cId, cid) {
    $("#" + cId + ' .for_search').each(function () {
        var data_cid = $(this).attr("data-cid");
        if (cid == data_cid) {
            $(this).addClass("category_select");
            return;
        } else {
            $(this).removeClass("category_select");
        }
    })
}
function GetOrigin() {
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
    return window.location.origin;
}

//tag 当前下拉控件(需判断控件是否在模板中)，bottom 当前下拉控件底部y值，offset 下拉高度
function ReComputTop(tag, bottom, offset) {
    var isInTemp = tag.parents(".page_header");
    //当前下拉控件在模板页中，则模板页中的控件curtop不变，模板页外的curtop需加上 模板高度
    if (isInTemp.length > 0) {
        var header = $(".page_header");
        var main = $(".page_main");
        var headerViews = header.find("div[class^='yibuSmartViewMargin absPos']");
        var mainViews = main.find("div[class^='yibuSmartViewMargin absPos']");
        var headerHeight = header.height();
        headerViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            if (curTop > bottom) {
                var oldBottom = $(this).attr("oldbottom");
                //获取原top值 只计算实际偏移量，不对中间过程进行处理
                var oldtop = parseFloat(oldBottom) - parseFloat($(this).css("min-height").replace("px", "")) + 2;
                var newtop = oldtop + offset;
                $(this).css("top", newtop + "px");
            }
        });
        mainViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", "")) + headerHeight;
            if (curTop > bottom) {
                var oldBottom = $(this).attr("oldbottom");
                //获取原top值 只计算实际偏移量，不对中间过程进行处理
                var oldtop = parseFloat(oldBottom) - parseFloat($(this).css("min-height").replace("px", "")) + 2;
                var newtop = oldtop + offset;
                $(this).css("top", newtop + "px");
            }
        });
    } else {
        var $main;
        if ($(".page_header").length > 1) {
            $main = $('.page_main');
        } else {
            $main = $('.mainSamrtView');
        }
        var allViews = $main.find("div[class^='yibuSmartViewMargin absPos']");
        allViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            if (curTop > bottom) {
                var oldBottom = $(this).attr("oldbottom");
                //获取原top值 只计算实际偏移量，不对中间过程进行处理
                var oldtop = parseFloat(oldBottom) - parseFloat($(this).css("min-height").replace("px", "")) + 2;
                var newtop = oldtop + offset;
                $(this).css("top", newtop + "px");
            }
        });
    }
}

//tag 当前筛选下拉控件(需判断控件是否在模板中)
function ReComputTopForPc(tag, bottom, offset) {
    var isInTemp = tag.parents(".page_header");
    //当前下拉控件在模板页中，则模板页中的控件curtop不变，模板页外的curtop需加上 模板高度
    if (isInTemp.length > 0) {
        var header = $(".page_header");
        var main = $(".page_main");
        var headerViews = header.find("div[class^='yibuSmartViewMargin absPos']");
        var mainViews = main.find("div[class^='yibuSmartViewMargin absPos']");
        var headerHeight = header.height();

        //是否需要偏移
        var isNeedOffset = false;
        headerViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            //仅在offset区域内存在控件 才做偏移操作，若无控件则不做偏移，
            //偏移量大于0时记录hasExpandView为true,返回时才有迹可依
            if (offset > 0) {
                if (curTop > bottom && curTop < bottom + offset) {
                    isNeedOffset = true;
                    tag.attr("hasExpandView", "true");
                }
            } else {
                if (tag.attr("hasExpandView") == "true") {
                    isNeedOffset = true;
                    tag.attr("hasExpandView", "false");
                }
            }
        });
        if (!isNeedOffset) {
            return;
        }

        headerViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            if (curTop > bottom) {
                var newtop = curTop + offset;
                $(this).css("top", newtop + "px");
            }
        });
        mainViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", "")) + headerHeight;
            if (curTop > bottom) {
                var newtop = curTop + offset;
                $(this).css("top", newtop + "px");
            }
        });
    } else {
        var $main;
        //当前页面有模板
        if ($(".page_header").length > 0) {
            $main = $('.page_main');
        } else {
            $main = $('.mainSamrtView');
        }
        var allViews;
        //判断是否在容器控件中
        var expanseBanner = false;
        var lessenBanner = false;
        var banner = tag.parents("div[id ^='view_banner_']");
        if (banner.length > 0) {
            allViews = banner.find("div[class *='yibuSmartViewMargin absPos']");
            var bannerTop = parseInt(banner.css("top").replace("px", ""));
            var bannerFlow = banner.find(".flowsmartView");
            var bannerHeight = bannerFlow.height();
            //向外弹，且超过容器下边界
            ReComputTopForPc(banner, bannerHeight + bannerTop, offset);
        } else {
            allViews = $main.find("div[class *='yibuSmartViewMargin absPos']");
        }
        //是否需要偏移
        var isNeedOffset = false;

        allViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            //仅在offset区域内存在控件 才做偏移操作，若无控件则不做偏移，
            //不在
            if (offset > 0) {
                if (curTop > bottom-8 &&  bottom + offset>= curTop) {
                    isNeedOffset = true;
                    $(this).attr("needoffset", "true");
                }
            } else {
                isNeedOffset = true;
            }
        });
        if (!isNeedOffset) {
            return;
        }

        allViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            //仅在offset区域内存在控件 才做偏移操作，若无控件则不做偏移
            if (curTop > bottom-8) {
                if ($(this).attr("old-top") == undefined) {
                    if ($(this).attr("needoffset") == "true") {
                        $(this).attr("old-top", curTop);
                        $(this).css("top", (curTop + offset) + "px");
                        if (banner.length > 0 && !expanseBanner) {
                            expanseBanner = true;
                            var bannerFlow = banner.find(".flowsmartView");
                            var bannerHeight = bannerFlow.height();
                            bannerFlow.css("height", bannerHeight + offset + "px");
                            var fullScreen = bannerFlow.siblings(".renderfullScreen");
                            //容器通栏
                            if (fullScreen.length > 0) {
                                fullScreen.css("height", bannerHeight + offset + "px");
                            }
                        }
                    }
                } else {
                    var oldTop = $(this).attr("old-top");
                    var curTop = parseInt($(this).css("top").replace("px", ""));
                    //if (curTop + offset >= oldTop) {
                    $(this).css("top", (curTop + offset) + "px");
                    if (banner.length > 0 && !lessenBanner) {
                        lessenBanner = true;
                        var bannerFlow = banner.find(".flowsmartView");
                        var bannerHeight = bannerFlow.height();
                        bannerFlow.css("height", bannerHeight + offset + "px");
                        var fullScreen = bannerFlow.siblings(".renderfullScreen");
                        //容器通栏
                        if (fullScreen.length > 0) {
                            fullScreen.css("height", bannerHeight + offset + "px");
                        }
                    }
                    //}
                }
            }
        });
        //页脚偏移
        if ($(".page_footer").length > 0) {
            if (offset > 0 || (offset < 0 && banner.length == 0) ) {
                var mainSmartView = $main.find(".mainSamrtView ");
                mainSmartView.css("height", mainSmartView.height() + offset + "px");
            }
        }
    }
}

//上面那个被筛选玩坏了， 下面这个为通用
function ReComputTopForPcCommon(tag, bottom, offset) {
    var isInTemp = tag.parents(".page_header");
    //当前下拉控件在模板页中，则模板页中的控件curtop不变，模板页外的curtop需加上 模板高度
    if (isInTemp.length > 0) {
        var header = $(".page_header");
        var main = $(".page_main");
        var headerViews = header.find("div[class^='yibuSmartViewMargin absPos']");
        var mainViews = main.find("div[class^='yibuSmartViewMargin absPos']");
        var headerHeight = header.height();

        //是否需要偏移
        var isNeedOffset = false;
        headerViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            //仅在offset区域内存在控件 才做偏移操作，若无控件则不做偏移，
            //偏移量大于0时记录hasExpandView为true,返回时才有迹可依
            if (offset > 0) {
                if (curTop > bottom && curTop < bottom + offset) {
                    isNeedOffset = true;
                    tag.attr("hasExpandView", "true");
                }
            } else {
                if (tag.attr("hasExpandView") == "true") {
                    isNeedOffset = true;
                    tag.attr("hasExpandView", "false");
                }
            }
        });
        if (!isNeedOffset) {
            return;
        }

        headerViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            if (curTop > bottom) {
                var newtop = curTop + offset;
                $(this).css("top", newtop + "px");
            }
        });
        mainViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", "")) + headerHeight;
            if (curTop > bottom) {
                var newtop = curTop + offset;
                $(this).css("top", newtop + "px");
            }
        });
    } else {
        var $main;
        //当前页面有模板
        if ($(".page_header").length > 0) {
            $main = $('.page_main');
        } else {
            $main = $('.mainSamrtView');
        }
        //判断是否在容器控件中
        var banner = tag.parents("div[id ^='view_banner_']");
        if (banner.length > 0) {
            var bannerTop = parseInt(banner.css("top").replace("px", ""));
            var bannerFlow = banner.find(".flowsmartView");
            var bannerHeight = bannerFlow.height();
            //向外弹，且超过容器下边界
            if (offset >= 0 && (bottom + offset > banner.height())) {
                if (bannerFlow.attr("old-height") == undefined) {
                    bannerFlow.attr("old-height", bannerHeight);
                }
                bannerFlow.css("height", bannerHeight + offset + "px");
                var fullScreen = bannerFlow.siblings(".renderfullScreen");
                //容器通栏
                if (fullScreen.length > 0) {
                    fullScreen.css("height", bannerHeight + offset + "px");
                }
                ReComputTopForPc(banner, bannerHeight + bannerTop, offset);
                return;
            } else {
                //往回弹
                var oldheight = bannerFlow.attr("old-height");
                if (offset < 0 && oldheight != undefined && bannerHeight + offset >= oldheight) {
                    bannerFlow.css("height", bannerHeight + offset + "px");
                    var fullScreen = bannerFlow.siblings(".renderfullScreen");
                    //容器通栏
                    if (fullScreen.length > 0) {
                        fullScreen.css("height", bannerHeight + offset + "px");
                    }
                    ReComputTopForPc(banner, bannerHeight + bannerTop, offset)
                    return;
                }
            }
        }

        var allViews = $main.find("div[class *='yibuSmartViewMargin absPos']");
        //是否需要偏移
        var isNeedOffset = false;
        var expanseBanner = false;
        var lessenBanner = false;
        allViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            //仅在offset区域内存在控件 才做偏移操作，若无控件则不做偏移，
            //不在
            if (offset > 0) {
                if (curTop > bottom-5 && curTop < bottom + offset+5) {
                    isNeedOffset = true;
                }
            } else {
                if ($(this).attr("old-top") != undefined) {
                    var oldTop = $(this).attr("old-top");
                    var curTop = parseInt($(this).css("top").replace("px", ""));
                    if (curTop + offset >= oldTop) {
                        isNeedOffset = true;
                    }
                }
            }
        });
        if (!isNeedOffset) {
            return;
        }
        allViews.each(function (index, el) {
            var curTop = parseFloat($(this).css("top").replace("px", ""));
            //仅在offset区域内存在控件 才做偏移操作，若无控件则不做偏移
            if (curTop > bottom-5) {
                if ($(this).attr("old-top") == undefined) {
                    $(this).attr("old-top", curTop);
                    $(this).css("top", (curTop + offset) + "px");
                    if (banner.length > 0 && !expanseBanner) {
                        expanseBanner = true;
                        var bannerFlow = banner.find(".flowsmartView");
                        var bannerHeight = bannerFlow.height();
                        bannerFlow.css("height", bannerHeight + offset + "px");
                        var fullScreen = bannerFlow.siblings(".renderfullScreen");
                        //容器通栏
                        if (fullScreen.length > 0) {
                            fullScreen.css("height", bannerHeight + offset + "px");
                        }
                    }
                } else {
                    var oldTop = $(this).attr("old-top");
                    var curTop = parseInt($(this).css("top").replace("px", ""));
                    if (curTop + offset >= oldTop) {
                        $(this).css("top", (curTop + offset) + "px");
                        if (banner.length > 0 && !lessenBanner) {
                            lessenBanner = true;
                            var bannerFlow = banner.find(".flowsmartView");
                            var bannerHeight = bannerFlow.height();
                            bannerFlow.css("height", bannerHeight + offset + "px");
                            var fullScreen = bannerFlow.siblings(".renderfullScreen");
                            //容器通栏
                            if (fullScreen.length > 0) {
                                fullScreen.css("height", bannerHeight + offset + "px");
                            }
                        }
                    }
                }
            }
        });
        //页脚偏移
        if ($(".page_footer").length > 0) {
            var mainSmartView = $main.find(".mainSamrtView ");
            mainSmartView.css("height", mainSmartView.height() + offset + "px");
        }
    }
}
// 刷新静态页面数据方法
function refreshStaticData() {
    var ar = $(".yibuFrameContent div[class^='yibuSmartViewMargin absPos'] .AR");
    if (ar.length == 0) {
        return;
    }
    var dateTypes = "";
    var dataTypeArr = [];
    var postObject = {};
    //过滤重复类型
    ar.each(function () {
        var curId = $(this).attr("data-dt");
        dateTypes = addStrToArrayString(curId, dateTypes);
    });
    dataTypeArr = dateTypes.split(',');
    //拼装参数
    for (var i = 0; i < dataTypeArr.length; i++) {
        var listIds = "";
        ar.each(function () {
            var dateType = $(this).attr("data-dt");
            if (dateType == dataTypeArr[i]) {
                listIds = addStrToArrayString($(this).attr("data-key"), listIds);
            }
        });
        postObject["postDatas[" + i + "].DataType"] = dataTypeArr[i];
        postObject["postDatas[" + i + "].DataKey"] = listIds;
    }
    //统一处理数据逻辑
    $.ajax({
        url: '/getIdHitDic',
        data: postObject,
        dataType: "json",
        type: "POST",
        //traditional: true,
        success: function (datas) {
            //遍历Hit dom、then赋值
            ar.each(function () {
                var $cur = $(this);
                var curType = $(this).attr("data-dt");
                var curId = $(this).attr("data-key");
                for (var i = 0; i < datas.length; i++) {
                    var dataType = datas[i].DataType;
                    //类型匹配
                    if (curType == dataType) {
                        var idHits = datas[i].ListIdHits;
                        for (j = 0; j < idHits.length; j++) {
                            if (curId == idHits[j].Id) {
                                $cur.html(idHits[j].Hit);
                            }
                        }
                    }
                }
            });
        }
    });
}
function resetbtn(sv) {
    if (sv.length == 0) return;
    var indiv = sv.find("div").css("white-space", "nowrap");
    var cw = sv.width() - (indiv.outerWidth(true) - indiv.width());
    var ch = sv.height() - (indiv.outerHeight(true) - indiv.height());
    indiv.width(cw).height(ch).css("white-space", "");
    indiv.find("a").width(cw).height(ch).css('line-height', ch + "px");
}