import { Object3D, Texture, TextureLoader } from "three";
import Particle from "./Particle";
import LilGui from "./LilGui";
import { getTimeRatio } from "./TimerModel";
import ImgParticle from "./particle.png";
/**
 * パーティクルエミッタークラスです。
 */
export default class ParticleEmitter extends Object3D {
  /** テクスチャ */
  private _texture?: Texture;
  /** datGui */
  private _lilGui: LilGui;
  /** 生成するパーティクルの数です。 */
  private _particleNum: number;
  /** 角度 */
  private _angle: number = 0;
  /** 半径 */
  private _radius: number = 5;
  /** カラー配列 */
  private _colorList: number[] = [0x88ccff, 0xffffdd, 0x44eeff];

  /**
   * コンストラクターです。
   */
  constructor() {
    super();

    this._lilGui = LilGui.getInstance();

    this._lilGui.addEventListener("changeParticleNum", () => this._onChangeParticleNum());

    this._particleNum = this._lilGui.particleNum;

    //テクスチャ読み込み
    const loader = new TextureLoader();
    this._texture = loader.load(ImgParticle);
  }

  /**
   * フレーム毎に更新をかけます。
   */
  public update() {
    // テクスチャが用意できていなければ処理しない
    if (!this._texture) {
      return;
    }

    // 角度をインクリメント
    const incrementNumber = 7 * getTimeRatio();
    this._angle += incrementNumber;

    // 死んだパーティクルの数を把握する
    let notAliveNum = 0;
    const items = this.children as Particle[];
    items.forEach((particle) => {
      if (!particle.isAlive) {
        notAliveNum++;
      }
    });

    let initNum = 0;
    // パーティクルを数分更新
    items.forEach((particle, index) => {
      if (particle.isAlive) {
        particle.update();
      } else {
        particle.init(this._radius, this._angle - (incrementNumber / notAliveNum) * initNum);
        initNum++;
      }

      const perLength = Math.floor(this._lilGui.particleMaxNum / this._particleNum);
      if (index % perLength === 0) {
        particle.visible = true;
      } else {
        particle.visible = false;
      }
    });

    if (this.children.length < this._lilGui.particleMaxNum) {
      for (let i = 0; i < 10; i++) {
        this._addParticle();
      }
    }
  }

  /**
   * パーティクルを追加します。
   */
  private _addParticle(): void {
    if (this.children.length > this._lilGui.particleMaxNum) {
      return;
    }
    if (!this._texture) {
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
  protected _onChangeParticleNum(): void {
    this._particleNum = this._lilGui.particleNum;
  }
}
