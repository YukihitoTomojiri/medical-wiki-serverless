import { Hono } from 'hono'
import facilities from './facilities'
import departments from './departments'
import professions from './professions'

const app = new Hono()

app.route('/facilities', facilities)
app.route('/departments', departments)
app.route('/professions', professions)

export default app
