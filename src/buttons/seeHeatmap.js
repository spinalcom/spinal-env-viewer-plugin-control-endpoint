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
  
  import { itemColoredMap, isColored } from '../utilities/itemsColored';
  
  const SIDEBAR = "GraphManagerSideBar";
  
  import { EventBus } from "../utilities/event";
  
  class SeeHeatMapButton extends SpinalContextApp {
    constructor() {
      super("See heatpmap",
        "See heatpmap", {
          icon: "gradient",
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
  
        const type = option.selectedNode.type.get()
        const isGroup = groupManagerService.isGroup(type)

        if(!isGroup) return Promise.resolve(-1);

        const id = option.selectedNode.id.get()
        

        this.buttonCfg.fontColor = isColored(id) ? "#FF0000" : "#FFFFFF";

        return Promise.resolve(true);
    }
  
    action(option) {

      const id = option.selectedNode.id.get();

      if(isColored(id)) {
        itemColoredMap.delete(id);
        this.fontColor = "#FFFFFF";
      } else {
        itemColoredMap.set(id,id);
        this.fontColor = "#FF0000";
      }

      EventBus.$emit("heatmapPanel", {
        selectedNode : option.selectedNode.get(),
        context : option.context.get(),
        button : this
      })

      // spinalPanelManagerService.openPanel("heatmapPanel",{
      //   selectedNode : option.selectedNode.get(),
      //   context : option.context.get()
      // })
    }
  
  }


  const seeHeatMapButton =
    new SeeHeatMapButton();
  
  spinalContextMenuService.registerApp(SIDEBAR, seeHeatMapButton, [
    3
  ]);
  
  export default seeHeatMapButton;