/**
 * GPUのドライバーの名前を取得する関数です。
 * @returns {string} ドライバーの名前です。
 * @author ICS-Ikeda
 * @since 2017-08-14
 */
export function detectGpuDriver(): string {
  const canvas = document.createElement('canvas');
  let gl;
  let renderer;
  try {
    gl = canvas.getContext('experimental-webgl');

    //ドライバー情報を取得
    const ext = gl.getExtension('WEBGL_debug_renderer_info');

    if (!ext) {
      renderer = '';
    } else {
      renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
    }
  } catch (e) {
    // WebGL未対応の場合
    gl = null;
    renderer = '';
  }

  // ドライバの種類を出力
  return renderer;
}
