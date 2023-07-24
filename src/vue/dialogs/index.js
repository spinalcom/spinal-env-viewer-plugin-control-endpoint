/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { SpinalMountExtention } from "spinal-env-viewer-panel-manager-service";

import Vue from "vue";

import CreateControlEndpointContextDialog from "./createContext.vue";
import CreateControlPointDialog from "./createControlPoint.vue";
import ConfigurationDialog from "./configuration.vue";
import LinkControlPointDialog from "./linkControlPointDialog.vue";
import SelectGeographicType from "./selectGeoType.vue";
import SelectNodeToLinkToControlPointDialog from "./selectNodeToLink.vue";
 
// import UnLinkControlPointDialog from "./unLinkControlPointDialog.vue";

const dialogs = [
  {
    name: "createControlEndpointContextDialog",
    vueMountComponent: Vue.extend(CreateControlEndpointContextDialog),
    parentContainer: document.body,
  },
  {
    name: "createControlPointDialog",
    vueMountComponent: Vue.extend(CreateControlPointDialog),
    parentContainer: document.body,
  },
  {
    name: "configurationDialog",
    vueMountComponent: Vue.extend(ConfigurationDialog),
    parentContainer: document.body,
  },
  {
    name: "linkControlToRoomDialog",
    vueMountComponent: Vue.extend(LinkControlPointDialog),
    parentContainer: document.body,
  },
  {
    name: "cp_selectGeographicType",
    vueMountComponent: Vue.extend(SelectGeographicType),
    parentContainer: document.body,
  },

  {
    name: "SelectNodeToLinkToControlPointDialog",
    vueMountComponent: Vue.extend(SelectNodeToLinkToControlPointDialog),
    parentContainer: document.body,
  },

  // {
  //   name: "unLinkControlPointDialog",
  //   vueMountComponent: Vue.extend(UnLinkControlPointDialog),
  //   parentContainer: document.body,
  // },
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}
