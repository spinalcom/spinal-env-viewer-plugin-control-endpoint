import {
  SpinalContextApp,
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

const HEADERBAR = "GraphManagerTopBar";


class CreateControlEndpointContextButton extends SpinalContextApp {
  constructor() {
    super("create control point context",
      "create control point context", {
        icon: "games",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF"
      })
  }

  isShown() {
    return Promise.resolve(true);
  }

  action() {
    spinalPanelManagerService.openPanel(
      "createControlEndpointContextDialog", {});
  }

}

const createControlEndpointContext =
  new CreateControlEndpointContextButton();

spinalContextMenuService.registerApp(HEADERBAR, createControlEndpointContext, [
  3
]);

export default createControlEndpointContext;