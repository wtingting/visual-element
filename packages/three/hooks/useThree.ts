import { inject } from 'vue';
import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

export const threeContextKey = Symbol('threeContextKey');

export interface IThreeCtx {
  container: HTMLElement | null,
  scene: THREE.Scene | null;
  camera: any;
  renderer: THREE.WebGLRenderer | null;
  controls?: OrbitControls;
  gui:GUI|null;
  //待执行应用池
  initMounted: Function[];
  //循环应用池Manual
  loopMounted: Function[];
  //调整大小应用池
  resizeMounted: Function[];
  //销毁应用池
  disposeMounted: Function[];
  reloadRender:()=>void,
  loaderModal?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, complete: (gltf: GLTF | null) => void) => void;
}

export function getThreeContext() {
  return inject(threeContextKey) as IThreeCtx;
}
