/**
 *作用:将后台的数据发回来并做数据转换，然后修改option相应的值
 *@params:datas 后台API返回的数据
 *@params:option echarts 配置数据
 */
var m = Math;

var style = {
  color: '#d3edff',
  border: '0px solid rgb(51,51,51)',
  borderRadius: '4px',
  backgroundColor: 'rgba(0,0,0,0.8)'
};

export function convertRadarData(datas, option,seriesIndex) {
  var value = [], indicator = [], tags = [], name = [],radar={},series={};
  datas = datas.filter(function (t) {
    return t.allTotal !== 0;
  });
  datas.forEach(function (t) {
    value.push(t.total);
    name.push(t.cnName);
    indicator.push({text: t.cnName, max: t.allTotal})
  });
  radar = (seriesIndex !==undefined) ? option.radar[seriesIndex] : option.radar ;
  series = (seriesIndex !==undefined) ? option.series[seriesIndex] : option.series[0];
  indicator.forEach(function (t) {
    if (t.max === 0){  //处理数据全为0的情况；
      t.max = 1;
    }
  });
  radar.indicator = indicator;
  const formatterFun = radar.name.formatter || function (val,max) {
    return (val * 100 / max).toFixed(2)+ '%'
  }
  tags = indicator.map(function (t, index) {  //默认标签为indicator的text属性，这里需要生成特殊的组合，即显示标签也显示每个维度的得分，
    return t.text + '：'+ formatterFun(value[index],t.max);
  });
  radar.name.formatter = function (val) {  //根据默认标签值生成特殊定制的标签值
    return tags[name.indexOf(val)];
  }
  series.data[0].value = value;
}

export const addSeparator = val => {
  let str = val + '';
  return str.replace(/(\d)(?=(\d{3})+$)/g, '$1' + ',')
}
export const apiRequest = (options, todo) => {
  var prefix = '/api';
  /*  fetch('/api/rest/tourComment/getTourCommentDistributionByAspect?region=510000&dateType=YEAR&year=2017&quarter=4&month=10&day=26&nature=GOOD', {
        method:'get',
        mode:'no-cors',
      })*/
  $.ajax({
    async: options.async || true,
    url: prefix + options.url,
    type: options.type || "get",
    data: options.data || null,
    complete: function (jqXHR, textStatus) {
      if (textStatus === 'success') {
        var result = $.parseJSON(jqXHR.responseText);
        if (result.code === 1 && result.error === 'noauth') {
          window.location.href = '/login.html';
        } else {
          todo(result);
        }
      } else if (textStatus === 'timeout') {
        //是否跳转向504？
        todo({
          code: 1,
          status: 504,
          msg: '服务器响应超时'
        });
      } else {
        todo({
          code: 1,
          status: 500,
          msg: '服务器错误'
        });
      }
    }
  });
};


//文章：http://www.cnblogs.com/chengwb/p/5833454.html
/**
 * echarts tooltip轮播（支持折线，柱状，地图, 饼图, 散点图）
 * @param chart echarts.init初始化的对象
 * @param option 配置echarts的配置信息
 * @param interval 轮播时间间隔，单位毫秒，默认为2000
 * @param params 其他参数(可不传)
 * {
	 *  loopSeries boolean类型，默认为false。true表示循环所有series的tooltip，false则显示指定seriesIndex的tooltip
	 * 	seriesIndex（默认为0）指定某个系列（option中的series索引）循环显示tooltip，不指定则所有series都循环，当loopSeries为true时，默认从0开始，此属性无效
	 *  refreshOption 更新option配置的函数（主要是更新数据，刷新echarts）
	 *  isRefresh 轮播结束是否刷新（当总条数大于每页限制显示的条数则轮播时需要刷新echarts）
	 * }
 */
export const AutoShowTip = function (chart, option, interval, params, callback) {
  //对象属性存储
  let autoShowInstance ={}
  if(option.radar && option.series.length===1 ){  //单系列雷达，采用单轴轮播的方式
    autoShowInstance = new RadarAutoTip(chart, option, interval, params);
  }else{
    autoShowInstance = new CommonAutoTip(chart, option, interval, params, callback);
  }
  chart.clearAutoShow = autoShowInstance.clearAutoShow;
};
const CommonAutoTip = function (chart, option, interval, params, callback) {
  //对象属性存储
  this.chart = chart;
  this.option = option;
  this.zRender = chart.getZr();
  this.interval = (typeof interval === 'string' || typeof interval === 'number') ? parseInt(interval) : 2000;
  this.params = params;
  this.callback = callback;

  this.dataIndex = -1; // 数据索引，初始化为-1，是为了判断是否是第一次执行
  this.seriesIndex = 0; // 系列索引
  this.loopSeries = false;
  this.timeTicket = 0;
  this.seriesLength = option.series.length; // 系列个数
  this.dataLength = 0; // 某个系列数据个数
  this._init();
};
CommonAutoTip.prototype = {
  _init: function () {
    if (this.params) {
      this.loopSeries = this.params.loopSeries || this.isRefresh;
      this.seriesIndex = this.loopSeries ? 0 : (this.params.seriesIndex >= 0 ? this.params.seriesIndex : 0);
    }
    this._autoShowTip();
    // 鼠标在echarts图上时停止轮播
    this.chart.on('mousemove', () => {
      this._stopAutoShow
    });
    this.zRender.on('mousemove', () => {
      this._zRenderMouseMove
    });
    this.zRender.on('globalout', () => {
      this._zRenderGlobalOut
    });
  },
  _autoShowTip: function () {
    this._autoShowFn();
    this.timeTicket = setInterval(() => {
      this._autoShowFn();
    }, this.interval);
  },
  _autoShowFn: function () {
    const series = this.option.series;
    let refreshed = false;

    //判断是否更新数据
        if (this.params && this.params.isRefresh && this.dataIndex === 0) {
          this.params.refreshOption();
          this.chart.setOption(this.option);
          refreshed = true;
        }

    this.chartType = series[this.seriesIndex].type; // 系列类型
    this.dataLength = series[this.seriesIndex].data.length; // 某个系列的数据个数

    //第一次
    if (this.dataIndex < 0) {
      this.dataIndex = 0;
    }

    const tipParams = {seriesIndex: this.seriesIndex};
    switch (this.chartType) {
      case 'map':
      case 'pie':
      case 'chord':
        tipParams.name = series[this.seriesIndex].data[this.dataIndex].name;
        break;
      case 'radar': // 雷达图
        tipParams.seriesIndex = this.seriesIndex;
        tipParams.dataIndex = this.dataIndex;
        break;
      default:
        tipParams.dataIndex = this.dataIndex;
        break;
    }

    if (this.chartType === 'pie' || this.chartType === 'radar') {
      if (!refreshed) {
        // 取消之前高亮的图形
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: this.loopSeries ? (this.seriesIndex === 0 ? this.seriesLength - 1 : this.seriesIndex - 1) : this.seriesIndex,
          dataIndex: this.dataIndex === 0 ? this.dataLength - 1 : this.dataIndex - 1
        });
      }

      // 高亮当前图形
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: this.seriesIndex,
        dataIndex: this.dataIndex
      });
    }

    // 显示 tooltip
    tipParams.type = 'showTip';
    this.chart.dispatchAction(tipParams);

    this.dataIndex = (this.dataIndex + 1) % this.dataLength;
    if (this.loopSeries && this.dataIndex === 0) { // 数据索引归0表示当前系列数据已经循环完
      this.seriesIndex = (this.seriesIndex + 1) % this.seriesLength;
    }
    if (this.callback && typeof this.callback === 'function') {
      const obj = {
        index: tipParams.dataIndex,
        item: series[this.seriesIndex].data[tipParams.dataIndex]
      };
      this.callback(obj);
    }
  },
  _stopAutoShow: function () {
    if (!this.timeTicket) {
      return;
    }
    clearInterval(this.timeTicket);
    this.timeTicket = 0;

    if (this.chartType === 'pie' || this.chartType === 'radar') {
      // 取消高亮的图形
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: this.seriesIndex === 0 ? this.seriesLength - 1 : this.seriesIndex - 1,
        dataIndex: this.dataIndex === 0 ? this.dataLength - 1 : this.dataIndex - 1
      });
    }
  },
  _zRenderMouseMove: function (param) {
    if (param.event) {
      //阻止canvas上的鼠标移动事件冒泡
      param.event.cancelBubble = true;
    }
    this._stopAutoShow();
  },
  _zRenderGlobalOut() {
    !this.timeTicket && this._autoShowTip();
  },
  clearAutoShow: function () {
    clearInterval(this.timeTicket);
    this.chart.off('mousemove', () => {
      this._stopAutoShow
    });
    this.zRender.off('mousemove', () => {
      this._zRenderMouseMove
    });
    this.zRender.off('globalout', () => {
      this._zRenderGlobalOut
    });
  }
};

export const RadarAutoTip = function (target, option, interval, params) {
  this.config = {};
  this.config.target = target._dom;
  this.config.option = option;
  this.config.formatter = params.formatter || function (v) {
    var tag = v.name ? 'name' : 'text';
    return v[tag] + ':' + v.value;
  };
  this.interval = interval;
  this.autoOption = params;
  this.autoOption.intervalId = undefined;
  this._init(this.config);
  params.autoShow && (this._autoStart(this.config));
  /**hover相关设置*/
  params.hoverEnable && (this._enableHover(this.config));
};
RadarAutoTip.prototype = {
  _init: function (opt) {
    opt.hovering = false;
    opt.autoTipState = true;
    opt.center = {
      pointx: (opt.option.radar.center && Number(opt.option.radar.center[0].substr(0, opt.option.radar.center[0].length - 1)) / 100) || 0.5,
      pointy: (opt.option.radar.center && Number(opt.option.radar.center[1].substr(0, opt.option.radar.center[1].length - 1)) / 100) || 0.5
    };
    let x = opt.target.offsetWidth * opt.center.pointx,
      y = opt.target.offsetHeight * opt.center.pointy;
    opt.pointZero = {
      x: x,
      y: y
    };
    let indicator = opt.indicator = opt.option.radar.indicator,
      data = opt.option.series[0].data[0].value;
    indicator = indicator.map(function (t, index) {
      t.value = data[index];
      return t;
    });
    let length = indicator.length;
    opt.radius = opt.option.radar.radius;
    const  pointData = opt.pointData = [];
    let single = 2 * m.PI / length * (-1);
    for (let i = 0; i < length; i++) {
      let ratio = data[i] / indicator[i].max;
      pointData.push([opt.radius * m.sin(i * single) * ratio, opt.radius * m.cos(i * single) * ratio]);
    }
    this._createLabel();
  },
  /**
   * 辅助函数:
   *     获取鼠标在canvas画布上的位置(**不是浏览器窗口的鼠标位置)
   * clientX获取的相对浏览器窗口左上角的位置，适用于所有浏览器
   * 在chrome浏览器中，有一个zrX属性，是相对于元素本身的相对位置
   * getBoundingClientRect()函数是获取元素边框相对于浏览器窗口的位置
   * */
  _getMousePos: function (canvas, event) {
    const  rect = canvas && canvas.getBoundingClientRect();
    if (rect) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
    } else {
      return {
        x: event.clientX,
        y: event.clientY
      }
    }
  },
  /**自动轮播hoverLabel Dom 元素的生成*/
  _createLabel: function () {
    const label = document.createElement('div');
    label.setAttribute('class', 'hoverLabel');
    label.style.position = 'absolute';
    label.style.display = 'none';
    this.config.target.appendChild(label);
    this.config.hoverLabel = label;
  },
  /**动态设置单轴显示标签的样式和数据
   * @param：参数
   * @label：要动态修改的dom元素
   * @point：label元素相对于canvas画布的位置
   * @text：label元素要显示的值
   * @style：label元素文字的显示样式
   * */
  _hoverLabel: function (label, point, text, style) {
    let cssText = "position: absolute; display: inline-block; top: " + (point.y - 37) + "px; left:" + point.x + "px; border:" + style.border + "; font-variant: normal;" +
      "font-stretch: normal; font:normal 14px; line-height: normal  '微软雅黑'; box-sizing: border-box; padding: 5px 10px;" +
      " color:" + style.color + "; border-radius: 4px; background-color:" + style.backgroundColor + "; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1);" +
      " transform: translate(-50%, 0px); z-index: 999;";
    label.innerHTML = text;
    label.style.cssText = cssText;
    const triangle = document.createElement('label');
    cssText = "width: 0px; height: 0px; position: absolute; left: 50%; top: 99%; margin-left: -5px;" +
      " border-left: 5px solid transparent; border-right: 5px solid transparent;" +
      " border-top: 5px solid " + style.backgroundColor + ";";
    triangle.style.cssText = cssText;
    label.appendChild(triangle);
  },
  _removeLabel: function (dom) {
    dom.style.display = 'none';
  },
  /**手动开启自动轮播*/
  _autoStart: function () {
    let step = -1,
      length = this.config.indicator.length;
    const that = this;
    this.autoOption.intervalId = setInterval(function () {
      step = (step + 1) % length;
      let negStep = length-1-step;
      const showPoint = {
        x: that.config.pointData[negStep][0] + that.config.pointZero.x,
        y: that.config.pointZero.y - that.config.pointData[negStep][1]
      };
      let tag = that.config.indicator[negStep],
        text = that.config.formatter(tag);   //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
      that.config.autoTipState && (!that.config.hovering) && that._hoverLabel(that.config.hoverLabel, showPoint, text, style);
    }, this.interval || 2000)
  },
  _enableHover:function (opt) {
    const that = this;
    opt.target.addEventListener('mousemove', function (event) {
      const canvas = opt.target.querySelector('canvas'),
        mouse = that._getMousePos(canvas, event),
        point = {},
        r = 5;
      let index = -1; //hover 捕捉的精度
      point.x = mouse.x - opt.pointZero.x;
      point.y = opt.pointZero.y - mouse.y;
      for (let i = 0; i < opt.pointData.length; i++) {
        const item = opt.pointData[i];
        if (point.x > (item[0] - r) && point.x < (item[0] + r) && point.y > (item[1] - r) && point.y < (item[1] + r)) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        let text = opt.formatter(opt.indicator[index]);    //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
        opt.hovering = true;
        that._hoverLabel(opt.hoverLabel, mouse, text, style);
      } else {
        opt.hovering = false;
        that._removeLabel(opt.hoverLabel);
      }
    })
  },
  clearAutoShow: function () {
    this.config.hovering = false;
    this.config.autoTipState = true;
    if (this.config.target.getElementsByClassName('hoverLabel').length) {  //图表刷新重置时
      this.config.target.removeChild(this.config.target.getElementsByClassName('hoverLabel')[0]);
    }
    this.autoOption.intervalId && clearInterval(this.autoOption.intervalId);
  },
  /**停止自动轮播*/
  stop: function () {
    this.config.autoTipState = false;
  },
  /**开启自动轮播*/
  start: function () {
    /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
    this.config.autoTipState = true;
  }
};
export const strongText=(option,info)=> {
 info = info||{
    name:'全年其他收入',
    value:0,
    unit:'万元'
  };
  option.title.text = '{a|'+info.name+':}'+'{b|'+addSeparator( info.value )+'}'+'{c|'+info.unit+'}';
  option.title.textStyle = {
    rich: {
      a: {
        color: '#8bb8e8',
        fontSize: 14,
        fontWeight: 'bold'
      },
      b: {
        color: '#ffcf2a',
        fontSize: 16,
        fontWeight: 'bold'
      },
      c: {
        color: '#8bb8e8',
        fontSize: 14,
        fontWeight: 'bold'
      }
    }
  }
}

