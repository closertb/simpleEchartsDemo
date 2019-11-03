<template>
  <div class="out-frame" :id="singleId">
    <frame-header :info="information"></frame-header>
    <!--定义标题边框，并预留内容边框-->
    <div class="model-content">
      <div class="analyse-chart" id="highOpinionChart"></div>
    </div>
  </div>
</template>

<script>
import {convertRadarData,RadarAutoTip} from '../js/tools'
export default {
  name: 'favorCity',
  mounted(){
    const datas =[{cnName:'得分',allTotal:25,total:18.3},
      {cnName:'篮板',allTotal:12,total:5.4},
      {cnName:'助攻',allTotal:12,total:8.3},
      {cnName:'抢断',allTotal:6,total:2.2},
      {cnName:'失误',allTotal:5,total:2.3},
      {cnName:'盖帽',allTotal:3,total:0.8}
    ];
      this.drawRadar(datas);
  },
  data () {
    return {
      singleId:'radar'+Math.ceil(Math.random()*10000),
      msg: 'small model',
      information:{
        name:'个人篮球能力分析'
      }
    }
  },
  methods:{
    drawRadar:function (data) {
      var target = document.getElementById(this.singleId).querySelector('#highOpinionChart');
      var maxRaduis = (((target.offsetWidth<target.offsetHeight)?target.offsetWidth:target.offsetHeight)-100)/2;
      var option= {
        tooltip: {
          show:false
        },
        radar: {
          shape: 'circle',
          splitNumber: 4,
          radius:maxRaduis,
          axisLine: {
            lineStyle: {
              color: '#003366',
              opacity:1
            }
          },
          splitLine: {
            lineStyle: {
              color: '#003366',
              opacity:1
            }
          },
          splitArea:{
            areaStyle:{
              opacity:0
            }
          },
          indicator: [],
          name: {
            formatter:function (val) {
              return val;
            },
            textStyle: {
              color:'#c6dff1',
              fontSize:14
            }
          }
        },
        series: [{
          name: '指数',
          type: 'radar',
          data : [
            {
              value : [],
              name : '指数',
              itemStyle:{
                normal:{
                  borderColor:'#ff5757',
                  opacity:1,
                  borderWidth:2,
                  borderType:'solid'
                }},
              lineStyle:{
                normal:{
                  color:'#ff5757',
                  type:'solid',
                  width:2
                }},
              areaStyle: {
                normal: {
                  opacity: 0.5,
                  color:'#ff5757'
                }
              }
            }
          ]
        }]
      };
      var myChart = this.$echarts.init(target);
      convertRadarData(data,option);
      myChart.setOption(option);
      this.$echarts.AutoShowTip(myChart,option,3000,{
        hoverEnable:true,
        autoShow:true,
        formatter:function (v) {
          var tag = v.name ? 'name' : 'text';
          return '<div>'+v[tag] + ':' +'<span style="color:#ffbf00;font-weight: bold;font-size:16px;padding: 0 5px;">'+v.value+'</span></div>';
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
$bgColor: '#013bba';
$singleColor:'#1f5fd3';
$triangleColor:'#003596';

h1, h2 {
  font-weight: normal;
}

ul,li {
  list-style-type: none;
  padding: 0;
}

</style>
