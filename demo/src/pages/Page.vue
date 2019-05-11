<!--
Links
  Data: https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function
  Form Input Bindings: https://vuejs.org/v2/guide/forms.html#Basic-Usage
  Watchers: https://vuejs.org/v2/guide/computed.html#Watchers
Src
  https://github.com/CorpGlory/d3vue/blob/master/src/d3-components/size-controller.vue
-->

<template>
  <div>
    <svg width="500" height="300"></svg>
    <br>
    <q-slider
      v-model="circleSize"
      :min="1"
      :max="100"
      :step="1"
    ></q-slider>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      circleSize: 50
    }
  },
  mounted: function (createElement) {
    var svg = this.$d3.select(this.$el).select('svg')
    this.circle = svg
      .append('circle')
      .attr('cx', '250')
      .attr('cy', '150')
      .attr('r', this.circleSize)
  },
  watch: {
    circleSize: function (newValue) {
      this.circle
        .attr('r', newValue)
    }
  }
}
</script>
