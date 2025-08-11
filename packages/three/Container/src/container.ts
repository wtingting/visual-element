import { ref, onMounted, provide, reactive, onUnmounted, markRaw, type Reactive } from 'vue';
import * as THREE from 'three';
import { threeContextKey, type IThreeCtx } from '../../hooks/useThree';
import { GUI } from "three/addons/libs/lil-gui.module.min.js"
import Stats from 'three/addons/libs/stats.module.js';


export interface IThreeProps {
  isLoop?: boolean,
  isGui?: boolean,
  //Performance
  isStats?: boolean,
  autoRotate?: boolean,
  gridHelper: {
    size?: number,
    divisions?: number,
    color1?: THREE.ColorRepresentation,
    color2?: THREE.ColorRepresentation,
    opacity?: number
  } | boolean,
  axesHelper: boolean
}
export function useThree(props: IThreeProps) {
  const container = ref<HTMLElement | null>(null);
  const threeContext = reactive<IThreeCtx>({
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    gui: null,
    initMounted: [],
    loopMounted: [],
    resizeMounted: [],
    disposeMounted: [],
    reloadRender: () => {
      if (threeContext.renderer && threeContext.scene && threeContext.camera)
        threeContext.renderer.render(threeContext.scene, threeContext.camera);
    }
  });

  provide(threeContextKey, threeContext);

  onMounted(() => {
    //container 赋值
    threeContext.container = container.value
    //执行初始化应用池
    for (let func of threeContext.initMounted) {
      func()
    }

    //加载GUI
    initGui(props, threeContext)

    //加载helper
    initHelper(props, threeContext)

    //执行AnimationLoop
    if (props.isLoop && threeContext.renderer) {
      threeContext.renderer.setAnimationLoop(() => {
        for (let func of threeContext.loopMounted) {
          func()
        }
      });
    }

    // 响应式处理
    window.addEventListener('resize', () => {
      for (let func of threeContext.resizeMounted) {
        func()
      }
    });
  });
  onUnmounted(() => {
    //销毁
    for (let func of threeContext.disposeMounted) {
      func()
    }
  })
  return {
    container,
    threeContext,
    THREE
  };
}
function initGui(props: IThreeProps, threeContext: Reactive<IThreeCtx>) {
  if (props.isGui) {
    threeContext.gui = new GUI({ width: 300, title: "控制面板" })
    threeContext.gui.domElement.style.top = "0"
    threeContext.gui.domElement.style.right = "0"
    if (threeContext.scene) {
      let _sceneGui = threeContext.gui.addFolder("场景")
      _sceneGui.close()
      _sceneGui.add(threeContext.scene.position, "x").step(0.1).name("position-x")
      _sceneGui.add(threeContext.scene.rotation, "y").step(0.1).name("position-y")
      _sceneGui.add(threeContext.scene.rotation, "z").step(0.1).name("position-z")
      _sceneGui.add(threeContext.scene.rotation, "x").step(0.1).name("ratation-x")
      _sceneGui.add(threeContext.scene.rotation, "y").step(0.1).name("ratation-y")
      _sceneGui.add(threeContext.scene.rotation, "z").step(0.1).name("ratation-z")
    }
    if (props.isStats) {
      let stats = new Stats();
      stats.showPanel(0); // 0: fps, 1: ms, 2: mb
      let _statsGui = threeContext.gui.addFolder("stats")
      document.body.appendChild(stats.dom);
    }
  }
}
/**
 * 加载 gridHelper，AxesHelper
 * @param props 
 * @param threeContext 
 */
function initHelper(props: IThreeProps, threeContext: Reactive<IThreeCtx>) {
  if (props.gridHelper) {
    let gridHelper = null
    if (typeof (props.gridHelper) != "boolean") {
      gridHelper = new THREE.GridHelper(props.gridHelper.size, props.gridHelper.divisions, props.gridHelper.color1, props.gridHelper.color2);
      if (props.gridHelper.opacity) {
        gridHelper.material.opacity = props.gridHelper.opacity;
        gridHelper.material.transparent = true;
      }
    }
    else
      gridHelper = new THREE.GridHelper();
    threeContext.scene?.add(markRaw(gridHelper));
  }
  if (props.axesHelper) {
    let axesHelper = new THREE.AxesHelper(10); // 参数表示长度
    threeContext.scene?.add(markRaw(axesHelper));
  }
}