import {
  SpinalContextApp,
  spinalContextMenuService,
} from "spinal-env-viewer-context-menu-service";

// import {
//   spinalControlPointService
// } from "spinal-env-viewer-plugin-control-endpoint-service";

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import { GEOGRAPHIC_TYPES_ORDER } from "spinal-env-viewer-context-geographic-service/build/constants";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import utilities from "../utilities/utitlities";

const SIDEBAR = "GraphManagerSideBar";

class UnLinkControlPointToGroup extends SpinalContextApp {
  constructor() {
    super("unlink control point", "unlink control point", {
      icon: "link_off",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    const type = option.selectedNode.type.get();

    const isGroup = groupManagerService.isGroup(type);

    if (isGroup) {
      const contextType = option.context.type.get();
      const groupType = utilities.getGroupType(contextType);
      return Promise.resolve(GEOGRAPHIC_TYPES_ORDER.indexOf(groupType));
    }

    return Promise.resolve(-1);
  }

  action(option) {
    // const nodeId = option.selectedNode.id.get();
    // const contextId = option.context.id.get();

    spinalPanelManagerService.openPanel(
      "UnLinkControlpointPanel",
      option.selectedNode.get()
    );
  }
}

const unLinkControlPointToGroup = new UnLinkControlPointToGroup();

spinalContextMenuService.registerApp(SIDEBAR, unLinkControlPointToGroup, [3]);

export default unLinkControlPointToGroup;
