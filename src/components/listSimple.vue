<!--
* Title:填充柱滚动列表
* @author Mr Denzel
* @create Date 2018-2-26 09:19
* @version 1.0
* Description:
-->
<template>
  <!--定义标题边框，并预留内容边框-->

  <div ref ="mountPoint"  class="simple-list-module" :class="{ 'small-height':config.appendClass }">
    <div class="simple-list-unit" v-if="bindData.unit">
      单位：{{ bindData.unit }}
    </div>
    <div v-if="isReady" class="simple-list-shadow" :style="{ height:config.moduleHeight+'px' }">
      <ul class="simple-list-body">
        <li v-for="(item , index) in config.data">
          <div class="simple-list-info" :style="{ margin:config.marginStyle }"  v-if="item.isEnable">
            <span class="fl">{{ item.name }}</span>
            <span class="fr">{{ item.formatNum }}</span>
          </div>
          <div class="simple-list-rank"  v-if="item.isEnable">
            <i class="rank-num" :style="{ color: ++index > 3 ? config.rankColor:config.highRankColor }">No.{{ index>9? index : '0'+index }}</i>
            <div class="progress-bar">
              <transition name="slide-fade">
                <span class="progress-percent"  v-if="startAnimate" v-bind:style="{width:item.formatPer}"></span>    <!--v-bind:style="{width:item.percent}"-->
              </transition>
            </div>
          </div>
          <div v-if="!item.isEnable" v-bind:style="{height:config.lineHeight+'px'}" class="list-empty"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'scrollList',
    props: ['scrollData','configParams'],
    data() {
        return {
          isReady:false,
          startAnimate:false,
          bindData:{
          }
        }
    },
    created(){
      const defaultOption={
        size:'normal',
        intervalTime: 5000,
        rankColor:'#3e98ff',
        highRankColor:'#9364ff',
        fillColor:'background-image: linear-gradient(to right,#1f88ff,#a664ff)',  //css 语句
      };
      this.configParams && Object.keys(this.configParams).map(t=>{
        if(defaultOption.hasOwnProperty(t)&&this.configParams[t]){
          defaultOption[t] = this.configParams[t];
        }
      });
      this.bindData.unit =this.scrollData.unit || false;
        this.config = {
        appendClass:    false,
        unit:           this.scrollData.unit,
        data:           this.scrollData.blocks,
        headHeight :    59,
        moduleHeight:   0,
        lineHeight:     52,
        maxLineHeight:  55,
        minLineHeight:  48,
        contentHeight:  40,
        marginTop:      10,
        size:           defaultOption.size,
        intervalTime:   defaultOption.intervalTime,
        rankColor:      defaultOption.rankColor,
        highRankColor:  defaultOption.highRankColor,
        fillColor:      defaultOption.fillColor
      };
    },
    mounted(){
      this.config.height = this.$refs.mountPoint.clientHeight;
      this.config.width = this.$refs.mountPoint.clientWidth;
      this.init();
    },
    methods:{
      init: function () {
        const config = this.config ;
        let parameter;
        config.appendClass = false;
        if(config.size==='mini'|| config.height<=220){
          config.appendClass =true;
          config.headHeight = 53;    //33的padding 20的单位高度
          config.lineHeight = 43;
          config.maxLineHeight = 43;
          config.minLineHeight = 40;
          config.contentHeight = 36;
          config.marginTop = 5;
          config.baseLength =4;
        }
        this.appendClass && (config.headHeight = 33);
        parameter = this._getLineHeight(config.lineHeight);
        config.scrollLength =this._initData(parameter.length); //parameter.length>config.data.length ? config.data.length : parameter.length;
        config.lineHeight = parameter.lineHeight;
        config.moduleHeight = config.scrollLength * config.lineHeight;
        config.marginStyle = this._calMargin(config.lineHeight-config.contentHeight);
        this.updateDom();
      },
      _calMargin:function (height) {
        let str = '';
        const config = this.config ;
        config.marginTop = height>config.marginTop ? config.marginTop : height;
        str =str + Math.round(config.marginTop)+'px 0 '+ Math.round(height-config.marginTop)+'px';
        return str;
      },
      /**
       * 递归找出一个最适合的高度值
       * */
      _getLineHeight:function (lineHeight) {
        const config = this.config;
        let length,moduleHeight = config.height - config.headHeight;
        length = moduleHeight/lineHeight;
        if((moduleHeight-Math.floor(length)*lineHeight)>5){   //递归寻找最好的高度和长度
          length =Math.ceil(length);
          lineHeight = moduleHeight/length;
          if(lineHeight>config.minLineHeight){
            this._getLineHeight(lineHeight);
          }else{   //正对于显示区域很高的情况时，直接使用最大行高
            lineHeight = config.maxLineHeight;
            length = Math.floor(moduleHeight/lineHeight);
          }
        }
        return {
          lineHeight:+lineHeight.toFixed(2),
          length:length
        }
      },
      _initData:function (length) {
        const config = this.config , data = config.data ;
        if(length>data.length){
          length = data.length;
        }
        this.config.data = data.map(function (t) {
          var num = t.percent + '';
          t.isEnable = true;
          if(num.indexOf('%')>0){  //如果传递过来的数据带百分比；
            num = t.percent.substr(0,num.length-1)-0;
          }
          if(num<0 || num >100){
            num = Math.abs(num%100);
          }
          t.formatNum = t.limit.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + ',');
          t.formatPer = num + '%';
          return t;
        });
        if(data.length%length !==0){
          let temp = data.length/length;
          for(let i=data.length;i<Math.ceil(temp)*length;i++){
            this.config.data.push({isEnable:false});
          }
        }
        return length
      },
      _autoScroll: function () {
        var _this = this.config,num = _this.scrollLength,scrollHeight =Math.round(_this.lineHeight*_this.scrollLength);
        var $self = _this.$target;
        if(_this.data.length <=_this.scrollLength ){  //列表过短，就不需要滚动了
          return ;
        }
        _this.intervalId&&clearInterval(_this.intervalId);
        const setAutoScroll=()=> {
            _this.intervalId = setInterval(()=>{
            this.myTween(0,scrollHeight,1000,(val)=>{
              $self.style.transform = 'translateY('+(0-val)+'px)';
            },()=>{
              for(let i=0;i<num;i++){
                $self.appendChild($self.childNodes[0]);
              }
              $self.style.transform = 'translateY(0)';
            });

          }, _this.intervalTime);}

          setAutoScroll();
          function hover(ele,over,out){
            ele.addEventListener('mouseover',over,false);
            ele.addEventListener('mouseout',out,false);
          }

        hover($self,function(){
          (_this.intervalId !== undefined) && clearInterval(_this.intervalId);
          },function(){
          setAutoScroll();
        });
      },
      /**
       * 功能：缓动动画
       * @params start    加载其实位置
       * @params end      加载终点位置
       * @params length   动画加载时间
       * @params tweenFun 更新回调函数
       * */
      myTween:function(start,end,length,tweenFun,callback) {
        var arr = [],count=0,arrLength = 50*length/1000,step = (end-start)/arrLength;
        for (var i=0;i<=arrLength;i++){
          arr.push(start+step*i);
        }
        animate();
        function animate() {
          if(count>arrLength){
            callback&&callback();
            return ;
          }
          tweenFun(arr[count]);
          count++;
          requestAnimationFrame(animate);
        }
      },
      updateDom:function () {
        this.isReady = true;
        setTimeout(()=>{
          this.config.$target = this.$el.lastChild.children[0] ;
          this.startAnimate = true;
        })
        setTimeout(()=>{
          this._autoScroll();
        },3000)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  body, ul, li, div, td, h4 {
    padding: 0;
    margin: 0;
  }

  ul, li {
    list-style: none;
  }

  $titColor: $lightBluefontColor;
  $fonColor: $defautFontColor;
  $fonPercent: $orangefontColor;
  $borColor: $segmentLine;
  $oddBg: $moduleBgColor;
  $evenBg: $auxiliaryColor01;
  $percentBg: $auxiliaryColor02;
  $moduleBg: $moduleBgColor;

  .simple-list-module {
    position: relative;
    box-sizing: border-box;
    padding: 15px 20px 18px;
    height: 100%;
    .simple-list-unit {
      font: normal 14px/24px 'Microsoft YaHei';
      text-align: left;
      color: $fonColor;
    }
    .simple-list-shadow {
      position: relative;
      z-index: 7;
      overflow: hidden;
    }
    &.small-height {
      .simple-list-unit {
        font: normal 14px/20px 'Microsoft YaHei';
      }
      .simple-list-body {
        .simple-list-info {
          margin: 5px 0 0;
          height: 18px;
        }
        .simple-list-rank {
          height: 18px;
        }
      }
    }
  }

  .simple-list-body {
    width: 100%;
    font: normal 14px/20px 'Microsoft YaHei';
    color: $fonColor;
    z-index: 6;
    overflow: hidden;
    li {
      box-sizing: border-box;
      //  padding: 10px 0 0;
    }
    .simple-list-info {
      margin: 10px 0 0;
      height: 20px;
      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
    }

    .simple-list-rank {
      position: relative;
      height: 20px;
      .rank-num {
        position: absolute;
        left: 0;
        color: #3e98ff;
        &.high-rank {
          color: #9364ff;
        }
      }
      .progress-bar {
        position: absolute;
        left: 50px;
        top: 5px;
        right: 0;
        height: 9px;
        border-radius: 4px;
        background-color: $percentBg;
      }
    }
  }
  /*柱状条填充样式*/
  .simple-list-body {
    .progress-percent {
      display: block;
      position: relative;
      z-index: 5;
      border-radius: 4px;
      height: 9px;
      transition: width 8s ease;
      background-image: linear-gradient(to right, #1f88ff, #a664ff);
    }
    .slide-fade-enter-active {
      transition: width 1s ease-out;
    }
    .slide-fade-enter{
      width: 0 !important;
    }
  }

</style>
