import { Object3D, SRGBColorSpace, Texture, TextureLoader } from "three";
import { Particle } from "./Particle";
import { lilGui } from "./LilGui";
import { getTimeRatio } from "./TimerModel";
import ImgParticle from "./assets/particle.png";
/**
 * パーティクルエミッタークラスです。
 */
export class ParticleEmitter extends Object3D {
  /** テクスチャ */
  private readonly _texture: Texture;
  /** 生成するパーティクルの数です。 */
  private _particleNum: number;
  /** 角度 */
  private _angle = 0;
  /** 半径 */
  private _radius = 5;
  /** カラー配列 */
  private _colorList = [0x88ccff, 0xffffdd, 0x44eeff];

  /**
   * コンストラクターです。
   */
  constructor() {
    super();

    lilGui.addEventListener("changeParticleNum", () => this._onChangeParticleNum());

    this._particleNum = lilGui.particleNum;

    //テクスチャ読み込み
    const loader = new TextureLoader();
    this._texture = loader.load(ImgParticle);
    this._texture.colorSpace = SRGBColorSpace;
  }

  /**
   * フレーム毎に更新をかけます。
   */
  update() {
    // テクスチャが用意できていなければ処理しない
    if (!this._texture) {
      return;
    }

    // 角度をインクリメント
    const incrementNumber = 7 * getTimeRatio();
    this._angle += incrementNumber;

    // 死んだパーティクルの数を把握する
    const items = this.children as Particle[];
    const notAliveNum = items.filter((particle) => !particle.isAlive).length;

    let initNum = 0;
    // パーティクルを数分更新
    for (const [index, particle] of items.entries()) {
      if (particle.isAlive) {
        particle.update();
      } else {
        particle.init(this._radius, this._angle - (incrementNumber / notAliveNum) * initNum);
        initNum++;
      }

      const perLength = Math.floor(lilGui.particleMaxNum / this._particleNum);
      if (index % perLength === 0) {
        particle.visible = true;
      } else {
        particle.visible = false;
      }
    }

    if (this.children.length < lilGui.particleMaxNum) {
      for (let i = 0; i < 10; i++) {
        this._addParticle();
      }
    }
  }

  /**
   * パーティクルを追加します。
   */
  private _addParticle() {
    if (this.children.length > lilGui.particleMaxNum) {
      return;
    }
    const rand = Math.floor(Math.random() * 3);
    const color = this._colorList[rand];
    const particle = new Particle(this._texture, color);
    particle.visible = false;
    this.add(particle);
  }

  /**
   * パーティクル数変更時のハンドラーです。
   */
  private _onChangeParticleNum() {
    this._particleNum = lilGui.particleNum;
  }
}
