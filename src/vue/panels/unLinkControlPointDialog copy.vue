<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
    <md-dialog-title class="_dialogTitle">Unlink Control Point to group
    </md-dialog-title>

    <md-dialog-content class="_unLinkDialogContent">
      <div class="content"
           v-if="state === PAGES.loaded">
        <div class="state"
             v-if="controlEndpoints.length === 0">
          No controlPoints linked
        </div>

        <md-list v-else>
          <md-list-item v-for="item in controlEndpoints"
                        :key="item.id">
            <span class="md-list-item-text">{{item.name}}</span>

            <md-button class="md-icon-button md-list-action"
                       @click="unLinkControlPoint(item.id)">
              <md-icon class="md-accent">link_off</md-icon>
            </md-button>
          </md-list-item>
        </md-list>

      </div>

      <div class="state"
           v-else>
        <md-progress-spinner v-if="state === PAGES.loading"
                             md-mode="indeterminate"></md-progress-spinner>

        <md-icon class="md-size-5x"
                 v-else>error</md-icon>
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-accent"
                 @click="closeDialog(false)">close</md-button>
      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disabled()">OK</md-button> -->
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

export default {
  name: "unLinkControlPointDialog",
  props: ["onFinised"],
  data() {
    this.PAGES = {
      loaded: 0,
      loading: 1,
      error: 2,
    };
    this.groupId;
    return {
      showDialog: true,
      state: this.PAGES.loading,
      controlEndpoints: [],
    };
  },
  mounted() {},

  methods: {
    opened({ nodeId, contextId }) {
      this.state = this.PAGES.loading;
      this.groupId = nodeId;
      this.getControlPointLinked(nodeId)
        .then((result) => {
          this.controlEndpoints = result.map((el) => el.get());
          this.state = this.PAGES.loaded;
        })
        .catch((err) => {
          console.error(err);
          this.state = this.PAGES.error;
        });
    },

    async removed(option) {
      if (option) {
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    getControlPointLinked(groupId) {
      return spinalControlPointService.getElementLinked(groupId);
    },

    unLinkControlPoint(controlPointId) {
      this.state = this.PAGES.loading;
      return spinalControlPointService
        .unLinkControlPointToGroup(this.groupId, controlPointId)
        .then(() => {
          this.controlEndpoints = this.controlEndpoints.filter(
            (el) => el.id !== controlPointId
          );
          this.state = this.PAGES.loaded;
        });
    },
  },
};
</script>

<style scoped>
._dialogTitle {
  text-align: center;
}

._unLinkDialogContent {
  width: 500px;
  height: 500px;
}

._unLinkDialogContent .content {
  width: 100%;
  height: 100%;
}

._unLinkDialogContent .state {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
}
</style>
