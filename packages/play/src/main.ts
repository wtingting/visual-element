import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VisualElement from 'visual-element'
import 'visual-element/dist/index.css'

createApp(App).use(VisualElement).mount('#app')
