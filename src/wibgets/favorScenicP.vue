<template>
  <div class="out-frame" :id="singleId">
    <frame-header :info="information"></frame-header>
    <!--定义标题边框，并预留内容边框-->
    <div class="model-content">
      <div class="analyse-chart" id="trendAnalyseChart"></div>
    </div>
  </div>
</template>

<script>
  import {addSeparator} from '../js/tools';
  import {themeColor} from '../theme/base';
  export default {
    name: 'favorScenic',
    mounted() {
      const datas = [{name: "大学生", value: [30260, 35578, 41424, 44256, 45826]},
        {name: "大专生", value: [34560, 38870, 46580, 43560, 43006]},
        {name: "高中及以下", value: [60000, 59850, 44380, 39380, 34734]},
        {name: "硕士及以上", value: [16005, 27034, 35480, 38560, 41733]}];
      this.initChart(datas);
    },
    data() {
      return {
        singleId: 'radar' + Math.ceil(Math.random() * 10000),
        msg: 'small model',
        information: {
          name: '应聘人员趋势数据分析',
          link: 'http:localhost:8080',
          dataSource: '家里蹲大学'
        }
      }
    },
    methods: {
      initChart: function (data) {
        const target = document.getElementById(this.singleId).querySelector('#trendAnalyseChart'),
        option = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: 15,
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                  color: '#7fa3ca'
                },
                shadowStyle: {
                  color: 'rgba(14,82,124,.5)'   //rgba(14,82,124,.5)
                }
              },

              formatter: function (param) {
                var res = '<div><h3 style="color:#d3edff;text-align: center;">' + param[0].name + '</h3>';
                if (param) {
                  for (var i = 0; i < param.length; i++) {
                    res += '<div style="padding: 3px 0;color:#8bb8e8;text-align: left;">' + param[i].seriesName + ':<span style="color:#ffbf00;font-weight: bold;font-size:14px;padding: 0 5px;" >' + addSeparator(param[i].value) + '</span></div>';
                  }
                  res += '</div>';
                  return res;
                }
              }
            },
            legend: {
              data: ['高中及以下', '大专生', '大学生', '硕士及以上'],
              top: 15,
              left: 'center',
              textStyle: {
                color: '#7fa3ca'
              },
            },
            grid: {
              top: 70,
              left: 20,
              right: 20,
              bottom: 20,
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: ['2013年', '2014年', '2015年', '2016年', '2017年'],
                axisLine: {
                  lineStyle: {
                    color: '#28495e'
                  }
                },
                axisLabel: {
                  textStyle: {
                    color:  'white',
                    fontFamily: 'microsoft yahei',
                    fontSize: 14
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '单位：人',
                min:10000,
                nameTextStyle: {
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'microsoft yahei'
                },
                axisLine: {
                  lineStyle: {
                    color: '#28495e'
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: 'white',
                    fontFamily: 'Arial',
                    fontSize: 14
                  },
                  formatter: function (value) {
                    if (value.toFixed(1).split('.')[1] != 0) {
                      return '';
                    } else {
                      return parseInt(value);
                    }
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: '#28495e'
                  }
                }
              },
              {
                axisLabel: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    width: 1,
                    color: '#28495e'
                  }
                },
                splitLine: {
                  show: false
                }
              }
            ],
            series: []
          },
        color = ["#5b67ff", "#00d596", "#00bbf0", "#89cb15"],
        myChart = this.$echarts.init(target);
        data.forEach(function (item, i) {
          option.series.push(
            {
              name: item.name,
              type: 'line',
              smooth: true,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: color[i]
                }
              },
              areaStyle: {
                normal: {
                  color: 'rgba(14,82,124,0)'
                },
                emphasis: {
                  color: 'rgba(14,82,124,.5)'
                }
              },
              data: item.value
            }
          );
        });
        myChart.setOption(option);
        this.$echarts.AutoShowTip(myChart, option, 2000);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  $bgColor: '#013bba';
  $singleColor: '#1f5fd3';
  $triangleColor: '#003596';

  h1, h2,h3 {
    font-weight: normal;
    padding:0;
    margin:0;
  }

  ul, li {
    list-style-type: none;
    padding: 0;
  }

</style>
