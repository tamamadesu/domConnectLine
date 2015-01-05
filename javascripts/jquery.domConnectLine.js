var DCLine = function(ele,parms){

    "use strict";

    var _this   = this,
        line_x1 = 0,      // 左边X坐标
        line_y1 = 0,      // 左边Y坐标
        line_x2 = 0,      // 右边X坐标
        line_y2 = 0,      // 右边Y坐标
        l_index = 0,      // 左边点击元素下标
        r_index = 0,      // 右边点击元素下标
        direct  = '',     // 当前操作区域
        r_end   = false,  // 是否从左向右连
        l_end   = false;  // 是否从右往左连

    var parms = $.extend({
        listElementsClass:".list",
        listCollectClass:".list-ul",
        LineCssStyle:{
            'border':'1px solid #f00'
        },
        successCallback:function(){}

    },parms);
    // 获取连线角度
    DCLine.prototype.getAngle = function(cx,cy,ex,ey){
        var dy     = ey - cy,
            dx     = ex - cx,
            theta  = Math.atan2(dy, dx);
            theta *= 180/Math.PI;
        return theta;
    }

    // 绘制连线
    DCLine.prototype.drawLine = function(options){

        var len = Math.sqrt(Math.pow(options.x2 - options.x1,2) + Math.pow(options.y2 - options.y1, 2)),
            deg = _this.getAngle(options.x1,options.y1,options.x2,options.y2);

        var cssStyle = {
            'left':options.x1,
            'width':len,
            'top':options.y1,
            'position':'absolute',
            'border':'1px solid #ccc',
            '-moz-transform-origin':'left top',
            '-o-transform-origin':'left top',
            '-webkit-transform-origin':'left top',
            'transform-origin':'left top',
            '-webkit-transform':'rotate('+deg+'deg)',
            '-moz-transform':'rotate('+deg+'deg)',
            '-ms-transform':'rotate('+deg+'deg)',
            'transform':'rotate('+deg+'deg)'
        }
        cssStyle = $.extend(cssStyle,parms.LineCssStyle);
        $("<div />").addClass('line line_'+options.index.l).css(cssStyle).appendTo('body');

        parms.successCallback(options);

    }

    // 恢复默认连线
    _this.resetState = function(){
        line_x1 = 0;      // 左边X坐标
        line_y1 = 0;      // 左边Y坐标
        line_x2 = 0;      // 右边X坐标
        line_y2 = 0;      // 右边Y坐标
        l_index = 0;      // 左边点击元素下标
        r_index = 0;      // 右边点击元素下标
        direct  = '';     // 当前操作区域
        r_end   = false;  // 是否从左向右连
        l_end   = false;  // 是否从右往左连
    }

    $(ele).find(parms.listElementsClass).on("click",function(e){

        var $panel = $(ele),
            $ul    = $(this).parents(parms.listCollectClass),
            $left  = $panel.find(".left"),
            $right = $panel.find(".right"),
            direct = $ul.hasClass("left") ? "left" : "right",
            index  = $(this).index();

        if($(this).hasClass("select")){
            return false;
        }
        $(this).addClass("select");



        switch(direct){

            case "left":

                line_x1   = $(this).position().left + $(this).outerWidth();
                line_y1   = $(this).position().top + $(this).outerHeight();
                l_index   = index;

                if(l_end){

                    _this.drawLine({
                        direct:direct,
                        index:{
                            l:l_index,
                            r:r_index
                        },
                        x1:line_x1,
                        x2:line_x2,
                        y1:line_y1,
                        y2:line_y2
                    })

                    l_end = false;
                }else{
                    r_end = true;
                }


                break;

            case "right":

                line_x2 = $(this).position().left;
                line_y2 = $(this).position().top + $(this).outerHeight();
                r_index   = index;

                if(r_end){
                    _this.drawLine({
                        direct:direct,
                        index:{
                            l:l_index,r:r_index
                        },
                        x1:line_x1,
                        x2:line_x2,
                        y1:line_y1,
                        y2:line_y2
                    });
                    r_end = false;
                }else{
                    l_end = true;
                }
                break;
        }
    });
};

(function($){

    $.fn.dCLine = function(parms){
        var first;
        this.each(function(i){
            var that = $(this);
            var d = new DCLine(that[0],parms);
            if(!i){
                first = d;
            }
            that.data("dCLine",d);
        });
        return first;
    }

})(window.jQuery || window.Zepto);