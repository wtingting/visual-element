import AmbientLight from "./src/ambient.vue";
import DirectionalLight from "./src/directional.vue";
import HemisphereLight from "./src/hemisphere.vue";
import PointLight from "./src/point.vue";
import LightProbe from "./src/probe.vue";
import RectAreaLight from "./src/rectArea.vue";
import SpotLight from "./src/spot.vue";
import { withInstall } from '@visual-element/utils'

export const VdAmbientLight = withInstall(AmbientLight);
export const VdDirectionalLight = withInstall(DirectionalLight);
export const VdHemisphereLight = withInstall(HemisphereLight);
export const VdPointLight = withInstall(PointLight);
export const VdLightProbe = withInstall(LightProbe);
export const VdRectAreaLight = withInstall(RectAreaLight);
export const VdSpotLight = withInstall(SpotLight);