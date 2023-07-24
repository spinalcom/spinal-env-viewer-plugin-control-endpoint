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

import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import {
  REFERENCE_OBJECT_RELATION_NAME,
  BIM_OBJECT_TYPE,
} from "spinal-env-viewer-plugin-forge/dist/Constants";

export default {
  convertHexColorToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  convertColorToTHREE_Vector(color) {
    let rgbColor = this.convertHexColorToRGB(`#${color}`);
    return rgbColor
      ? // eslint-disable-next-line no-undef
        new THREE.Vector4(
          rgbColor.r / 255,
          rgbColor.g / 255,
          rgbColor.b / 255,
          0.7
        )
      : // eslint-disable-next-line no-undef
        new THREE.Vector4(1, 0, 0, 0);
  },

  async getReferenceObject(roomId) {
    const info = SpinalGraphService.getInfo(roomId);
    let references = [];

    if (info && info.type.get() === BIM_OBJECT_TYPE) {
      references = [info];
    } else {
      references = await SpinalGraphService.getChildren(roomId, [
        REFERENCE_OBJECT_RELATION_NAME,
      ]);
    }

    const bims = references.map((el) => el.get());

    const bimMap = new Map();

    for (const bimObject of bims) {
      const bimFileId = bimObject.bimFileId;
      const dbid = bimObject.dbid;

      if (typeof bimMap.get(bimFileId) === "undefined") {
        bimMap.set(bimFileId, new Set());
      }

      bimMap.get(bimFileId).add(dbid);
    }

    const res = [];

    for (const [key, value] of bimMap.entries()) {
      res.push({
        model: window.spinal.BimObjectService.getModelByBimfile(key),
        ids: Array.from(value),
      });
    }

    return res;
  },

  getGroupType(contextType) {
    return contextType.replace(/GroupContext$/, "");
  },

  async consumeBatch(promises,batchSize = 10) {
    let index = 0;
    const result = {fulfilled: [], failed: []};

    while (index < promises.length) {
      let endIndex = index + batchSize;
      if (promises.length <= endIndex) endIndex = promises.length;
      const slice = promises.slice(index, endIndex);
      // const resProm = await Promise.all(slice.map((e) => e()));
      // result.push(...resProm);
      const {fulfilled, failed} = await this.getPromiseResult(
        slice.map((e) => e())
      );
      result.fulfilled.push(...fulfilled);
      result.failed.push(...failed);

      index = endIndex;
    }
    return result;
  },

  getPromiseResult(liste) {
    return Promise.allSettled(liste).then((result) => {
      const obj = {fulfilled: [], failed: []};

      for (const {status, value} of result) {
        if (status === 'fulfilled') obj.fulfilled.push(value);
        else obj.failed.push(value);
      }
      return obj;
    });
  }
};
