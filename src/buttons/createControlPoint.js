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


const SIDEBAR = "GraphManagerSideBar";


class CreateControlPointButton extends SpinalContextApp {
  constructor() {
    super("create control point",
      "create control point", {
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

    const isControlPointGroup = spinalControlPointService.isControlPointGroup(
      option.selectedNode.id.get());

    return Promise.resolve(isControlPointGroup ? true : -1);
  }

  action(option) {
    spinalPanelManagerService.openPanel("createControlPointDialog", {
      selectedNode: option.selectedNode.get(),
      context: option.context.get()
    });
  }

}

const createControlPointContext =
  new CreateControlPointButton();

spinalContextMenuService.registerApp(SIDEBAR, createControlPointContext, [
  3
]);

export default createControlPointContext;