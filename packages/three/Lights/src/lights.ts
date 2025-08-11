import * as THREE from 'three';
import { getThreeContext } from '../../hooks/useThree';
import { markRaw } from 'vue';
export interface ILight {
  intensity?: number,
  unMounted?: boolean
}
/**
 * 环境光
 * 无方向性，均匀照亮所有物体，不支持阴影
 */
export interface IAmbientLightProps extends ILight {
  color?: THREE.ColorRepresentation,
}
/**
 * 平行光
 * 模拟太阳光，光线平行，支持阴影
 */
export interface IDirectionalProps extends ILight {
  color?: THREE.ColorRepresentation,
  position?: { x: number, y: number, z: number },
  target?: { x: number, y: number, z: number },
  shadow?: THREE.DirectionalLightShadow,
  isHelper?: boolean
}
/**
 * 点光源
 * 模拟点光源（如灯泡），支持阴影
 */
export interface IPointLightProps extends ILight {
  color?: THREE.ColorRepresentation,
  distance?: number,
  decay?: number,
  position?: { x: number, y: number, z: number },
  shadow?: any,
  isHelper?: boolean
}
/**
 * 聚光灯
 * 模拟聚光灯，支持阴影
 */
export interface ISpotLightProps extends ILight {
  color?: THREE.ColorRepresentation,
  distance?: number,
  angle?: number,
  penumbra?: number,
  decay?: number,
  position?: { x: number, y: number, z: number },
  target?: { x: number, y: number, z: number },
  shadow?: any,
  isHelper?: boolean
}
/**
 * 半球光
 * 模拟户外自然光，不支持阴影。
 */
export interface IHemisphereLightProps extends ILight {
  skyColor?: THREE.ColorRepresentation,
  groundColor?: THREE.ColorRepresentation,
  helperSize?:number,
  isHelper?: boolean
}
/**
 * 矩形区域光
 * 模拟矩形面光源（如窗户光），不支持阴影。
 */
export interface IRectAreaLightProps extends ILight {
  color?: THREE.ColorRepresentation,
  width?: number,
  height?: number,
  position?: { x: number, y: number, z: number },

}
/**
 * 漫反射光照
 * 用于环境光照探针，通常与 HDR 贴图配合使用
 */
export interface ILightProbeProps extends ILight {
  sh?: THREE.SphericalHarmonics3,
}
export function useAmbientLight(props: IAmbientLightProps) {
  const light = new THREE.AmbientLight(props.color, props.intensity);
  return _addLight(light, props.unMounted)
}
export function useDirectionalLight(props: IDirectionalProps) {
  const light = new THREE.DirectionalLight(props.color, props.intensity);
  if (props.position)
    light.position.set(props.position.x, props.position.y, props.position.z);

  if (props.shadow) {
    light.castShadow = true; // Enable shadow casting
    for (let key of Object.keys(props.shadow)) {
      // if (directionalLight.shadow.co)
      //   directionalLight.shadow[key] = props.shadow[key]; // Default 512

    }
  }
  let helper: any = null;
  if (props.isHelper)
    helper = new THREE.DirectionalLightHelper(light)
  return _addLight(light, props.unMounted, helper)
}
export function usePointLight(props: IPointLightProps) {
  const light = new THREE.PointLight(props.color, props.intensity, props.distance, props.decay);
  if (props.position)
    light.position.set(props.position.x, props.position.y, props.position.z);
  let helper: any = null;
  if (props.isHelper)
    helper = new THREE.PointLightHelper(light)
  return _addLight(light, props.unMounted, helper)
}
export function useSpotLight(props: ISpotLightProps) {
  const light = new THREE.SpotLight(props.color, props.intensity, props.distance, props.angle, props.penumbra, props.decay);
  let helper: any = null;
  if (props.isHelper)
    helper = new THREE.SpotLightHelper(light)
  return _addLight(light, props.unMounted,helper)
}
export function useHemisphereLight(props: IHemisphereLightProps) {
  const light = new THREE.HemisphereLight(props.skyColor, props.groundColor, props.intensity);
   let helper: any = null;
  if (props.isHelper)
    helper = new THREE.HemisphereLightHelper(light,props.helperSize||5)
  return _addLight(light, props.unMounted,helper)
}
export function useRectAreaLight(props: IRectAreaLightProps) {
  const light = new THREE.RectAreaLight(props.color, props.intensity, props.width, props.height);
  return _addLight(light, props.unMounted)
}
export function useLightProbe(props: ILightProbeProps) {
  const light = new THREE.LightProbe(props.sh, props.intensity);
  return _addLight(light, props.unMounted)
}
function _addLight(light: any, unMounted: boolean = true, helper?: any) {
  if (!unMounted) {
    const _context = getThreeContext()
    _context.initMounted.push(() => {
      if (!_context.scene)
        return;
      _context.scene.add(light)
      helper && (_context.scene.add(markRaw(helper)))
    })
  }
  return { light }
}