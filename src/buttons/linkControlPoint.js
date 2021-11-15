import {
  SpinalContextApp,
  spinalContextMenuService,
} from "spinal-env-viewer-context-menu-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

// import {
//   spinalControlPointService
// } from "spinal-env-viewer-plugin-control-endpoint-service";

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import {
  CONTEXT_TYPE,
  GEOGRAPHIC_TYPES_ORDER,
} from "spinal-env-viewer-context-geographic-service/build/constants";
import utilities from "../utilities/utitlities";

const SIDEBAR = "GraphManagerSideBar";

class LinkControlPointToGroup extends SpinalContextApp {
  constructor() {
    super("Link control point", "Link control point", {
      icon: "games",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    const contextType = option.context.type.get();
    // const isRoomGroupContext = groupManagerService.isRoomGroupContext(contextType);

    // const isContextGeo = contextType === CONTEXT_TYPE;
    // if(isContextGeo) return Promise.resolve(true);

    const isGroupContext = groupManagerService.isContext(contextType);

    if (!isGroupContext) return Promise.resolve(-1);

    const type = option.selectedNode.type.get();

    const isCategory = groupManagerService.isCategory(type);
    const isGroup = groupManagerService.isGroup(type);
    const isContext = type === contextType;

    if (isCategory || isGroup || isContext) {
      const type = utilities.getGroupType(contextType);
      return Promise.resolve(GEOGRAPHIC_TYPES_ORDER.indexOf(type));
    }

    return Promise.resolve(-1);
  }

  action(option) {
    // let nodeType = option.context.type.get();
    const contextId = option.context.id.get();
    const nodeId = option.selectedNode.id.get();
    const contextType = option.context.type.get();

    const isGeographicContext = contextType === CONTEXT_TYPE;

    if (!isGeographicContext) {
      const type = getGroupType.getGroupType(contextType);
      return openDialog(contextId, nodeId, type);
    } else {
      spinalPanelManagerService.openPanel("cp_selectGeographicType", {
        type: option.selectedNode.type.get(),
        callback: (argType) => {
          openDialog(contextId, nodeId, argType);
        },
      });
    }
  }
}

const openDialog = (contextId, nodeId, type) => {
  spinalPanelManagerService.openPanel("linkControlToRoomDialog", {
    contextId,
    nodeId,
    type,
  });
};

const linkControlPointToGroup = new LinkControlPointToGroup();

spinalContextMenuService.registerApp(SIDEBAR, linkControlPointToGroup, [3]);

export default linkControlPointToGroup;
