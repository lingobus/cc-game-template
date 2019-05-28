<template>
  <div class="sfc">
    <canvas id="GameCanvas" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'GameCanvas',
  props: {

  },
  mounted () {
    this.settings()
    this.main()
    this.$refs.canvas.__sfc__ = this
  },
  methods: {
    main () {
      __cc__require__('./main.js')
    },
    settings () {
      __cc__require__('./src/settings.js')
    },
    test () {
      if (true) {
        console.log(1)
      } else {
        console.log(2)
      }
    }
  }
}
</script>

<style lang="stylus" scoped="true">
.sfc {
  width: 100%;
  height: 100%;
}
</style>
