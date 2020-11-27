import Vue from "vue";
import {
  SpinalForgeExtention,
} from "spinal-env-viewer-panel-manager-service_spinalforgeextention";


import EditControlPointPanel from "./controlPointEdit.vue";
// import HeatmapPanel from "./heatmap-panel.vue";

const panels = [
  {
    name: "editControlPointPanel",
    vueMountComponent: Vue.extend(EditControlPointPanel),
    panel: {
      title: "Control Points",
      closeBehaviour: "hide",
    },
    style: {
      minWidth: "660px",
      height: "475px",
      left: "400px",
    },
  },
  // {
  //   name: "heatmapPanel",
  //   vueMountComponent: Vue.extend(HeatmapPanel),
  //   panel: {
  //     title: "HeatMaps",
  //     closeBehaviour: "hide",
  //   },
  //   style: {
  //     minWidth: "350px",
  //     minHeight: "450px",
  //     width: "350px",
  //     height: "450px",
  //     right: "40px",
  //   },
  // }
];


for (const element of panels) {
  const panelExtension = SpinalForgeExtention.createExtention(element);
  SpinalForgeExtention.registerExtention(element.name, panelExtension);
}