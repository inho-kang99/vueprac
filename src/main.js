import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { ThemeProvider } from 'vue3-styled-components'

const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#ecf0f1',
    text: '#2c3e50'
  }
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ThemeProvider, { theme })

app.mount('#app')
