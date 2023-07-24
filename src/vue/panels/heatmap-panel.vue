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
  <div class="heatmap_panel_container">
    <div class="legend"
         v-for="(key) in Object.keys(data)"
         :key="key">
      <heatmap-legend :id="key"
                      :controlPoints="data[key]"
                      :ref="key"></heatmap-legend>
    </div>
  </div>
</template>

<script>
import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import HeatmapLegend from "../components/heatmap.vue";

export default {
  name: "heatmapPanel",
  components: {
    "heatmap-legend": HeatmapLegend,
  },
  data() {
    return {
      data: {},
    };
  },
  methods: {
    async opened(option) {
      const groupId = option.selectedNode.id;
      if (this.data[groupId]) {
        this.destroyLegend(groupId);
        const res = Object.assign({}, this.data);
        delete res[groupId];
        this.data = Object.assign({}, res);
        return;
      }

      const data = await this.getAllData(groupId);
      this.data = Object.assign({}, this.data, { [groupId]: data });
    },

    async getAllData(groupId) {
      const data = await spinalControlPointService.getDataFormated(groupId);
      return data;
    },

    destroyLegend(id) {
      if (typeof this.$refs[id] !== "undefined") {
        this.$refs[id][0].$destroy();
      }
    },

    closed() {},
  },
};
</script>

<style scoped>
.heatmap_panel_container {
  width: 100%;
  height: calc(100% - 15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background: red; */
}

.heatmap_panel_container .legend {
  width: 95%;
  border: 1px solid gray;
  padding: 5px;
  margin: 5px 0px 0px 5px;
}
</style>