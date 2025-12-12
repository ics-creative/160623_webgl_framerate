import LilGui from "./LilGui";

/**
 * タイマー周りのモデルクラスです。
 */
export default class TimerModel {
  /** インスタンス **/
  private static _instance: TimerModel;
  public static getInstance(): TimerModel {
    return TimerModel._instance || new TimerModel();
  }

  /** 現在時刻 */
  private _time: number = 0;

  /** 時間経過比率 */
  private _timeRatio: number = 1;

  public getTimeRatio(): number {
    return this._timeRatio;
  }

  /**
   * コンストラクタ
   */
  constructor() {
    TimerModel._instance = this;
  }

  /**
   * 時間経過比率をアップデート
   */
  public updateTimeRatio(): void {
    if (!LilGui.getInstance().timeRatioMode) {
      this._timeRatio = 1;
      // 現在時間をセット
      this._time = new Date().getTime();
      return;
    }

    const lastTime: number = this._time;
    if (lastTime > 0) {
      // 1フレーム当たりの時間(ミリ秒)
      const FPS_60_SEC = 1000 / 60;
      // 差分時間をセット
      const dTime = new Date().getTime() - lastTime;
      // FPS60との比較係数をセット
      this._timeRatio = dTime / FPS_60_SEC;
    } else {
      // レース開始後の1フレーム目はセットしない
      this._timeRatio = 1;
    }

    // 現在時間をセット
    this._time = new Date().getTime();
  }
}
