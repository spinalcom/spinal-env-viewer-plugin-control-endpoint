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
  <div class="control_points_container">
    <md-button v-if="!editMode"
               @click="activeEditMode"
               class="md-fab md-mini md-plain md-primary md-fab-bottom-right">
      <md-icon>edit</md-icon>
    </md-button>

    <control-point-vue :editMode="editMode"
                       :data="data"
                       @cancel="disabledEditMode"
                       @confirm="confirm"></control-point-vue>
  </div>
</template>

<script>
import ControlPointsVue from "../components/controlPoints.vue";
import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import { EventBus } from "../../utilities/event";

export default {
  name: "editControlPointPanel",
  components: {
    "control-point-vue": ControlPointsVue,
  },
  data() {
    this.contextId;
    this.nodeId;
    return {
      editMode: false,
      data: [],
    };
  },
  methods: {
    async opened(option) {
      this.contextId = option.context.id;
      this.nodeId = option.selectedNode.id;
      const res = await spinalControlPointService.getControlPointProfil(
        this.contextId,
        this.nodeId
      );

      this.setData(res);
    },

    closed() {},

    async confirm(validItems) {
      return spinalControlPointService
        .editControlPointProfil(this.contextId, this.nodeId, validItems)
        .then((res) => {
          this.setData(res);
          this.disabledEditMode();
          EventBus.$emit("update-controlPoint", {
            contextId: this.contextId,
            controlPointId: this.nodeId,
            items: res.endpoints.get(),
          });
        });
    },

    cancel() {},

    setData(res) {
      if (res.endpoints) {
        this.data = res.endpoints.get();
      }
    },

    activeEditMode() {
      this.editMode = true;
    },

    disabledEditMode() {
      this.editMode = false;
    },
  },
};
</script>

<style scoped>
.control_points_container {
  width: 100%;
  height: calc(100% - 15px);
  position: relative;
  /* background: red; */
}
</style>