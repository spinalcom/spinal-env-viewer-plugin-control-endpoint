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
  <div class="_legends">
    <div class="closeBtn"
         v-tooltip="'close ' + title"
         @click="closeLegend">X</div>

    <div class="md-subheading legend_title"
         v-tooltip="title">{{title}}</div>

    <!--
    <div class="selects md-layout">
      <div class="md-layout-item md-size-45">
        <md-field>
          <md-select v-model="controlPointSelected"
                     @md-selected="selectControlPoint"
                     name="controlPoint"
                     id="controlPoint"
                     placeholder="Control Points">
            <md-option v-for="controlPoint in controlPoints"
                       :key="controlPoint.id"
                       :value="controlPoint.id">{{controlPoint.name}}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-45">
        <md-field>
          <md-select :disabled="disabledEndpointsSelected()"
                     @md-selected="selectEndpointType"
                     v-model="endpointTypeSelected"
                     name="endpoint types"
                     id="endpoint types"
                     placeholder="Endpoint type">
            <md-option v-for="profil in endpointProfils"
                       :key="profil.id"
                       :value="JSON.stringify(profil)">{{profil.name}}
            </md-option>

          </md-select>
        </md-field>
      </div>
    </div>

    -->

    <md-menu class="selects"
             md-size="small"
             :mdCloseOnClick="true">

      <md-button class="btn-trigger"
                 md-menu-trigger>

        <md-icon class="menu_icon legendIcon">
          menu
        </md-icon>

        <!-- <md-icon class="menu_icon legendIcon">keyboard_arrow_down</md-icon> -->

      </md-button>

      <md-menu-content>
        <md-menu-item v-for="profil in endpointProfils"
                      :key="profil.id"
                      @click="selectEndpointType(profil)">

          <!-- <md-icon class="legendIcon"
                   v-if="getIcon(heatmap.name.get())">
            {{getIcon(heatmap.name.get())}}</md-icon> -->

          <!-- <md-icon v-if="!getIcon(heatmap.name.get())"
                   :md-src="getSvg(heatmap.name.get())"></md-icon> -->
          {{profil.title}}
        </md-menu-item>

      </md-menu-content>
    </md-menu>

    <div class="colors">

      <div class="boxContainer"
           v-for="(g,index) in this.gradient"
           :key="index">
        <div class="boxColor"
             :style="{'background-color': g.color}"></div>
        <div class="boxValue"
             v-tooltip="g.value + ''">{{g.value}}</div>
      </div>

    </div>
  </div>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { color } from "../../utilities/color";
import utilities from "../../utilities/utitlities";

export default {
  name: "heatmap-legend",
  props: {
    controlPoints: {},
    id: {},
    // endpoints: {
    //   default: [],
    // },
    // gradient: {
    //   default: [],
    // },
  },
  mounted() {
    const info = SpinalGraphService.getInfo(this.id);
    if (info) this.title = info.name.get();

    this.updateData();

    // if (this.controlPoints && this.controlPoints.length > 0) {
    //   this.endpointProfils = this.formatProfil(this.controlPoints);

    //   this.selectEndpointType(this.endpointProfils[0]);
    //   // this.controlPointSelected = this.controlPoints[0].id;
    //   // this.selectControlPoint(this.controlPointSelected, true);
    // }
  },

  data() {
    this.bindProcessMap = new Map();
    this.bimObjectsColored = [];

    return {
      title: "",
      controlPointSelected: undefined,
      endpointTypeSelected: undefined,
      endpointProfils: [],
      gradient: [],
    };
  },

  methods: {
    // selectControlPoint(id, continues = false) {
    //   const found = this.controlPoints.find((el) => el.id === id);
    //   this.endpointProfils = found.endpointProfils;
    //   this.endpointTypeSelected = JSON.stringify(this.endpointProfils[0]);

    //   if (continues) {
    //     this.selectEndpointType(this.endpointTypeSelected);
    //   }
    // },

    selectEndpointType(profil) {
      // const profil = JSON.parse(argProfil);
      if (profil) {
        // console.log("profil", profil);
        this.endpointTypeSelected = profil.id;
        this.controlPointSelected = profil.contextId;

        this.gradient = this.getColorsGradient(profil.config);
        this.colorHeatmap(profil);
      } else {
        this.gradient = [];
      }
    },

    getColorsGradient(config) {
      if (config.enumeration) {
        return color.getEnumGradientColor(config.enumeration);
      }

      let _colors = color.getGradientColor(
        config.min,
        config.average,
        config.max
      );

      return _colors.map((el, index) => {
        return {
          color: `#${el.toHex()}`,
          value: this.getValue(index, config.max.value, config.min.value),
        };
      });
    },

    getValue(index, max, min) {
      if (isNaN(parseInt(min)) && isNaN(parseInt(max)))
        return index ? "True" : "False";
      return Number(min) + ((Number(max) - Number(min)) * Number(index)) / 10;
    },

    getColor(endpointValue, config) {
      if (config.enumeration) {
        return color.getEnumColor(endpointValue, config.enumeration);
      }

      let gradient = color.getGradientColor(
        config.min,
        config.average,
        config.max
      );

      return color.getColor(
        endpointValue,
        config.min.value,
        config.max.value,
        gradient
      );

      // return color.getColor(
      //   endpointValue,
      //   config.min.value,
      //   config.max.value,
      //   this.gradient
      // );

      // let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
      // return result
      //   ? {
      //       r: parseInt(result[1], 16),
      //       g: parseInt(result[2], 16),
      //       b: parseInt(result[3], 16),
      //     }
      //   : null;
    },

    async colorHeatmap(profil) {
      this.unBindAll();

      const res = await this.getEndpointToBind(profil.id);
      if (typeof res === "undefined") return;

      this.bimObjectsColored.push(...res.map((el) => el.ids).flat());

      res.forEach((element) => {
        let bindProcess = element.endpoint.currentValue.bind(() => {
          const value = element.endpoint.currentValue.get();
          // const config = element.endpoint.config.get();

          let color = this.getColor(value, profil.config);
          let vector = utilities.convertColorToTHREE_Vector(color);

          element.ids.forEach(({ model, ids }) => {
            ids.forEach((id) => {
              model.setThemingColor(id, vector, true);
            });
            // model.setThemingColor(ids, vector, true);
          });

          window.spinal.ForgeViewer.viewer.impl.invalidate(true);

          // let model = window.spinal.BimObjectService.getModelByBimfile(
          //   element.room.bimFileId
          // );

          // model.setThemingColor(element.room.dbid, vector, true);
        });

        this.bindProcessMap.set(element.endpoint, bindProcess);
      });
    },

    restoreColor() {
      const vector = new THREE.Vector4(0, 0, 0, 0);

      this.bimObjectsColored.forEach(({ model, ids }) => {
        ids.forEach((dbid) => model.setThemingColor(dbid, vector, true));
      });

      window.spinal.ForgeViewer.viewer.impl.invalidate(true);
    },

    getEndpointToBind(endpointId) {
      const controlPoint = this.controlPoints.find(
        (el) => el.id === this.controlPointSelected
      );

      if (controlPoint) {
        const promises = controlPoint.rooms.map(async (el) => {
          const endpoint = el.endpoints.find(
            // (e) => e.type.get() === endpointType
            (e) => e.id.get() == endpointId
          );

          return {
            endpoint,
            ids: await utilities.getReferenceObject(el.id),
          };
        });

        return Promise.all(promises);
      }
    },

    unBindAll() {
      this.bindProcessMap.forEach((value, key) => {
        key.currentValue.unbind(value);
        this.bindProcessMap.delete(key);
      });
    },

    disabledEndpointsSelected() {
      return typeof this.controlPointSelected === "undefined";
    },

    formatProfil(liste) {
      const profils = [];
      for (const context of liste) {
        const items = context.endpointProfils.map((element) => {
          const el = JSON.parse(JSON.stringify(element));
          el.title = `${context.name} / ${el.name}`;
          el.contextId = context.id;
          return el;
        });
        profils.push(...items);
      }

      return profils;
    },

    updateData(elementSelected) {
      if (this.controlPoints && this.controlPoints.length > 0) {
        this.endpointProfils = this.formatProfil(this.controlPoints);
        if (typeof elementSelected === "undefined") {
          elementSelected = this.endpointProfils[0];
        }

        this.selectEndpointType(elementSelected);
      }
    },

    closeLegend() {
      this.$emit("close", this.id);
    },
  },

  beforeDestroy() {
    this.unBindAll();
    this.restoreColor();
  },

  watch: {
    controlPoints() {
      const context = this.controlPoints.find(
        (el) => el.id === this.controlPointSelected
      );
      let found;

      if (context) {
        found = context.endpointProfils.find(
          (el) => el.id === this.endpointTypeSelected
        );
      }
      this.updateData(found);
    },
  },
};
</script>

<style scoped>
._legends {
  width: 100%;
  height: 100%;
  position: relative;
}

._legends .closeBtn {
  width: 20px;
  height: 20px;
  position: absolute;
  background: red;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  z-index: 99999999;
  top: -16px;
  right: -14px;
  cursor: pointer;
}

._legends .legend_title {
  height: 20px;
  width: 60px;
  color: #448aff;
  font-size: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

._legends .selects {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: space-between;
}

._legends .selects .btn-trigger {
  min-width: unset;
}

._legends .colors {
  /* width: 100%; */
  height: calc(100% - 70px);
  margin: auto;
  display: flex;
  justify-content: space-between;
  flex-direction: column-reverse;
}

._legends .colors .boxContainer {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  position: relative;
}

._legends .colors .boxContainer .boxColor {
  width: calc(20%);
  /* width: calc(100%); */
  background-color: red;
}

._legends .colors .boxContainer .boxValue {
  width: calc(80%);
  align-self: flex-end;
  justify-self: flex-end;
  max-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  padding-left: 4px;
  position: absolute;
  bottom: -10px;
  left: 10px;
}
</style>

<style>
._legends .selects .md-field {
  min-height: unset;
}
</style>