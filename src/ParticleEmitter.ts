import { Object3D, Texture, TextureLoader } from 'three';
import Particle from './Particle';
import LilGui from './LilGui';
import TimerModel from './TimerModel';

/**
 * パーティクルエミッタークラスです。
 */
export default class ParticleEmitter extends Object3D {
  /** テクスチャ */
  private _texture: Texture;
  /** datGui */
  private _datGui: LilGui;
  /** 生成するパーティクルの数です。 */
  private _particleNum: number;
  /** パーティクルを発生させる間隔です。 */
  private _interval: number = 15;
  /** 角度 */
  private _angle: number = 0;
  /** 半径 */
  private _radius: number = 5;
  /** カラー配列 */
  private _colorList: number[] = [0x88ccff, 0xffffdd, 0x44eeff];

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super();
    this._datGui = LilGui.getInstance();
    this._datGui.addEventListener('changeParticleNum', (event:Event) =>
      this._onChangeParticleNum(event)
    );

    this._particleNum = this._datGui.particleNum;

    //テクスチャ読み込み
    const loader = new TextureLoader();
    loader.load('./assets/texture/particle.png', (texture: Texture) => {
      this._texture = texture;
    });
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
    const incrementNumber = 7 * TimerModel.getInstance().getTimeRatio();
    this._angle += incrementNumber;

    // 死んだパーティクルの数を把握する
    let notAliveNum = 0;
    this.children.forEach((particle: Particle) => {
      if (!particle.isAlive) {
        notAliveNum++;
      }
    });

    let initNum = 0;
    // パーティクルを数分更新
    this.children.forEach((particle: Particle, index: number) => {
      if (particle.isAlive) {
        particle.update();
      } else {
        particle.init(
          this._radius,
          this._angle - (incrementNumber / notAliveNum) * initNum
        );
        initNum++;
      }

      let perLegnth = Math.floor(
        this._datGui.particleMaxNum / this._particleNum
      );
      if (index % perLegnth === 0) {
        particle.visible = true;
      } else {
        particle.visible = false;
      }
    });

    if (this.children.length < this._datGui.particleMaxNum) {
      for (let i = 0; i < 10; i++) {
        this._addParticle();
      }
    }
  }

  /**
   * パーティクルを追加します。
   */
  private _addParticle() {
    if (this.children.length > this._datGui.particleMaxNum) {
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
  // protected _onChangeParticleNum(event): void {
  protected _onChangeParticleNum(event: Event): void {
    this._particleNum = this._datGui.particleNum;
  }
}
