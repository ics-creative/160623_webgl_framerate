import { EventDispatcher } from 'three';
import GUI from 'lil-gui';

/**
 * lilGuiクラスです。
 */
export default class LilGui extends EventDispatcher {
  private static _instance: LilGui;

  /**
   * インスタンスを取得します。
   */
  public static getInstance(): LilGui {
    return LilGui._instance || new LilGui();
  }

  /** gui */
  private _gui: GUI;

  /** pixelRatio */
  public pixelRatio: number = window.devicePixelRatio;

  /** パーティクルの数 */
  public particleNum = 500;

  /** パーティクルの最大数 */
  public particleMaxNum = 4000;

  /** FPSを30にする */
  public fps30: boolean = false;

  /** timeRatioの有無 */
  public timeRatioMode: boolean = false;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    this._gui = new GUI();

    // pixelRatio
    const pixelRatioRow = this._gui.add(this, 'pixelRatio', 0.5, 3.0).step(0.5);
    pixelRatioRow.onChange(() => {
      this._onChangePixelRatio();
    });

    // パーティクルの数
    const particleNumRow = this._gui.add(
      this,
      'particleNum',
      100,
      this.particleMaxNum
    );
    particleNumRow.onChange(() => {
      this._onChangeParticleNum();
    });

    // FPSを30に
    const fps30Row = this._gui.add(this, 'fps30');
    fps30Row.onChange(() => {
      this._onChangeFps30();
    });

    // FPSを30に
    const timeRatioRow = this._gui.add(this, 'timeRatioMode');
    timeRatioRow.onChange(() => {
      this._onChangeTimeRatioMode();
    });

    LilGui._instance = this;
  }

  /**
   * pixelRatioが変更された時のハンドラーです。
   */
  protected _onChangePixelRatio(): void {
    // イベントを発火
    this.dispatchEvent({ type: 'changePixelRatio' });
  }

  /**
   * パーティクル数が変更された時のハンドラーです。
   */
  protected _onChangeParticleNum(): void {
    // イベントを発火
    this.dispatchEvent({ type: 'changeParticleNum' });
  }

  /**
   * FPS30モードの切替え時のハンドラーです。
   */
  protected _onChangeFps30(): void {
    // イベントを発火
    this.dispatchEvent({ type: 'changeFps30' });
  }

  /**
   * FPS30モードの切替え時のハンドラーです。
   */
  protected _onChangeTimeRatioMode(): void {
    // イベントを発火
    this.dispatchEvent({ type: 'changeTimeRatioMode' });
  }
}
