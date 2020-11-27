<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="config_container">
    <div class="values md-layout md-gutter">
      <div class="md-layout-item md-size-50">
        <span class="md-caption">False</span>
        <div class="colorContainer">
          <div class="current-color"
               :style="'background-color: ' + config.min.color"
               @click="togglePicker('min')"></div>
          <chrome-picker class="colorSelect"
                         v-model="config.min.color"
                         v-if="display.min"
                         @input="updateMinColor" />
        </div>
      </div>

      <div class="md-layout-item md-size-50">
        <span class="md-caption">True</span>
        <div class="colorContainer">
          <div class="current-color"
               :style="'background-color: ' + config.max.color"
               @click="togglePicker('max')"></div>
          <chrome-picker class="colorSelect"
                         v-model="config.max.color"
                         v-if="display.max"
                         @input="updateMaxColor" />
        </div>
      </div>

    </div>

    <div class="colorGradient">
      <div v-for="(g,index) in gradient"
           :key="index"
           v-tooltip="getColorValue(index)"
           :style="'background-color: #' + g.toHex()">
      </div>
    </div>
  </div>
</template>

<script>
import { Chrome } from "vue-color";
import { color } from "../../../utilities/color";

export default {
  name: "NumberConfigTemplate",
  components: { "chrome-picker": Chrome },
  props: {
    config: {},
  },
  data() {
    return {
      display: {
        min: false,
        average: false,
        max: false,
      },
      gradient: [],
    };
  },
  mounted() {
    this.gradient = color.getGradientColor(
      this.config.min,
      this.config.average,
      this.config.max
    );
  },
  methods: {
    updateMinColor(val) {
      this.config.min.color = val.hex;
      this.gradient = color.getGradientColor(
        this.config.min,
        this.config.average,
        this.config.max
      );
    },
    updateMaxColor(val) {
      this.config.max.color = val.hex;
      this.gradient = color.getGradientColor(
        this.config.min,
        this.config.average,
        this.config.max
      );
    },
    updateAverageColor(val) {
      this.config.average.color = val.hex;
      this.gradient = color.getGradientColor(
        this.config.min,
        this.config.average,
        this.config.max
      );
    },
    calculateAverage() {
      let max = parseInt(this.config.max.value);
      let min = parseInt(this.config.min.value);
      //   if (!isNaN(max) && !isNaN(min) && this.average)
      this.config.average.value = (max + min) / 2;
    },

    togglePicker(val) {
      this.display[val] = !this.display[val];
    },

    getColorValue(index) {
      let max = parseInt(this.config.max.value);
      let min = parseInt(this.config.min.value);

      if (!isNaN(max) && !isNaN(min)) {
        let begin = ((max - min) * index) / 10;
        let end = ((max - min) * (index + 1)) / 10;
        return `${begin + min} - ${end + min}`;
      }

      return "-";
    },
  },
};
</script>

<style scoped>
.config_container {
  width: 90%;
  height: 100%;
  margin: auto;
}

.config_container .values {
  height: 60%;
}
</style>