import * as THREE from 'three';
import { inject, onMounted } from 'vue';
import { threeContextKey, type IThreeCtx } from '../../hooks/useThree';
export interface ISceneProps{
  environment?: 'None' | 'Neutral',
  background?: string,
  skgBox?: string,
  fog?:boolean
}
export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();

  const threeModal = inject(threeContextKey) as IThreeCtx;
  onMounted(() => {
    threeModal.scene = scene; // Inject the scene into the context

    console.log('Scene', threeModal);

    // console.log('Scene created',threeModal);
    // threeModal.setScene(scene); // Inject the scene into the context
  })
  return scene;
}

