import { PerspectiveCamera, Vector3 } from 'three';
import TimerModel from './TimerModel';

/**
 * カメラのクラスです。
 */
export default class Camera extends PerspectiveCamera {
  /** アニメーションに用いる角度の値です。 */
  private _angle: number = 0;
  /** アニメーションの円軌道の半径です。 */
  private _radius: number = 25;

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1, 1000);

    this.position.set(this._radius, 10, 0);
  }

  /**
   * 回転させます。
   */
  public rotate() {
    this._angle -= 0.1 * TimerModel.getInstance().getTimeRatio();
  }

  /**
   * 毎フレームの更新をかけます。
   */
  public update() {
    let lad = (this._angle * Math.PI) / 180;
    this.position.x = this._radius * Math.sin(lad);
    this.position.z = this._radius * Math.cos(lad);
    this.lookAt(new Vector3(0, 1.5, 0));
  }
}
