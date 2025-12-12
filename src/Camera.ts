import { PerspectiveCamera, Vector3 } from "three";
import { getTimeRatio } from "./TimerModel";

/**
 * カメラのクラスです。
 */
export class Camera extends PerspectiveCamera {
  /** アニメーションに用いる角度の値です。 */
  private _angle: number = 0;
  /** アニメーションの円軌道の半径です。 */
  private _radius: number = 25;

  /**
   * コンストラクターです。
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1, 1000);

    this.position.set(this._radius, 10, 0);
  }

  /**
   * 回転させます。
   */
  public rotate() {
    this._angle -= 0.1 * getTimeRatio();
  }

  /**
   * 毎フレームの更新をかけます。
   */
  public update() {
    const lad = (this._angle * Math.PI) / 180;
    this.position.x = this._radius * Math.sin(lad);
    this.position.z = this._radius * Math.cos(lad);
    this.lookAt(new Vector3(0, 1.5, 0));
  }
}
