import * as THREE from 'three';

/**
 * 地面クラス
 */
export default class Plane extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // グリッドヘルパー
    const gridHelper = new THREE.GridHelper(20, 10, 0xFFFFFF, 0xFFFFFF);
    this.add(gridHelper);

    // Axisヘルパー
    const axisHelper = new THREE.AxesHelper(5);
    this.add(axisHelper);
  }

}
