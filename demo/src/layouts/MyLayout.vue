<template>
  <q-layout view="lHh Lpr lFf">
<q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg">
          </q-avatar>
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page" label="demo test" />
      </q-tabs>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
