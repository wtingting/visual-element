import { VeButton } from '@visual-element/components'
import * as VThree from '@visual-element/three'
import type { Plugin } from 'vue'
export default [VeButton, ...Object.values(VThree)] as Plugin[];