import { AxesHelper, GridHelper, Object3D } from "three";

/**
 * 地面クラス
 */
export class Plane extends Object3D {
  constructor() {
    super();

    // グリッドヘルパー
    const gridHelper = new GridHelper(20, 10, 0xffffff, 0xffffff);
    this.add(gridHelper);

    // Axisヘルパー
    const axisHelper = new AxesHelper(5);
    this.add(axisHelper);
  }
}
