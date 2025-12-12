import LilGui from "./LilGui";

/** 現在時刻 */
let _time: number = 0;

/** 時間経過比率 */
let _timeRatio: number = 1;

/**
 * 時間経過比率を取得します。
 */
export function getTimeRatio(): number {
  return _timeRatio;
}

/**
 * 時間経過比率をアップデートします。
 */
export function updateTimeRatio(): void {
  if (!LilGui.getInstance().timeRatioMode) {
    _timeRatio = 1;
    // 現在時間をセット
    _time = new Date().getTime();
    return;
  }

  const lastTime: number = _time;
  if (lastTime > 0) {
    // 1フレーム当たりの時間(ミリ秒)
    const FPS_60_SEC = 1000 / 60;
    // 差分時間をセット
    const dTime = new Date().getTime() - lastTime;
    // FPS60との比較係数をセット
    _timeRatio = dTime / FPS_60_SEC;
  } else {
    // レース開始後の1フレーム目はセットしない
    _timeRatio = 1;
  }

  // 現在時間をセット
  _time = new Date().getTime();
}
