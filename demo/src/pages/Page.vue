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
import { colors } from 'quasar'
const { lighten, textToRgb, rgbToHsv, hsvToRgb } = colors // lighten,

/**
 * Saturate or desaturate a hex color
 *
 * @param color
 * @param percent
 * @returns {string} - e.g. #ffffff
 */
const saturate = function (color, percent) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string as color')
  }
  if (typeof percent !== 'number') {
    throw new TypeError('Expected a numeric percent')
  }

  let rgb = textToRgb(color)
  // t = percent < 0 ? 0 : 255,
  // p = Math.abs(percent) / 100,

  const hsv = rgbToHsv(rgb)
  hsv[1] *= percent
  rgb = hsvToRgb(hsv)

  const R = rgb.r,
    G = rgb.g,
    B = rgb.b,
    text = '#' + (
      0x1000000 + R * 0x10000 + G * 0x100 + B
    ).toString(16).slice(1)
  console.log(color, text)
  return text
}

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
        fill = this.$d3.scaleOrdinal().range(['#1b70fc', '#faff16', '#d50527', '#158940', '#f898fd', '#24c9d7', '#cb9b64', '#866888', '#22e67a', '#e509ae', '#9dabfa', '#437e8a', '#b21bff', '#ff7b91', '#94aa05', '#ac5906', '#82a68d', '#fe6616', '#7a7352', '#f9bc0f', '#b65d66', '#07a2e6', '#c091ae', '#8674d2', '#8a91a7', '#88fc07', '#ea42fe', '#9e8010', '#10b437', '#c281fe', '#f92b75', '#07c99d', '#a946aa', '#bfd544', '#16977e', '#ff6ac8', '#a88178', '#5776a9', '#678007', '#fa9316', '#85c070', '#6aa2a9', '#989e5d', '#fe9169', '#cd714a', '#6ed014', '#c5639c', '#c23271', '#698ffc', '#678275', '#c5a121', '#a978ba', '#ee534e', '#d24506', '#59c3fa', '#ca7b0a', '#6f7385', '#9a634a', '#48aa6f', '#ad9ad0', '#d7908c', '#6a8a53', '#8c46fc', '#8f5ab8', '#fd1105', '#7ea7cf', '#d77cd1', '#a9804b', '#0688b4', '#6a9f3e', '#ee8fba', '#a67389', '#9e8cfe', '#bd443c', '#6d63ff', '#d110d5', '#798cc3', '#df5f83', '#b1b853', '#bb59d8', '#1d960c', '#867ba8', '#18acc9', '#25b3a7', '#f3db1d', '#938c6d', '#936a24', '#a964fb', '#92e460', '#a05787', '#9c87a0', '#20c773', '#8b696d', '#78762d', '#638ba8', '#e154c6', '#40835f', '#d73656', '#1afd5c', '#c4f546', '#3d88d8', '#bd3896', '#1397a3', '#f940a5', '#66aeff', '#d097e7', '#fe6ef9', '#d86507', '#8b900a', '#d47270', '#e8ac48', '#cf7c97', '#cebb11', '#718a90', '#e78139', '#ff7463', '#bea1fd', '#f81d47', '#72b93c', '#7ba66a', '#656dc4', '#3a8278', '#66988b', '#a384d5', '#b35a3b', '#e07cfd', '#27cf4c', '#b224d4', '#b39579', '#b68f38', '#e51188', '#938747', '#5eb195', '#bba85b', '#f39f5a', '#9961a0', '#bd60b6', '#14a147', '#db8c67', '#9bc52e', '#96a0cd', '#7b68ac', '#039762', '#cf15fd', '#d1583d', '#b77163'])
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

      let colorProcessingPercentages = {}

      svg.selectAll('.chord')
        .data(chord)
        .enter().append('path')
        .attr('class', 'chord')
        .style('stroke', d => this.$d3.rgb(fill(d.source.index)).darker())
        .style('fill', d => {
          let index = d.source.index
          let percentage = (colorProcessingPercentages[index] ? colorProcessingPercentages[index] : 70) - 30
          // // let percentage = (colorProcessingPercentages[index] ? colorProcessingPercentages[index] : 0.70) * index
          console.log(index, percentage)
          colorProcessingPercentages[index] = percentage
          let color = fill(index)
          // return
          return lighten(saturate(color, percentage), percentage)
        })
        .attr('d', this.$d3.ribbon().radius(innerRadius))
    }
  }
}
</script>
