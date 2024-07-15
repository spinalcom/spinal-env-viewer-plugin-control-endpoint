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
  <div class="enum-config-config_container">
    <md-content class="colors md-scrollbar">
      <div
        class="md-layout md-gutter item"
        v-for="item in enumeration"
        :key="item.id"
      >
        <div class="md-layout-item md-size-45">
          <md-field md-inline>
            <md-input v-model="item.name" placeholder="name"></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-size-45">
          <!-- <span class="md-caption">Color</span> -->
          <div class="colorContainer">
            <div
              class="current-color"
              :style="'background-color: ' + item.color"
              @click="togglePicker(item.id)"
            ></div>
            <chrome-picker
              v-if="display[item.id]"
              class="colorSelect"
              v-model="item.color"
              @input="(val) => updateColor(item, val)"
            />
          </div>
        </div>
      </div>
    </md-content>

    <md-button
      class="md-fab md-mini md-primary md-fab-bottom-right"
      @click="addColor"
    >
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';

export default {
  name: 'enumConfigTemplate',
  components: { 'chrome-picker': Chrome },
  props: {
    config: {},
  },
  data() {
    return {
      enumeration: [],
      display: {},
    };
  },
  mounted() {
    this.enumeration = JSON.parse(JSON.stringify(this.config.enumeration));
  },
  methods: {
    updateColor(item, val) {
      item.color = val.hex;
    },
    addColor() {
      this.enumeration = [
        ...this.enumeration,
        { name: '', color: '#000000', id: Date.now() },
      ];
    },
    togglePicker(val) {
      this.display = Object.assign({}, this.display, {
        [val]: !this.display[val],
      });
    },
  },
};
</script>

<style scoped>
.enum-config-config_container {
  width: 90%;
  height: 100%;
  margin: auto;
}

.enum-config-config_container .colors {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.enum-config-config_container .colors .item {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.enum-config-config_container .colorContainer {
  width: 100%;
  height: 30px;
}

.enum-config-config_container .colorSelect {
  width: 100%;
}

.enum-config-config_container .colorContainer .current-color {
  width: 100%;
  height: 80%;
}

.enum-config-config_container .colorContainer .current-color:hover {
  cursor: pointer;
}
</style>
