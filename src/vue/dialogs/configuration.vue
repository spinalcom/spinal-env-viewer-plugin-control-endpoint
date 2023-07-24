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
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             class="config_dialog_content">
    <md-dialog-title class="_dialogTitle">Configuration</md-dialog-title>

    <md-dialog-content>

      <number-config-template v-if="isNumberConfig()"
                              :config="config"
                              @valid="confirmConfig"></number-config-template>

      <boolean-config-template v-else-if="isBoolConfig()"
                               :config="config"
                               @valid="confirmConfig"></boolean-config-template>

      <enum-config-template v-else-if="isEnumConfig()"
                            :config="config"
                            ref="enum-config"></enum-config-template>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 :disabled="disableOkBtn()"
                 @click="closeDialog(true)">OK</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import NumberConfigTemplate from "../components/config-components/numberConfig.vue";
import BooleanConfigTemplate from "../components/config-components/booleanConfig.vue";
import EnumConfigTemplate from "../components/config-components/enumConfig.vue";

import { ControlEndpointDataType } from "spinal-env-viewer-plugin-control-endpoint-service";

export default {
  name: "configurationDialog",
  components: {
    "number-config-template": NumberConfigTemplate,
    "boolean-config-template": BooleanConfigTemplate,
    "enum-config-template": EnumConfigTemplate,
  },
  props: ["onFinised"],
  data() {
    return {
      config: {},
      item: {},
      showDialog: true,
      callback: undefined,
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      this.item = option.item;
      this.config = JSON.parse(JSON.stringify(this.item.config));

      if (option.callback) {
        this.callback = option.callback;
      }
    },

    async removed(option) {
      if (option.confirm && typeof this.callback === "function") {
        if (this.isEnumConfig()) {
          this.config.enumeration = this.getConfigEnum();
        }
        this.callback(JSON.parse(JSON.stringify(this.config)));
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised({ confirm: closeResult });
      }
    },

    isNumberConfig() {
      return (
        [
          ControlEndpointDataType.Float,
          ControlEndpointDataType.Integer,
          ControlEndpointDataType.Integer16,
          ControlEndpointDataType.Real,
          ControlEndpointDataType.Double,
          ControlEndpointDataType.Long,
        ].indexOf(this.item.dataType) !== -1
      );
    },

    isBoolConfig() {
      return this.item.dataType === ControlEndpointDataType.Boolean;
    },

    isEnumConfig() {
      return this.item.dataType === ControlEndpointDataType.Enum;
    },

    confirmConfig(config) {
      this.config = Object.assign(config);
    },

    numberConfigIsValid(config) {
      return (
        ("" + config.min.value).trim().length > 0 &&
        ("" + config.min.color).trim().length > 0 &&
        ("" + config.average.value).trim().length > 0 &&
        ("" + config.average.color).trim().length > 0 &&
        ("" + config.max.value).trim().length > 0 &&
        ("" + config.max.color).trim().length > 0
      );
    },

    booleanConfigIsValid(config) {
      return (
        ("" + config.min.value).trim().length > 0 &&
        ("" + config.min.color).trim().length > 0 &&
        ("" + config.max.value).trim().length > 0 &&
        ("" + config.max.color).trim().length > 0
      );
    },

    enumConfigIsValid(config) {
      const found = config.find(
        (el) => el.name.trim().length === 0 || el.color.trim().length === 0
      );

      return typeof found === "undefined";
    },

    disableOkBtn() {
      if (this.isNumberConfig()) {
        return !this.numberConfigIsValid(this.config);
      } else if (this.isBoolConfig()) {
        return !this.booleanConfigIsValid(this.config);
      } else if (this.isEnumConfig()) {
        return !this.enumConfigIsValid(this.config.enumeration);
      }
    },

    getConfigEnum() {
      const enumRef = this.$refs["enum-config"];
      if (enumRef) {
        return enumRef.enumeration.filter(
          (el) => el.name.trim().length > 0 && el.color.trim().length > 0
        );
        // return JSON.parse(JSON.stringify(enumRef.enumeration));
      }
    },
  },
};
</script>

<style scoped>
.config_dialog_content {
  width: 50%;
  height: 60%;
}

.config_dialog_content ._dialogTitle {
  text-align: center;
}
</style>