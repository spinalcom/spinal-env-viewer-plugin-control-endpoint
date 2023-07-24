<!--
Copyright 2023 SpinalCom - www.spinalcom.com

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
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title class="_dialogTitle">To which node(s) the controlpoints should be linked</md-dialog-title>

    <md-dialog-content>
      
      <md-list>
         <md-subheader>Link controlPoint profil to :</md-subheader>

         <md-list-item>
         <md-radio v-model="config.nodeToLink" :value="nodesToLink.directlyToNode" />
         <span class="md-list-item-text"> Node selected</span>
         </md-list-item>

         <md-list-item>
         <md-radio v-model="config.nodeToLink" :value="nodesToLink.children" />
         <span class="md-list-item-text">Children (in context) of node selected</span>
         </md-list-item>

         <md-list-item>
         <md-radio v-model="config.nodeToLink" :value="nodesToLink.type" />
         <span class="md-list-item-text">To a type in context</span>
         </md-list-item>

         <md-field v-if="config.nodeToLink === nodesToLink.type">
          <label>Types</label>
          <md-select v-model="config.type">
            <md-option v-for="t in types" :key="t.id" :value="t.value">{{t.name}}</md-option>
          </md-select>
        </md-field>
      </md-list>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disabled()">OK</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import {nodesToLink} from '../../utilities/nodeToSelect'
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

export default {
  name: "SelectNodeToLinkToControlPointDialog",
   props: ["onFinised"],
  data() {
    this.maps = {};
    return {
      nodesToLink,
      config: {
        nodeToLink: nodesToLink.directlyToNode,
        type: ""
      },
      types : [],
      showDialog: true,
      callback: undefined,
      contextId: undefined,
      nodeId: undefined
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      this.contextId = option.contextId;
      this.nodeId = option.nodeId;
    },

    async removed(option) {
      if (option) {
        this.goToSelectControlPointProfil(this.contextId, this.nodeId, this.config);
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    disabled() {
      if (this.config.nodeToLink !== this.nodesToLink.type) return false;
      if (this.config.nodeToLink === this.nodesToLink.type && this.config.type) return false;

      return true
    },

    goToSelectControlPointProfil (contextId, nodeId, config) {
      spinalPanelManagerService.openPanel("linkControlToRoomDialog", {
        contextId,
        nodeId,
        config,
      });
    },

    async getTypes(nodeId, contextId) {
      if(this.maps[nodeId]) return this.maps[nodeId]
      const obj =  await SpinalGraphService.browseAndClassifyByTypeInContext(nodeId, contextId);
      const types = obj.types.map(el => ({ name: el, value: el, id: el }));

      this.maps[nodeId] = types;
      return types;
    }
  },
  watch: {
    "config.nodeToLink": async function (newValue) {
      this.config.type = "";

      if (newValue === this.nodesToLink.type) this.types = await this.getTypes(this.nodeId, this.contextId);

    }
  }
};
</script>

<style scoped>
._dialogTitle {
  text-align: center;
}
</style>
