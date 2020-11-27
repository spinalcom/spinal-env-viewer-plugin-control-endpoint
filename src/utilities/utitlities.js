import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import { REFERENCE_OBJECT_RELATION_NAME, BIM_OBJECT_TYPE} from 'spinal-env-viewer-plugin-forge/dist/Constants'

export default {

    convertHexColorToRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
            } :
            null;
    },

    convertColorToTHREE_Vector(color) {
        let rgbColor = this.convertHexColorToRGB(`#${color}`);
        return rgbColor ?
        // eslint-disable-next-line no-undef
        new THREE.Vector4(
          rgbColor.r / 255,
          rgbColor.g / 255,
          rgbColor.b / 255,
          0.7
        ) :
        // eslint-disable-next-line no-undef
        new THREE.Vector4(1, 0, 0, 0);
    },

    async getReferenceObject(roomId) {

        const info = SpinalGraphService.getInfo(roomId);
        let references = []

        if(info && info.type.get() === BIM_OBJECT_TYPE) {
          references = [info];
        } else {
          references = await SpinalGraphService.getChildren(roomId,[REFERENCE_OBJECT_RELATION_NAME]);
        }

        
        const bims = references.map(el => el.get());

        const bimMap = new Map();

        for (const bimObject of bims) {
            const bimFileId = bimObject.bimFileId;
            const dbid = bimObject.dbid;
    
            if (typeof bimMap.get(bimFileId) === "undefined") {
              bimMap.set(bimFileId, new Set());
            }
    
            bimMap.get(bimFileId).add(dbid);
          }

          const res = []
  
        for (const [key, value] of bimMap.entries()) {
          res.push({
            model: window.spinal.BimObjectService
              .getModelByBimfile(key),
            ids: Array.from(value)
          })
        }
  
        return res;
    }

}