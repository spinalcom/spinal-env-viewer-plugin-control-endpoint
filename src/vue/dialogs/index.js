import {
  SpinalMountExtention
} from "spinal-env-viewer-panel-manager-service";

import Vue from "vue";


import CreateControlEndpointContextDialog from "./createContext.vue";
import CreateControlPointDialog from './createControlPoint.vue';
import ConfigurationDialog from './configuration.vue';
import LinkControlPointDialog from './linkControlPointDialog.vue';
import SelectGeographicType from "./selectGeoType.vue";

const dialogs = [{
    name: "createControlEndpointContextDialog",
    vueMountComponent: Vue.extend(CreateControlEndpointContextDialog),
    parentContainer: document.body
  },
  {
    name: "createControlPointDialog",
    vueMountComponent: Vue.extend(CreateControlPointDialog),
    parentContainer: document.body
  },
  {
    name: "configurationDialog",
    vueMountComponent: Vue.extend(ConfigurationDialog),
    parentContainer: document.body
  },
  {
    name: "linkControlToRoomDialog",
    vueMountComponent: Vue.extend(LinkControlPointDialog),
    parentContainer: document.body
  },
  {
    name: "cp_selectGeographicType",
    vueMountComponent: Vue.extend(SelectGeographicType),
    parentContainer: document.body
  }
]

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}