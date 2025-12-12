import { AdditiveBlending, MathUtils, Sprite, SpriteMaterial, Texture, Vector3 } from "three";
import { getTimeRatio } from "./TimerModel";

/**
 * パーティクルのクラスです。
 */
export class Particle extends Sprite {
  /** フレーム毎にカウントされる値です。 */
  private _counter = 0;
  /** パーティクルの速度です。 */
  private _velocity: Vector3 | null = null;

  /** ライフポイント */
  private _lifePoint: number | null = null;
  /** 生きているかどうか */
  isAlive = false;
  /** カウントのインクリメント数 */
  private _incrementCountNum?: number;
  /** 最大スケール */
  private _maxScale: number | null = null;

  /**
   * コンストラクターです。
   */
  constructor(texture: Texture, color: number = 0x88ccff) {
    super(
      new SpriteMaterial({
        color: color,
        map: texture,
        transparent: true,
        blending: AdditiveBlending,
      }),
    );
  }

  /**
   * ポジションを戻します。
   */
  init(radius: number, angle: number) {
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.sin(rad);
    const y = 4 * Math.sin(rad * 0.3);
    const z = radius * Math.cos(rad);
    this.position.set(x, y, z);

    this._maxScale = Math.random() * 1.5 + 0.5;
    this.scale.set(0, 0, 0);
    this._velocity = new Vector3(
      MathUtils.randFloat(-0.07, 0.07),
      MathUtils.randFloat(0.03, 0.08),
      MathUtils.randFloat(-0.07, 0.07),
    );
    this.material.opacity = 1;
    this.isAlive = true;

    this._lifePoint = Math.random() * 50 + 10;
    this._counter = 0;
    this._incrementCountNum = Math.random() * 0.5 + 0.2;
  }

  /**
   * フレーム毎に更新をかけます。
   */
  update() {
    if (
      this._incrementCountNum == null ||
      this._velocity == null ||
      this._maxScale == null ||
      this._lifePoint == null
    ) {
      return;
    }

    const timeRatio = getTimeRatio();
    this._counter += this._incrementCountNum * timeRatio;
    this.position.add(this._velocity.clone().multiplyScalar(timeRatio));
    this.material.opacity -= 0.009 * timeRatio;

    const rad = Math.sin((this._counter * 30 * Math.PI) / 180);
    const scale = this._maxScale * rad;
    this.scale.set(scale, scale, scale);

    if (this._lifePoint < this._counter) {
      this.isAlive = false;
    }
  }
}
