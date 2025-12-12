import { EventDispatcher } from "three";
import GUI from "lil-gui";

/**
 * lilGuiクラスです。
 */
class LilGui extends EventDispatcher {
  /** gui */
  private readonly _gui: GUI;

  /** pixelRatio */
  pixelRatio: number = window.devicePixelRatio;

  /** パーティクルの数 */
  particleNum = 500;

  /** パーティクルの最大数 */
  particleMaxNum = 8000;

  /** FPSを30にする */
  fps30 = false;

  /** timeRatioの有無 */
  timeRatioMode = false;

  constructor() {
    super();

    this._gui = new GUI();

    // pixelRatio
    const pixelRatioRow = this._gui.add(this, "pixelRatio", 0.5, 3.0).step(0.5);
    pixelRatioRow.onChange(() => {
      this._onChangePixelRatio();
    });

    // パーティクルの数
    const particleNumRow = this._gui.add(
      this,
      "particleNum",
      100,
      this.particleMaxNum,
      // パーティクルの個数は整数とする
      1,
    );
    particleNumRow.onChange(() => {
      this._onChangeParticleNum();
    });

    // FPSを30に
    const fps30Row = this._gui.add(this, "fps30");
    fps30Row.onChange(() => {
      this._onChangeFps30();
    });

    // timeRatioMode
    const timeRatioRow = this._gui.add(this, "timeRatioMode");
    timeRatioRow.onChange(() => {
      this._onChangeTimeRatioMode();
    });
  }

  /**
   * pixelRatioが変更された時のハンドラーです。
   */
  private _onChangePixelRatio() {
    // イベントを発火
    this.dispatchEvent({ type: "changePixelRatio" });
  }

  /**
   * パーティクル数が変更された時のハンドラーです。
   */
  private _onChangeParticleNum() {
    // イベントを発火
    this.dispatchEvent({ type: "changeParticleNum" });
  }

  /**
   * FPS30モードの切替え時のハンドラーです。
   */
  private _onChangeFps30() {
    // イベントを発火
    this.dispatchEvent({ type: "changeFps30" });
  }

  /**
   * timeRatioModeの切替え時のハンドラーです。
   */
  private _onChangeTimeRatioMode() {
    // イベントを発火
    this.dispatchEvent({ type: "changeTimeRatioMode" });
  }
}

// モジュールスコープで1つのインスタンスを作成してエクスポート
export const lilGui = new LilGui();
