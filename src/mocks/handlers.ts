import { http, HttpResponse, delay } from 'msw'

let tasks = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  title: `Seed ${i + 1}`,
  description: i % 3 ? `Desc ${i + 1}` : '',
  status: i % 4 === 0 ? 'completed' : 'pending',
  priority: (['low', 'medium', 'high'] as const)[i % 3],
  created_at: new Date(Date.now() - i * 3600_000).toISOString(),
  updated_at: new Date().toISOString(),
}))

const maybeFlaky = async (req: Request) => {
  const url = new URL(req.url)
  const fail = url.searchParams.get('fail')
  if (fail === '429') return HttpResponse.text('Too Many Requests', { status: 429 })
  if (fail === '500') return HttpResponse.text('Server Error', { status: 500 })
  await delay(250 + Math.random() * 250)
  return null
}

export const handlers = [
  http.get('/api/tasks', async ({ request }) => {
    const flaky = await maybeFlaky(request); if (flaky) return flaky
    return HttpResponse.json({ data: tasks })
  }),
  http.post('/api/tasks', async ({ request }) => {
    const flaky = await maybeFlaky(request); if (flaky) return flaky
    const body = await request.json()
    const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1
    const now = new Date().toISOString()
    const task = { id, created_at: now, updated_at: now, ...body }
    tasks.unshift(task)
    return HttpResponse.json(task, { status: 201 })
  }),
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const flaky = await maybeFlaky(request); if (flaky) return flaky
    const id = Number(params.id)
    const idx = tasks.findIndex(t => t.id === id)
    if (idx < 0) return HttpResponse.text('Not found', { status: 404 })
    const patch = await request.json()
    tasks[idx] = { ...tasks[idx], ...patch, updated_at: new Date().toISOString() }
    return HttpResponse.json(tasks[idx])
  }),
  http.delete('/api/tasks/:id', async ({ params, request }) => {
    const flaky = await maybeFlaky(request); if (flaky) return flaky
    const id = Number(params.id)
    tasks = tasks.filter(t => t.id !== id)
    return HttpResponse.text(null, { status: 204 })
  }),
]
