import {
    SpinalContextApp,
    spinalContextMenuService
  } from "spinal-env-viewer-context-menu-service";
  
  import {
    spinalPanelManagerService
  } from "spinal-env-viewer-panel-manager-service";
  
  import {
    spinalControlPointService,
  } from "spinal-env-viewer-plugin-control-endpoint-service";
  
  
  const SIDEBAR = "GraphManagerSideBar";
  
  
  class SeeControlPointDetail extends SpinalContextApp {
    constructor() {
      super("see control point detail",
        "see control point detail", {
          icon: "games",
          icon_type: "in",
          backgroundColor: "#FF0000",
          fontColor: "#FFFFFF"
        })
    }
  
    isShown(option) {
      const isControlPointContext = spinalControlPointService
        .isControlPointContext(option.context.id.get());
  
      if (!isControlPointContext) return Promise.resolve(-1);
  
      const isControlPoint = 
        option.selectedNode.type.get() === spinalControlPointService.CONTROL_POINT_TYPE
  
      return Promise.resolve(isControlPoint ? true : -1);
    }
  
    action(option) {
      spinalPanelManagerService.openPanel("editControlPointPanel", {
        selectedNode: option.selectedNode.get(),
        context: option.context.get()
      });
    }
  
  }
  
  const seeControlPointDetail =
    new SeeControlPointDetail();
  
  spinalContextMenuService.registerApp(SIDEBAR, seeControlPointDetail, [
    3
  ]);
  
  export default seeControlPointDetail;