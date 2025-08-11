import { onMounted, inject } from 'vue';
import { threeContextKey, type IThreeCtx } from '../../hooks/useThree';
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export interface IControlProps {
  //缩放近限制
  minDistance?: number,
  //缩放远限制
  maxDistance?: number,
  //相机“看”的点；随时读写即可瞬间切换视角
  target?: {
    x: number,
    y: number,
    z: number
  },
  //开启惯性阻尼（丝滑滑动）
  enableDamping?: boolean,
  //阻尼系数，0~1，越小越慢
  dampingFactor?: number,
  //相机自动绕 Y 轴旋转
  autoRotate?: boolean,
  //转速（弧度/秒）
  autoRotateSpeed?: number,
}
export function useControls(props: IControlProps) {
  onMounted(() => {
    const context = inject(threeContextKey) as IThreeCtx;
    context.initMounted?.push(() => {
      const controls = new OrbitControls(context.camera, context.renderer?.domElement)
      // 限制缩放范围
      props.minDistance && (controls.minDistance = props.minDistance)
      props.maxDistance && (controls.maxDistance = props.maxDistance)
      props.target && (controls.target.set(props.target.x, props.target.y, props.target.z))

      //- 拖拽惯性
      props.enableDamping && (controls.enableDamping = props.enableDamping)
      props.dampingFactor && (controls.dampingFactor = props.dampingFactor)
      props.autoRotate && (controls.autoRotate = props.autoRotate)
      props.autoRotateSpeed && (controls.autoRotateSpeed = props.autoRotateSpeed)
      // 配置参数
      controls.update()
      context.controls=controls

      context.loopMounted.push(() => {
        controls.update()
      })
    })
  });

  return {

  };
}
