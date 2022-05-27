import { Scene, WebGLRenderer } from 'three';
import Camera from './Camera';
import Plane from './Plane';
import ParticleEmitter from './ParticleEmitter';
import LilGui from './LilGui';
import TimerModel from './TimerModel';

import { detectGpuDriver } from './DetectGpuDriver';

declare class Stats {
  dom: any;
  begin();
  end();
}

window.addEventListener('DOMContentLoaded', () => {
  new Main();
});

document.addEventListener(
  'touchmove',
  function(e) {
    if (window.innerHeight >= document.body.scrollHeight) {
      e.preventDefault();
    }
  },
  false
);

/**
 * デモのメインクラスです。
 */
class Main {
  /** シーンオブジェクトです。 */
  private readonly _scene: Scene;
  /** カメラオブジェクトです。 */
  private readonly _camera: Camera;
  /** 地面オブジェクトです。 */
  private readonly _plane: Plane;
  /** レンダラーオブジェクトです。 */
  private _renderer: WebGLRenderer;
  /** FPS表示 */
  private _stats: Stats;
  /** canvasを追加するDOM */
  private _renderDom: HTMLDivElement;
  /** パーティクルエミッター */
  private readonly _particleEmitter: ParticleEmitter;
  /** lilGui */
  private _lilGui: LilGui;

  /** フレームカウント */
  private _frame: number = 0;
  /** カメラの移動向き */
  private _moveDirection: string;

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    // lilGui
    this._lilGui = LilGui.getInstance();
    this._onChangePixelRatio = this._onChangePixelRatio.bind(this);
    this._lilGui.addEventListener('changePixelRatio', this._onChangePixelRatio);

    // 左上に表示するようCSSを記述してbody直下に表示
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);

    // シーン
    this._scene = new Scene();

    // カメラ
    this._camera = new Camera();

    // レンダラー
    this._renderDom = <HTMLDivElement>document.getElementById('renderCanvas');
    this._renderer = new WebGLRenderer({ antialias: true });
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(this._lilGui.pixelRatio);
    this._resize();
    this._renderDom.appendChild(<HTMLElement>this._renderer.domElement);

    // パーティクルエミッター
    this._particleEmitter = new ParticleEmitter();
    this._scene.add(this._particleEmitter);

    // 地面
    this._plane = new Plane();
    this._scene.add(this._plane);

    // リサイズを監視
    window.addEventListener('resize', event => {
      this._onResize(event);
    });

    // ドライバーの名前を画面左下に表示
    const driver = detectGpuDriver();

    document.querySelector('h1').innerHTML = `Your GPU Driver : ${driver}`;

    // 毎フレームの更新
    this._tick();
  }

  /**
   * フレーム毎のアニメーションの更新をかけます。
   */
  private _tick(): void {
    requestAnimationFrame(() => {
      this._tick();
    });

    // フレームカウントをインクリメント
    this._frame++;

    // カメラの更新
    this._camera.rotate();
    this._camera.update();

    // エミッターを更新
    this._particleEmitter.update();

    // 時間比率を更新
    TimerModel.getInstance().updateTimeRatio();

    // FPSを30に
    if (this._lilGui.fps30 && this._frame % 2) {
      return;
    }

    // Statsの計測を開始
    this._stats.begin();
    // 描画
    this._renderer.render(this._scene, this._camera);
    // Statsの計測終了
    this._stats.end();
  }

  /**
   * リサイズ時のハンドラーです。
   */
  protected _onResize(event: Event): void {
    this._resize();
  }

  /**
   * リサイズ処理
   */
  private _resize() {
    const width = this._renderDom.clientWidth;
    const height = this._renderDom.clientHeight;
    this._renderer.domElement.setAttribute('width', String(width));
    this._renderer.domElement.setAttribute('height', String(height));
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }

  /**
   * PixelRatio変更時のハンドラーです。
   */
  private _onChangePixelRatio() {
    this._renderer.setPixelRatio(this._lilGui.pixelRatio);
  }
}