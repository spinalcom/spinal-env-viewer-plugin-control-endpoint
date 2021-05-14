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
   <md-dialog
      class="_controlPointdialog"
      :md-active.sync="showDialog"
      @md-closed="closeDialog(false)"
   >
      <md-dialog-title class="_dialogTitle">Create Control Point</md-dialog-title>

      <md-dialog-content class="controlPointDialogContent">
         <!-- <md-button class="md-fab md-mini md-primary md-fab-bottom-right"
                 @click="addControlPoint">
        <md-icon>add</md-icon>
      </md-button> -->

         <md-field class="nameInput">
            <label>Control point name</label>
            <md-input v-model="name"></md-input>
         </md-field>

         <div class="table-container">
            <control-point-component
               class="table-component-content"
               :data="endpoints"
               :editMode="true"
               @cancel="closeDialog(false)"
               @confirm="createData"
            >
            </control-point-component>
         </div>

      </md-dialog-content>

      <!-- <md-dialog-actions>
         <md-button
            class="md-accent"
            @click="closeDialog(false)"
         >Cancel</md-button>
         <md-button
            class="md-primary"
            @click="closeDialog(true)"
            :disabled="disabled()"
         >Save</md-button>
      </md-dialog-actions> -->
   </md-dialog>
</template>

<script>
import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import ControlPointComponent from "../components/controlPoints.vue";

export default {
   name: "createControlPoint",
   props: ["onFinised"],
   components: {
      "control-point-component": ControlPointComponent,
   },
   data() {
      this.contextId = "";
      this.groupId = "";

      return {
         name: "",
         endpoints: [],
         showDialog: true,
      };
   },
   mounted() {},
   methods: {
      opened(option) {
         this.contextId = option.context.id;
         this.groupId = option.selectedNode.id;
      },

      async removed(option) {
         if (option.confirm) {
            spinalControlPointService.createControlPointProfil(
               this.contextId,
               this.groupId,
               { name: this.name, endpoints: option.data }
            );
         }
         this.showDialog = false;
      },

      closeDialog(closeResult) {
         if (typeof this.onFinised === "function") {
            this.onFinised({ confirm: closeResult });
         }
      },

      disabled() {
         return !(
            this.name &&
            this.name.trim().length > 0 &&
            this.endpoints.length > 0
         );
      },

      createData(data) {
         if (this.name.trim().length === 0) return alert("name is required");
         if (typeof this.onFinised === "function") {
            this.onFinised({ confirm: true, data });
         }
      },
   },
};
</script>

<style scoped>
._controlPointdialog {
   width: 100%;
   height: 100%;
}

._controlPointdialog ._dialogTitle {
   text-align: center;
}

._controlPointdialog .controlPointDialogContent {
   width: 100%;
   height: 100%;
}

._controlPointdialog .controlPointDialogContent .nameInput {
   width: 100%;
   margin-bottom: 10px;
   /* height: 60px; */
}

._controlPointdialog .controlPointDialogContent .table-container {
   width: 100%;
   height: calc(100% - 60px);
}

._controlPointdialog
   .controlPointDialogContent
   .table-container
   .table-component-content {
   width: 100%;
   height: 100%;
}
</style>

<style>
._controlPointdialog .md-dialog-container {
   max-width: 100%;
   max-height: 100%;
}

._controlPointdialog .controlPointDialogContent .md-field {
   margin: unset;
}
</style>