import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

async function start() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({ onUnhandledRequest: 'bypass' })
    } catch (err) {
      console.warn('[MSW] worker failed to start; continuing without mocks', err)
    }
  }
  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')
}

start()
