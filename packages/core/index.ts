import { makeInstaller} from '@visual-element/utils'
import components from './components'
import '@visual-element/theme/index.css'

const installer=makeInstaller(components)
export * from '../components'
export default installer;
