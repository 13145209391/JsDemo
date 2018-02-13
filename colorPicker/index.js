var pick = document.getElementById('pickBox');
var colorElement = pick.querySelector('.color');
var chooseColor = document.getElementById('chooseColor');
var colorPoint = pick.querySelector('.point');
var colorBar = pick.querySelector('.colorBar');
var rgbaText = pick.querySelector('.rgbaText');
var colorBarThumb = pick.querySelector('.bar.thumb');
var transparency = pick.querySelector('.transparency');
var transparencyBar = pick.querySelector('.transparencyBar');
var transparencyThumb = pick.querySelector('.transparency .thumb');
//color长宽
var colorWidth = colorElement.clientWidth;
var colorHeight = colorElement.clientHeight;
var transparencyBarWidth = transparencyBar.clientWidth;
//pickBox 距离浏览器的left,top;
var getPickBoxOffsetTop = function () {
    var top = 0;
    var topFunc = function (element) {
        if (element === void 0) { element = pick; }
        if (element.offsetParent.nodeName === 'BODY') {
            top = element.offsetTop;
        }
        else {
            top += element.offsetTop;
            return topFunc(element.offsetParent);
        }
    };
    topFunc();
    return top;
};
var getPickBoxOffsetLeft = function () {
    var left = 0;
    var leftFunc = function (element) {
        if (element === void 0) { element = pick; }
        if (element.offsetParent.nodeName === 'BODY') {
            left = element.offsetLeft;
        }
        else {
            left += element.offsetLeft;
            return leftFunc(element.offsetParent);
        }
    };
    leftFunc();
    return left;
};
var pickBoxOffsetTop = getPickBoxOffsetTop();
var pickBoxOffsetLeft = getPickBoxOffsetLeft();
console.log(pickBoxOffsetTop, pickBoxOffsetLeft);
var isMoveColor = false;
var transparencyCache = 1;
var changeColor = function (x, y) {
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    var _a = rgbToObj(colorElement.style.backgroundColor), r = _a.r, g = _a.g, b = _a.b;
    //右上 RGB;
    var difference = {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b
    };
    var scaleX = x / colorWidth;
    scaleChange(difference, scaleX);
    var result = {
        r: 255 - difference.r,
        g: 255 - difference.g,
        b: 255 - difference.b
    };
    var scaleY = y / colorHeight;
    scaleChange(result, 1 - scaleY);
    var RGBA = objToRGBA(result);
    chooseColor.style.backgroundColor = RGBA;
    rgbaText.value = RGBA;
    transparency.style.backgroundColor = objToRGB(result);
};
var scaleChange = function (diff, scale) {
    for (var i in diff) {
        diff[i] = (scale * diff[i]) | 0;
    }
};
var pxToNumber = function (px) {
    if (px === void 0) { px = '0px'; }
    return Number(px.slice(0, -2));
};
var objToRGBA = function (obj) {
    return "rgba(" + obj.r + "," + obj.g + "," + obj.b + "," + transparencyCache + ")";
};
var objToRGB = function (obj) {
    return "rgb(" + obj.r + "," + obj.g + "," + obj.b + ")";
};
var rgbToObj = function (rgbString) {
    var array = rgbString.split(',');
    return { r: Number(array[0].split('(')[1]), g: Number(array[1]), b: Number(array[2].slice(0, -1)) };
};
var colorBarRange = function (scale) {
    switch (true) {
        case scale < .17:
            return { rank: scale / .17, arr: [{ r: 255, g: 0, b: 0 }, { r: 255, g: 255, b: 0 }] };
        case scale < .33:
            return { rank: (scale - .17) / .16, arr: [{ r: 255, g: 255, b: 0 }, { r: 0, g: 255, b: 0 }] };
        case scale < .5:
            return { rank: (scale - .33) / .17, arr: [{ r: 0, g: 255, b: 0 }, { r: 0, g: 255, b: 255 }] };
        case scale < .67:
            return { rank: (scale - .5) / .17, arr: [{ r: 0, g: 255, b: 255 }, { r: 0, g: 0, b: 255 }] };
        case scale < .83:
            return { rank: (scale - .67) / .16, arr: [{ r: 0, g: 0, b: 255 }, { r: 255, g: 0, b: 255 }] };
        default:
            return { rank: (scale - .83) / .17, arr: [{ r: 255, g: 0, b: 255 }, { r: 255, g: 0, b: 0 }] };
    }
};
var getTransparency = function (rank) {
    return Number((1 - rank / transparencyBarWidth).toFixed(2));
};
pick.addEventListener('mousedown', function (ev) {
    var target = ev.target;
    if (target.className === 'p') {
        console.log('移动坐标');
    }
    // console.log(ev);
    // console.log(ev.target)
    // console.log(ev.offsetX, ev.offsetY);
    if (target.className === 'black') {
        isMoveColor = true;
        var x = ev.offsetX, y = ev.offsetY;
        colorPoint.style.left = x + 'px';
        colorPoint.style.top = y + 'px';
        changeColor(x, y);
        return false;
    }
    if (target.className === 'colorBar') {
        // console.log(ev)
        var y = ev.offsetY;
        colorBarThumb.style.top = y + 'px';
        var scale = y / colorHeight;
        var range = colorBarRange(scale);
        var rangeArr = range.arr;
        var diff = {
            r: rangeArr[0].r - rangeArr[1].r,
            g: rangeArr[0].g - rangeArr[1].g,
            b: rangeArr[0].b - rangeArr[1].b
        };
        var result = rangeArr[1];
        for (var i in diff) {
            result[i] = result[i] + diff[i] * (1 - range.rank) | 0;
        }
        colorElement.style.backgroundColor = objToRGB(result);
        changeColor(pxToNumber(colorPoint.style.left), pxToNumber(colorPoint.style.top));
    }
    if (target.className === 'transparencyBar') {
        var transparency_1 = getTransparency(ev.offsetX);
        transparencyThumb.style.left = ev.offsetX + 'px';
        transparencyCache = transparency_1;
        var currentColor = rgbaText.value.split(',');
        currentColor.splice(currentColor.length - 1, 1, transparency_1 + ')');
        var changeTransparencyColor = currentColor.join(',');
        rgbaText.value = changeTransparencyColor;
        chooseColor.style.backgroundColor = changeTransparencyColor;
    }
}, false);
document.addEventListener('mousemove', function (ev) {
    if (isMoveColor === true) {
        var target = ev.target;
        if (target.className !== 'p' && target.className !== 'point') {
            var x = ev.offsetX, y = ev.offsetY;
            // console.log(ev.clientY);
            switch (true) {
                case x < 0:
                    x = 0;
                case y < 0:
                    y = 0;
                case x > colorWidth:
                    x = colorWidth;
                case y > colorHeight:
                    y = colorHeight;
            }
            changeColor(x, y); //TODO 在选择颜色区域外有错误情况
            colorPoint.style.left = x + 'px';
            colorPoint.style.top = y + 'px';
            return false;
        }
    }
}, false);
document.addEventListener('mouseup', function () {
    isMoveColor = false;
}, false);
//# sourceMappingURL=index.js.map