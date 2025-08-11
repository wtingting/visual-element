import * as THREE from 'three';
import { inject, markRaw, toRaw, toRef, unref } from 'vue';
import { getThreeContext, threeContextKey, type IThreeCtx } from '../../hooks/useThree';
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js"
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"
export interface IModel {
  path: string,
  pathName: string,
  postion?: {
    x?: number,
    y?: number,
    z?: number
  },
  /**
   * 旋转角度(角度制)
   * 注意： 
   * blender 导出模型时默认坐标系与threejs坐标系不一致，需要设置+y轴朝，如果未设置需要设置rotation来旋转坐标轴。旋转后需要将模型的几何中心移到世界原点。
   */
  rotation?: {
    x?: number,
    y?: number,
    z?: number
  },
  /**
   * 是否将模型几何中心移到世界原点
   * 如果模型是从3D软件导出，通常几何中心会在模型的底部
   */
  wordCenter?: boolean,
  /**
   * 是否显示线框
   */
  wireframe?: boolean
}
export function useGLTFLoader(props: IModel, loadingFun: (url: string, percent: number) => void, complete: (data: { status: string, model?: any, error?: any }) => void) {
  const _context = getThreeContext();
  _context.initMounted.push(() => {
    // 带进度显示的加载
    const manager = new THREE.LoadingManager()
    manager.onProgress = (url: string, loaded: number, total: number) => {
      if (loadingFun)
        loadingFun(url, Math.trunc(loaded / total * 100))
    }
    //加载模型
    const loader = new GLTFLoader(manager)
    let path = props.path
    if (!_context.renderer) {
      console.log('请先加载renderer！')
      return;
    }
    //设置KTX2解码器
    const ktx2Loader = new KTX2Loader().setTranscoderPath(path).detectSupport(_context.renderer)
    loader.setKTX2Loader(ktx2Loader)
    //设置DRACO解码器
    const dar = new DRACOLoader()
    dar.setDecoderPath(path)
    dar.setDecoderConfig({ type: "js" })
    dar.preload()
    loader.setDRACOLoader(dar)
    loader.load(
      props.path + props.pathName, // 资源URL
      function (gltf) {
        //设置旋转角度
        if (props.rotation) {
          if (props.rotation.x) gltf.scene.rotation.x = THREE.MathUtils.degToRad(props.rotation.x);
          if (props.rotation.y) gltf.scene.rotation.y = THREE.MathUtils.degToRad(props.rotation.y);
          if (props.rotation.z) gltf.scene.rotation.z = THREE.MathUtils.degToRad(props.rotation.z);
        }
        // 把几何中心移到世界原点
        if (props.wordCenter)
          setWordCenter(gltf.scene)

        //设置位置
        if (props.postion) {
          if (props.postion.x) gltf.scene.position.x = props.postion.x;
          if (props.postion.y) gltf.scene.position.y = props.postion.y;
          if (props.postion.z) gltf.scene.position.z = props.postion.z;
        }
        //设置线框模式
        if (props.wireframe) {
          setWireFrame(gltf.scene, props.wireframe);
        }
        // 初始化GUI
        initGui(_context, gltf.scene, toRaw(props))

        // 将模型添加到场景中
        _context.scene?.add(markRaw(gltf.scene))// 将模型添加到场景中


        // 获取模型边界框调整灯光位置
        console.log("模型加载成功", gltf.scene)
        // if (_context.renderer && _context.scene) {
        //   // 创建 PMREM 生成器
        //   let pmremGenerator = new THREE.PMREMGenerator(_context.renderer);
        //   pmremGenerator.compileEquirectangularShader();

        //   // 创建空场景用于生成中性环境
        //   const neutralScene = new THREE.Scene();
        //   let neutralEnvironment = pmremGenerator.fromScene(neutralScene).texture;

        //   // 使用环境贴图
        //   _context.scene.environment = neutralEnvironment;

        // }

        _context.reloadRender()
        // 如果模型自带动画
        // if (gltf.animations.length) {
        //   mixer = new THREE.AnimationMixer(gltf.scene)
        //   // 播放所有动画
        //   gltf.animations.forEach((clip) => {
        //     mixer.clipAction(clip).play()
        //   })
        //   // 或指定动画：mixer.clipAction(gltf.animations[0]).play()
        // }
        // loop:mixer?.update(delta)      // 更新动画
        //循环渲染
        complete && complete({
          status: 'success',
          model: gltf.scene
        })
      },
      undefined,
      function (error) {
        // 加载失败时调用
        console.error("模型加载失败", error)
        complete && complete({
          status: 'error',
          error: error
        })
      },
    )
  })
}

function initGui(context: IThreeCtx, scene: any, props: any) {
  if (context.gui) {
    let _sceneGui = context.gui.addFolder("模型场景")
    _sceneGui.add(scene.position, "x").name("position-x").listen();
    _sceneGui.add(scene.position, "y").name("position-y").listen();
    _sceneGui.add(scene.position, "z").name("position-z").listen();
    _sceneGui.add(scene.rotation, "x", -360, 360).name("rotation-x (角度)").onChange((value) => {
      scene.rotation.x = THREE.MathUtils.degToRad(value);
    }).listen();
    _sceneGui.add(scene.rotation, "y", -360, 360).name("rotation-y (角度)").onChange((value) => {
      scene.rotation.y = THREE.MathUtils.degToRad(value);
    }).listen();
    _sceneGui.add(scene.rotation, "z", -360, 360).name("rotation-z (角度)").onChange((value) => {
      scene.rotation.z = THREE.MathUtils.degToRad(value);
    }).listen();
    _sceneGui.add(props, "wireframe").name("线框模式").onChange((value: boolean) => {
      setWireFrame(scene, value);
    });
  }
}
export function setWireFrame(scene: any, bool: boolean) {
  // 设置场景中所有网格的线框模式
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.wireframe = bool;
    }
  });
}

export function setWordCenter(scene: any) {
  const bbox = new THREE.Box3().setFromObject(scene);
  const center = bbox.getCenter(new THREE.Vector3());
  scene.position.sub(center);
}

// function follow() {
//     reset();
//     initThingJsTip('设置摄像机跟随小车')
//     // 世界坐标系下坐标点构成的数组 关于坐标的获取 可利用「工具」——>「拾取场景坐标」
//     // 拐角处多取一个点，用于转向插值计算时更平滑
//     var path = [[0, 0, 0], [2, 0, 0], [20, 0, 0], [20, 0, 2], [20, 0, 10], [18, 0, 10], [0, 0, 10], [0, 0, 8], [0, 0, 0]];
//     car.position = path[0];
//     // 物体开始沿点位路线移动
//     car.movePath(path, {
//         orientToPath: false,
//         next: function (ev) {
//             // 获取相对下一个目标点位的旋转值
//             var quaternion = THING.Math.getQuatFromTarget(ev.from, ev.to, [0, 1, 0]);

//             // 在 1 秒内将物体转向到目标点位
//             ev.object.lerp.to({
//                 to: {
//                     quaternion,
//                 },
//                 time: 200,
//             });
//         },
//         time: 10 * 1000,
//         loopType: THING.LoopType.Repeat
//     });
//     // 每一帧设置摄像机位置和目标点
//     car.on('update', function () {
//         // 摄像机位置为移动小车后上方
//         // 为了便于计算，这里用了坐标转换，将相对于小车的位置转换为世界坐标
//         app.camera.position = car.selfToWorld([0, 5, -10]);
//         // 摄像机目标点为移动小车的坐标
//         app.camera.target = car.position;
//     }, '自定义摄像机跟随');
// }