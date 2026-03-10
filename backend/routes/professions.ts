import { Hono } from 'hono'
import { OrgService } from '../services/orgService'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    const professions = await OrgService.getProfessions(c.env.DATABASE_URL as string)
    return c.json(professions)
})

app.post('/', async (c) => {
    const data = await c.req.json()

    if (!data.name || data.name.trim() === '') {
        return c.json({ error: '職種名は必須です' }, 400)
    }

    try {
        const newProfession = await OrgService.createProfession(
            c.env.DATABASE_URL as string,
            data.name,
            data.description
        )
        return c.json(newProfession, 201)
    } catch (error) {
        console.error('Error creating profession:', error)
        return c.json({ error: '職種の作成に失敗しました。名前が重複している可能性があります。' }, 500)
    }
})

app.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        return c.json({ error: '無効なIDです' }, 400)
    }

    const data = await c.req.json()
    if (!data.name || data.name.trim() === '') {
        return c.json({ error: '職種名は必須です' }, 400)
    }

    try {
        const updatedProfession = await OrgService.updateProfession(
            c.env.DATABASE_URL as string,
            id,
            data.name,
            data.description
        )
        return c.json(updatedProfession)
    } catch (error) {
        console.error('Error updating profession:', error)
        return c.json({ error: '職種の更新に失敗しました' }, 500)
    }
})

app.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        return c.json({ error: '無効なIDです' }, 400)
    }

    try {
        await OrgService.deleteProfession(c.env.DATABASE_URL as string, id)
        return new Response(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting profession:', error)
        return c.json({ error: '職種の削除に失敗しました' }, 500)
    }
})

export default app
