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
  <div class="_container">
    <md-content class="md-scrollbar heatmap_legends_container"
                v-if="legendLength > 0">

      <div class="legend"
           v-for="(key) in Object.keys(data)"
           :key="key">
        <heatmap-legend :id="key"
                        :controlPoints="data[key]"
                        :ref="key"
                        @close="closeLegend"></heatmap-legend>
      </div>
    </md-content>
  </div>

</template>

<script>
import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import HeatmapLegend from "../components/heatmap.vue";
import { EventBus } from "../../utilities/event";
import { itemColoredMap } from "../../utilities/itemsColored";
export default {
  name: "heatmapPanel",
  components: {
    "heatmap-legend": HeatmapLegend,
  },
  data() {
    this.button;
    return {
      legendLength: 0,
      data: {},
    };
  },
  mounted() {
    this.openEvent();
    this.getUpdateEvent();
  },
  methods: {
    // async opened(option) {
    //   const groupId = option.selectedNode.id;
    //   if (this.data[groupId]) {
    //     this.destroyLegend(groupId);
    //     const res = Object.assign({}, this.data);
    //     delete res[groupId];
    //     this.data = Object.assign({}, res);
    //     return;
    //   }

    //   const data = await this.getAllData(groupId);
    //   this.data = Object.assign({}, this.data, { [groupId]: data });
    // },

    async getAllData(groupId) {
      const data = await spinalControlPointService.getDataFormated(groupId);
      return data;
    },

    closeLegend(groupId) {
      if (this.data[groupId]) {
        this.destroyLegend(groupId);
        const res = Object.assign({}, this.data);
        delete res[groupId];
        this.data = Object.assign({}, res);
        this.legendLength = Object.keys(this.data).length;
        itemColoredMap.delete(groupId);
        if (this.button) this.button.fontColor = "#FFFFFF";
        return;
      }
    },

    destroyLegend(id) {
      if (typeof this.$refs[id] !== "undefined") {
        this.$refs[id][0].$destroy();
      }
    },

    closed() {},

    openEvent() {
      EventBus.$on("heatmapPanel", async (option) => {
        const groupId = option.selectedNode.id;
        this.button = option.button;

        if (this.data[groupId]) {
          this.destroyLegend(groupId);
          const res = Object.assign({}, this.data);
          delete res[groupId];
          this.data = Object.assign({}, res);
          this.legendLength = Object.keys(this.data).length;

          return;
        }

        const data = await this.getAllData(groupId);

        if (data.length === 0) {
          alert("No controlpoint Linked");
          if (this.button) this.button.fontColor = "#FFFFFF";
          return;
        }

        this.data = Object.assign({}, this.data, { [groupId]: data });
        this.legendLength = Object.keys(this.data).length;
      });
    },

    getUpdateEvent() {
      EventBus.$on("update-controlPoint", (option) => {
        Object.keys(this.data).map(async (groupId) => {
          const data = await this.getAllData(groupId);
          this.data[groupId] = data;
        });
      });
    },
  },
};
</script>

<style scoped>
._container {
  padding-top: 30px;
  cursor: all-scroll;
}

._container .heatmap_legends_container {
  /* width: 100%;
  height: calc(100% - 15px);
  display: flex;
  flex-direction: column;
  align-items: center; */
  /* background: red; */
  /* width: 200px; */
  max-width: 200px;
  height: calc(40%);
  background: #393939 !important;
  border: 1px solid black;
  overflow-x: auto;
  position: absolute;
  left: 0px;
  top: calc(20%);
  padding: 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
}

._container .heatmap_legends_container .legend {
  width: 60px;
  height: calc(98% - 20px);
  color: white;
  padding: 5px;
  display: inline-block;
  /* margin-right: 20px; */
  font-weight: bold;
  margin: 10px 10px 10px 0;
  border: 1px solid gray;
}

._container .heatmap_legends_container:last-child {
  margin-right: 0px;
}
</style>