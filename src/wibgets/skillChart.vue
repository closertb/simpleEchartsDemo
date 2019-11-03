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
    const sportData =[{cnName:'得分',allTotal:25,total:18.3},
      {cnName:'篮板',allTotal:12,total:5.4},
      {cnName:'助攻',allTotal:12,total:8.3},
      {cnName:'抢断',allTotal:6,total:2.2},
      {cnName:'失误',allTotal:5,total:2.3},
      {cnName:'盖帽',allTotal:3,total:0.8}
    ],skillData =[{cnName:'JS',allTotal:100,total:85},
      {cnName:'CSS',allTotal:100,total:75},
      {cnName:'React',allTotal:100,total:55},
      {cnName:'jQuery',allTotal:100,total:85},
      {cnName:'Vue',allTotal:100,total:72},
      {cnName:'HTML',allTotal:100,total:80}
    ];
    this.drawRadar(sportData,skillData);
  },
  data () {
    return {
      singleId:'radar'+Math.ceil(Math.random()*10000),
      msg: 'small model',
      information:{
        name:'个人能力分析'
      }
    }
  },
  methods:{
    drawRadar:function (sportData,skillData) {
      var target = document.getElementById(this.singleId).querySelector('#highOpinionChart');
      var maxRaduis = (((target.clientWidth/2<target.clientHeight)?target.clientWidth/2:target.clientHeight)-100)/2;
      var option= {
        tooltip: {
          show:false
        },
        radar: [{
          shape: 'circle',
          splitNumber: 4,
          radius:maxRaduis,
          center:['25%','50%'],
          axisLine: {
            lineStyle: {
              color: '#a1c2ff',
              opacity:.5
            }
          },
          splitLine: {
            lineStyle: {
              color: '#a1c2ff',
              opacity:.5
            }
          },
          splitArea:{
            areaStyle:{
              opacity:0
            }
          },
          indicator: [
          ],
          name: {
              formatter:function (val) {
                return val/10;
              },
              textStyle: {
                color:'#c6dff1',
                fontSize:14
              }
          }
          },{
          shape: 'circle',
          splitNumber: 4,
          radius:maxRaduis,
          center:['75%','50%'],
          axisLine: {
            lineStyle: {
              color: '#a1c2ff',
              opacity:.5
            }
          },
          splitLine: {
            lineStyle: {
              color: '#a1c2ff',
              opacity:.5
            }
          },
          splitArea:{
            areaStyle:{
              opacity:0
            }
          },
          indicator: [
          ],
          name: {
            formatter:function (val) {
              return val;
            },
            textStyle: {
              color:'#c6dff1',
              fontSize:14
            }
          }
        }],
        series: [{
          name: '指数',
          type: 'radar',
          data : [
            {
              value : [40, 70, 50, 70, 42,90,72,90],
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
        },{
          radarIndex: 1,
          type: 'radar',
          data : [
            {
              value : [40, 70, 50, 70, 42,90,72,90],
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
      convertRadarData(skillData,option,0);
      convertRadarData(sportData,option,1);
      myChart.setOption(option);
/*      this.$echarts.AutoShowTip(myChart,option,3000,{
        hoverEnable:true,
        autoShow:true
      });*/
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
.out-frame{
  position: relative;
  width:950px;
}
</style>
