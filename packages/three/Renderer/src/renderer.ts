import * as THREE from 'three';
import { getThreeContext } from '../../hooks/useThree';
export interface IRendererProps {
  /**
   * webglrender参数
   * antialias：抗锯齿 =》关闭浏览器内置 MSAA，省一次全屏 Resolve；后处理 AA（FXAA/TAA/SMAA）往往更省。
   * alpha：canvas 是否包含 alpha（透明度）缓冲区；为 true 时默认清除 alpha = 0。=》不需要透明背景时，省掉 8-bit alpha；带宽
   * premultipliedAlpha：是否假设颜色已经预乘
   * stencil:是否创建 ≥8 bit 模板缓冲区=》不用 Mask/Shadow Volume 时关闭模板
   * powerPreference 性能/功耗提示（仅作建议）'default' | 'high-performance' | 'low-power'=》 笔记本切集显，低功耗
   * preserveDrawingBuffer 保留绘图缓冲区直到手动清除（截屏需要）
   * failIfMajorPerformanceCaveat 若设备性能太差，直接失败而非降级
   * depth 是否创建 ≥16 bit 深度缓冲区=>场景里只用 2D 或后处理渲染，可省深度缓冲
   * logarithmicDepthBuffer 启用对数深度缓冲，解决大比例场景 Z-fighting
   */
  parameters?: THREE.WebGLRendererParameters,
  //染器的像素比
  pixelRatio?: number,
  /**
   * 高级色调映射
   * -设置高动态范围（HDR）场景颜色映射到标准显示器能表现的低动态范围（LDR）
   * THREE.NoToneMapping 不压缩，直出	=>调试、纯 LDR 场景
   * 
   * THREE.LinearToneMapping	简单线性缩放=>快速预览、UI
   * THREE.ReinhardToneMapping	柔和压缩高亮，保暗部=>游戏、实时渲染
   * THREE.CineonToneMapping	胶片 LUT，对比高=>电影感、动画
   * THREE.ACESFilmicToneMapping	电影工业 ACES，对比+饱和度=>产品展示、HDR 全景
   * THREE.AgXToneMapping	新版，亮部更自然=>摄影模拟、建筑可视化
   * THREE.NeutralToneMapping	中性、低对比=>需要保留原色的科学可视化
   * 
   * HDR 环境贴图（.hdr / .exr）+ ACESFilmicToneMapping 最常用组合
   */
  toneMapping?: 'NoToneMapping' | 'LinearToneMapping' | 'ReinhardToneMapping' | 'CineonToneMapping' | 'ACESFilmicToneMapping' | 'AgXToneMapping' | 'NeutralToneMapping',
  /**
   * 额外曝光系数
   */
  toneMappingExposure?: number,
  /**
   * 阴影
   * enabled :设为 false 则所有光源投射阴影的代码都会被跳过，立即省一帧
   * type:阴影类型（PCF、VSM、ESM）
   *      THREE.BasicShadowMap    硬阴影，1 次采样	     ★★★★★	最低档
   *      THREE.PCFShadowMap     (默认)	2×2 PCF，软阴影	 ★★★☆	  平衡
   *      THREE.PCFSoftShadowMap	改进 PCF，更柔	       ★★☆	   推荐
   *      THREE.VSMShadowMap	    方差阴影，无锯齿	      ★★	    需 blur 调参
   *      THREE.ESMShadowMap	    指数阴影	             ★	      高光场景易漏光
   * 移动端直接 PCFSoftShadowMap；需要超软阴影再选 VSM/ESM。
   * mapSize:阴影贴图分辨率
   * autoUpdate：静态场景只更新一次=》renderer.shadowMap.needsUpdate = true 手动触发
   * camera.near / far / left / right / top / bottom 收紧包围盒，提高阴影精度=》越小越好，但要包住被照物体
   * bias消除阴影痤疮（acne）=》通常 0.0001 – 0.005
   * radius 软阴影模糊半径=》1–3 较大更柔，但会漏光
   * blurSamples (VSM/ESM)模糊采样数=》3–8，越大越 GPU 重
   */
  shadowMap?: THREE.WebGLShadowMap,
  bgColor?: THREE.ColorRepresentation;
  bgAlpha?: number;
}
export function useRenderer(props: IRendererProps) {
  let renderer = new THREE.WebGLRenderer(props.parameters)
  //设置像素比
  props.pixelRatio && (renderer.setPixelRatio(props.pixelRatio))
  //设置高级色调映射
  props.toneMapping && (renderer.toneMapping = THREE[props.toneMapping])

  props.toneMappingExposure && (renderer.toneMappingExposure = props.toneMappingExposure)
  //阴影
  props.shadowMap && (renderer.shadowMap = props.shadowMap)
  //背景色
  props.bgColor && (renderer.setClearColor(props.bgColor, props.bgAlpha || 1)) //设置背景颜色

  const _context = getThreeContext();
  _context.renderer = renderer;

  //挂载到初始化方法上
  _context.initMounted.push(() => {
    if (_context.container && _context.renderer) {
      //设置canvas的大小
      _context.renderer.setSize(_context.container.clientWidth, _context.container.clientHeight);
      _context.container.appendChild(_context.renderer.domElement);
      _context.reloadRender()
    }
  })

  //挂载到AnimationLoop上
  _context.loopMounted.push(() => {
    _context.reloadRender()
  })

  //自适应更新
  _context.resizeMounted.push(() => {
    if (_context.container && _context.renderer) {
      _context.renderer.setSize(_context.container.clientWidth, _context.container.clientHeight);
    }
    _context.reloadRender()
  })
}
