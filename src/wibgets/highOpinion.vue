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
    const datas =[{cnName:'JS',allTotal:100,total:85},
      {cnName:'CSS',allTotal:100,total:75},
      {cnName:'React',allTotal:100,total:55},
      {cnName:'jQuery',allTotal:100,total:85},
      {cnName:'Vue',allTotal:100,total:72},
      {cnName:'HTML',allTotal:100,total:80}
    ];
      this.drawRadar(datas);
  },
  data () {
    return {
      singleId:'radar'+Math.ceil(Math.random()*10000),
      msg: 'small model',
      information:{
        name:'个人专业技能分析'
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
              return val/10;
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
                  opacity: 0.4,
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
          return '<div>'+v[tag] + ':' +'<span style="color:#ffbf00;font-weight: bold;font-size:16px;padding: 0 5px;">'+(v.value/10).toFixed(1)+'</span></div>';
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
