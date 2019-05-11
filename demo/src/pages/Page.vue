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
  data () {
    return {
      circleSize: 50
    }
  },

  mounted (createElement) {
    var outerRadius = 700 / 2,
      innerRadius = outerRadius - 150

    var fill = this.$d3.scaleOrdinal(this.$d3.schemeCategory10)

    var chord = this.$d3.chord()
      .padAngle(0.04)
      .sortSubgroups(this.$d3.descending)
      .sortChords(this.$d3.descending)

    var arc = this.$d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + 20)

    var svg = this.$d3.select(this.$el).select('svg')
      .attr('width', outerRadius * 2)
      .attr('height', outerRadius * 2)
      .append('g')
      .attr('transform', 'translate(' + outerRadius + ',' + outerRadius + ')')

    this.$d3.json('quasar-api.json').then((components) => {
      let imports = this.components = Object.entries(components).map(entry => {
        return {
          name: entry[0],
          ...entry[1]
        }
      }).filter(comp => {
        if (comp.related.length) {
          return true
        }
        for (let otherCompName in components) {
          const otherComp = components[otherCompName]
          if (otherComp.related.includes(comp.name)) {
            return true
          }
        }
        return false
      })

      var indexByName = this.$d3.map(),
        nameByIndex = this.$d3.map(),
        matrix = [],
        n = 0

      // Returns the Flare package name for the given class name.
      function name (name) {
        return name
      }

      // Compute a unique index for each package name.
      imports.forEach(d => {
        if (!indexByName.has(d = name(d.name))) {
          nameByIndex.set(n, d)
          indexByName.set(d, n++)
        }
      })

      // Construct a square matrix counting package imports.
      imports.forEach(d => {
        var source = indexByName.get(name(d.name)),
          row = matrix[source]
        if (!row) {
          row = matrix[source] = []
          for (var i = -1; ++i < n;) row[i] = 0
        }
        d.related.forEach(d => row[indexByName.get(name(d))]++)
      })

      chord = chord(matrix)

      var g = svg.selectAll('.group')
        .data(chord.groups)
        .enter().append('g')
        .attr('class', 'group')

      g.append('path')
        .style('fill', d => fill(d.index))
        .style('stroke', d => fill(d.index))
        .attr('d', arc)

      g.append('text')
        .each(d => {
          d.angle = (d.startAngle + d.endAngle) / 2
        })
        .attr('dy', '.35em')
        .attr('transform', d => {
          return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' +
            'translate(' + (innerRadius + 26) + ')' +
            (d.angle > Math.PI ? 'rotate(180)' : '')
        })
        .style('text-anchor', d => d.angle > Math.PI ? 'end' : null)
        .text(d => nameByIndex.get(d.index))

      svg.selectAll('.chord')
        .data(chord)
        .enter().append('path')
        .attr('class', 'chord')
        .style('stroke', d => this.$d3.rgb(fill(d.source.index)).darker())
        .style('fill', d => fill(d.source.index))
        .attr('d', this.$d3.ribbon().radius(innerRadius))
    })
  },

  watch: {
    circleSize (newValue) {
      this.circle
        .attr('r', newValue)
    }
  }
}
</script>
