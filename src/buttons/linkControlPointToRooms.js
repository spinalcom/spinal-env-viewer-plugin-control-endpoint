import {
    SpinalContextApp,
    spinalContextMenuService
  } from "spinal-env-viewer-context-menu-service";
  
  import {
    spinalPanelManagerService
  } from "spinal-env-viewer-panel-manager-service";
  
  import {
    spinalControlPointService
  } from "spinal-env-viewer-plugin-control-endpoint-service";

  import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
  
  
  const SIDEBAR = "GraphManagerSideBar";
  
  
  class LinkControlPointToRooms extends SpinalContextApp {
    constructor() {
      super("Link control point",
        "Link control point", {
          icon: "games",
          icon_type: "in",
          backgroundColor: "#FF0000",
          fontColor: "#FFFFFF"
        })
    }
  
    isShown(option) {
      const contextType = option.context.type.get();
      const isRoomGroupContext = groupManagerService.isRoomGroupContext(contextType);
      const isEquipementGroup = groupManagerService.isEquipmentGroupContext(contextType);

      if(!isRoomGroupContext && !isEquipementGroup) return Promise.resolve(-1);

      const type = option.selectedNode.type.get();
      const isGroup = groupManagerService.isGroup(type);

      return Promise.resolve(isGroup ? isGroup : -1);
    }
  
    action(option) {
      // let nodeType = option.context.type.get();
      let contextId = option.context.id.get();
      let nodeId = option.selectedNode.id.get();

      spinalPanelManagerService.openPanel("linkControlToRoomDialog",{
        contextId: contextId,
        nodeId: nodeId,
        type : spinalControlPointService.CONTROL_POINT_TYPE
        // type: nodeType,
        // reference: {
        //   context: geographicService.constants.ROOM_REFERENCE_CONTEXT,
        //   relation: geographicService.constants.ROOM_RELATION,
        // },
      })
    }
  
  }
  
  const linkControlPointToRooms =
    new LinkControlPointToRooms();
  
  spinalContextMenuService.registerApp(SIDEBAR, linkControlPointToRooms, [
    3
  ]);
  
  export default linkControlPointToRooms;