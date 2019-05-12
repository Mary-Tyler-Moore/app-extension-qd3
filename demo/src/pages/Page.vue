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
    <div class="q-pa-md">
      <q-input
        v-model="filter"
        square
        placeholder="Search"
        debounce="500"
      />
    </div>
    <svg width="500" height="300"></svg>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filter: '',
      components: []
    }
  },

  methods: {
    // Returns the Flare package name for the given class name.
    name: name => name
  },

  computed: {
    filteredComponents () {
      if (this.filter) {
        let filter = this.filter.toLowerCase(),
          include = []

        this.components.forEach(c => {
          if (c.name.toLowerCase().includes(filter) || c.group.toLowerCase().includes(filter)) {
            include = include.concat(c.related)
            include.push(c.name)
          }
        })

        return this.components.filter(c => include.includes(c.name))
      }
      return this.components
    },

    indexByName () {
      let indexByName = this.$d3.map(),
        n = 0
      // Compute a unique index for each package name.
      this.filteredComponents.forEach(d => {
        if (!indexByName.has(d = this.name(d.name))) {
          indexByName.set(d, n++)
        }
      })

      return indexByName
    },

    nameByIndex () {
      let nameByIndex = this.$d3.map(),
        n = 0
      // Compute a unique index for each package name.
      this.filteredComponents.forEach(d => {
        nameByIndex.set(n++, this.name(d.name))
      })

      return nameByIndex
    },

    matrix () {
      const matrix = [],
        n = Object.keys(this.indexByName).length

      // Construct a square matrix counting package imports.
      this.filteredComponents.forEach(d => {
        var source = this.indexByName.get(this.name(d.name)),
          row = matrix[source]
        if (!row) {
          row = matrix[source] = []
          for (var i = -1; ++i < n;) row[i] = 0
        }

        d.related.forEach(d => {
          row[this.indexByName.get(this.name(d))]++
        })
      })

      return matrix
    }
  },

  created (createElement) {
    this.components = require('../statics/quasar-api.json')
  },

  watch: {
    matrix (matrix) {
      let child
      (child = this.$el.querySelector('svg').children[0]) && child.remove()

      const outerRadius = 700 / 2,
        innerRadius = outerRadius - 150,
        fill = this.$d3.scaleOrdinal(this.$d3.schemeCategory10)

      const chord = this.$d3.chord()
        .padAngle(0.04)
        .sortSubgroups(this.$d3.descending)
        .sortChords(this.$d3.descending)(matrix)

      const arc = this.$d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius + 20)

      const svg = this.$d3.select(this.$el).select('svg')
        .attr('width', outerRadius * 2)
        .attr('height', outerRadius * 2)
        .append('g')
        .attr('transform', 'translate(' + outerRadius + ',' + outerRadius + ')')

      const g = svg.selectAll('.group')
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
        .text(d => this.nameByIndex.get(d.index))

      svg.selectAll('.chord')
        .data(chord)
        .enter().append('path')
        .attr('class', 'chord')
        .style('stroke', d => this.$d3.rgb(fill(d.source.index)).darker())
        .style('fill', d => fill(d.source.index))
        .attr('d', this.$d3.ribbon().radius(innerRadius))
    }
  }
}
</script>
