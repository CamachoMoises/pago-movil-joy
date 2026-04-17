import express, { type Request, type Response } from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import type { ConsultaPagoRequest, ConsultaPagoResponse } from './types'

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT ?? 3000
const SERVIDOR_PAGOS = process.env.SERVIDOR_PAGOS

if (!SERVIDOR_PAGOS) {
    console.error('ERROR: La variable SERVIDOR_PAGOS no está definida en el .env')
    process.exit(1)
}

app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok' })
})

app.post('/consulta-pago', async (req: Request, res: Response) => {
    const { Phone, Bank, Date: fecha } = req.body as ConsultaPagoRequest

    if (!Phone || !Bank || !fecha) {
        res.status(400).json({ error: 'Faltan campos requeridos: Phone, Bank, Date' })
        return
    }

    try {
        const respuesta = await fetch(SERVIDOR_PAGOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Phone, Bank, Date: fecha }),
        })

        if (respuesta.status !== 200) {
            res.status(respuesta.status).json({
                error: 'El servidor de pagos respondió con error',
                code: respuesta.status,
            })
            return
        }

        const datos: ConsultaPagoResponse = await respuesta.json()
        res.json(datos)

    } catch (error) {
        console.error('Error al contactar servidor de pagos:', error)
        res.status(500).json({ error: 'No se pudo conectar con el servidor de pagos' })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})