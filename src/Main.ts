import { Scene, WebGLRenderer } from "three";
import { Camera } from "./Camera";
import { Plane } from "./Plane";
import { ParticleEmitter } from "./ParticleEmitter";
import { lilGui } from "./LilGui";
import { updateTimeRatio } from "./TimerModel";
import Stats from "stats-gl";

import { detectGpuDriver } from "./DetectGpuDriver";

document.addEventListener("touchmove", (e) => {
  if (window.innerHeight >= document.body.scrollHeight) {
    e.preventDefault();
  }
});

// フレームカウント
let frame = 0;

/**
 * PixelRatio変更時のハンドラーです。
 */
const onChangePixelRatio = () => {
  renderer.setPixelRatio(lilGui.pixelRatio);
};

/**
 * リサイズ処理
 */
const resize = () => {
  const width = renderDom.clientWidth;
  const height = renderDom.clientHeight;
  renderer.domElement.setAttribute("width", String(width));
  renderer.domElement.setAttribute("height", String(height));
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

/**
 * リサイズ時のハンドラーです。
 */
const onResize = () => {
  resize();
};

/**
 * フレーム毎のアニメーションの更新をかけます。
 */
const tick = () => {
  requestAnimationFrame(() => {
    tick();
  });

  // フレームカウントをインクリメント
  frame++;

  // カメラの更新
  camera.rotate();
  camera.update();

  // エミッターを更新
  particleEmitter.update();

  // 時間比率を更新
  updateTimeRatio();

  // FPSを30に
  if (lilGui.fps30 && frame % 2) {
    return;
  }

  // Statsの計測を開始
  stats.begin();
  // 描画
  renderer.render(scene, camera);
  // Statsの計測終了と更新
  stats.end();
  stats.update();
};

// 初期化処理（top-level await使用）
await new Promise<void>((resolve) => {
  window.addEventListener("DOMContentLoaded", () => {
    resolve();
  });
});

// lilGui
lilGui.addEventListener("changePixelRatio", onChangePixelRatio);

// シーン
const scene = new Scene();

// カメラ
const camera = new Camera();

// レンダラー
const renderDom = document.getElementById("renderCanvas") as HTMLDivElement;
const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(lilGui.pixelRatio);
resize();
renderDom.appendChild(renderer.domElement);

// Stats（FPS表示）- WebGL用のモダンなStats
const stats = new Stats({
  trackGPU: true,
  trackHz: true,
  trackCPT: true,
});
document.body.appendChild(stats.dom);
// Three.jsレンダラーと統合
stats.init(renderer);

// パーティクルエミッター
const particleEmitter = new ParticleEmitter();
scene.add(particleEmitter);

// 地面
const plane = new Plane();
scene.add(plane);

// リサイズを監視
window.addEventListener("resize", onResize);

// ドライバーの名前を画面左下に表示
const el = document.querySelector<HTMLElement>("h1");
if (el) {
  el.textContent = `Your GPU Driver : ${detectGpuDriver()}`;
}

// 毎フレームの更新
tick();
