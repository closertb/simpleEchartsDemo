<template>
  <div id="app" class="frame-block">
    <div class="module-position">
      <favor-city></favor-city>
    </div>
    <div class="module-position pos-0-1">
      <map-chart></map-chart>
    </div>
    <div class="module-position pos-0-3">
      <favor-scenic></favor-scenic>
    </div>
    <div class="module-position pos-1-3">
      <symbol-chart></symbol-chart>
    </div>
    <div class="module-position pos-1-0">
      <pie-distribution></pie-distribution>
    </div>
    <div class="module-position pos-2-0">
      <high-opinion></high-opinion>
    </div>
    <div class="module-position pos-2-1">
      <scroll-list></scroll-list>
    </div>
    <div class="module-position pos-2-2">
      <resume-transfer></resume-transfer>
    </div>
<!--    <div class="module-position pos-2-1">
      <skill-chart></skill-chart>
    </div>-->
    <div class="module-position pos-2-3">
      <sport-opinion></sport-opinion>
    </div>
  </div>

</template>

<script>
import favorCity from './wibgets/favorCity.vue'
import favorScenic from './wibgets/favorScenic.vue'
import favorSceni from './wibgets/favorScenicP.vue'
import highOpinion from './wibgets/highOpinion.vue'
import pieDistribution from './wibgets/pieDistribution.vue'
import mapChart from './wibgets/mapChart.vue'
import scrollList from './wibgets/scrollList.vue'
import symbolChart from './wibgets/symbolChart.vue'
import skillChart from './wibgets/skillChart.vue'
import sportOpinion from './wibgets/sportsOpinion.vue'
import resumeTransfer from './wibgets/resumeTransfer.vue'

export default {
  name: 'app',
  components:{
    'favor-city':favorCity,
    'favor-scenic':favorScenic,
    'high-opinion':highOpinion,
    'pie-distribution':pieDistribution,
    'map-chart':mapChart,
    'scroll-list':scrollList,
    'symbol-chart':symbolChart,
    'skill-chart':skillChart,
    'sport-opinion':sportOpinion,
    'resume-transfer':resumeTransfer,
    'favor-sceni':favorSceni,
  },
  mounted:function () {
  }
}
</script>

<style lang="scss" rel="stylesheet" type="text/scss">


</style>
