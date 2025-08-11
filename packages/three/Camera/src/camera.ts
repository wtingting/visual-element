import * as THREE from 'three';
import { getThreeContext, threeContextKey, type IThreeCtx } from '../../hooks/useThree';
import { inject, markRaw, onMounted } from 'vue';
export interface ICameraProps {
  /**
   * 相机类型，Perspective正交，Orthographic透视
   */
  type?: 'Perspective' | 'Orthographic'
  /**
   * 透视相机-垂直视角
   * 默认值:50,垂直视野角度，值越大，可见范围越广，透视畸变越明显。
   */
  fov?: number,
  /**
   * 透视相机=画幅宽高比  width / height
   * 默认值：1
   */
  aspect?: number,
  /**
  * 正交相机-左边界
  * 默认值：‑1 ,定义一个矩形视景体；无透视变形，适合 2D、CAD、GIS
  */
  left?: number,
  /**
   * 正交相机=右边界
   * 默认值：1 
   */
  right?: number,
  /**
   * 正交相机-上边界
   * 默认值：1
   */
  top?: number,
  /**
   * 正交相机-下边界
   * 默认值：‑1	
   */
  bottom?: number,
  /**
   * 正交相机/透视相机-近平面距离
   * 默认值：0.1近平面；任何比它更近的物体都会被裁剪掉。
   */
  near?: number,
  /**
   * 正交相机/透视相机-远平面距离
   * 默认值：2000，远平面；任何比它更远的物体都会被裁剪掉。
   */
  far?: number,
  /**
   * 位置
   */
  position?: {
    x: number, y: number, z: number
  },
  /**
   *  
   */
  lookAt?: {
    x: number, y: number, z: number
  },
  isGui?: boolean,
  isHelper?: boolean,
}
export function useCamera(props: ICameraProps) {
  onMounted(() => {
    let _context = getThreeContext()
    let camera: any;
    if (props.type == 'Perspective')
      camera = new THREE.PerspectiveCamera(props.fov, props.aspect, props.near, props.far);
    else
      camera = new THREE.OrthographicCamera(props.left, props.right, props.top, props.bottom, props.near, props.far);
    if (props.position)
      camera.position.set(props.position.x, props.position.y, props.position.z); //设置相机位置
    if (props.lookAt)
      camera.lookAt(props.lookAt.x, props.lookAt.y, props.lookAt.z) //设置相机方向(指向的场景对象)
    _context.camera = camera;
    _context.camera.updateProjectionMatrix();
    const updateCamera = () => {
      if (_context.container) {
        _context.camera.aspect = _context.container.clientWidth / _context.container.clientHeight
        _context.camera.updateProjectionMatrix()
      }
    }
    // 创建相机辅助
    if (props.isHelper) {
      const cameraHelper = new THREE.CameraHelper(camera);
      _context.initMounted.push(() => {
        _context.scene?.add(markRaw(cameraHelper))
      })
    }

    //更新aspect 
    _context.initMounted.push(updateCamera)
    //自适应更新
    _context.resizeMounted.push(updateCamera)
  })


}


//  // 可直接利用 代码块——>摄像机——>飞到位置
//     app.camera.flyTo({
//         'position': [-9.31507492453225, 38.45386120167032, 49.00948473033884],
//         'target': [3.2145825289759062, 5.6950465199837375, -17.48975213256405],
//         'time': 1000,
//         'complete': function () {
//         }
//     });

