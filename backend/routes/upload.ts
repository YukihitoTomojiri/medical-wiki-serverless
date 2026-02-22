import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    const formData = await c.req.parseBody()
    const file = formData['file']

    if (!file || typeof file === 'string') {
        return c.json({ error: 'No file uploaded' }, 400)
    }

    const sb = getSupabase(c.env.SUPABASE_URL as string, c.env.SUPABASE_ANON_KEY as string)
    const bucket = 'wiki-assets'

    // Generate unique path
    const timestamp = Date.now()
    const path = `uploads/${timestamp}-${file.name}`

    const { data, error } = await sb.storage
        .from(bucket)
        .upload(path, file, {
            upsert: false
        })

    if (error) {
        return c.json({ error: error.message }, 500)
    }

    const { data: { publicUrl } } = sb.storage
        .from(bucket)
        .getPublicUrl(path)

    return c.json({ publicUrl })
})

export default app
