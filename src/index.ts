import express, { type Request, type Response } from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import type { ConsultaPagoRequest, ConsultaPagoResponse, RefreshPasswordRequest, RefreshPasswordResponse, RefreshTokenRequest, RefreshTokenResponse } from './types'

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

app.post('/refresh-password', async (req: Request, res: Response) => {
    const { Dni, Pass, PassNew } = req.body as RefreshPasswordRequest
    const authHeader = req.headers.authorization

    if (!Dni || !Pass || !PassNew) {
        res.status(400).json({ error: 'Faltan campos requeridos: Dni, Pass, PassNew' })
        return
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization header requerido con Bearer token' })
        return
    }

    try {
        const respuesta = await fetch(`${SERVIDOR_PAGOS}/public/auth/security/users/password/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify({ Dni, Pass, PassNew }),
        })

        const datos: RefreshPasswordResponse = await respuesta.json()
        res.status(respuesta.status).json(datos)

    } catch (error) {
        console.error('Error al actualizar contraseña:', error)
        res.status(500).json({ error: 'No se pudo conectar con el servidor de pagos' })
    }
})

app.post('/refresh-token', async (req: Request, res: Response) => {
    const { refresh_token } = req.body as RefreshTokenRequest
    const authHeader = req.headers.authorization

    if (!refresh_token) {
        res.status(400).json({ error: 'Campo requerido: refresh_token' })
        return
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization header requerido con Bearer token' })
        return
    }

    try {
        const respuesta = await fetch(`${SERVIDOR_PAGOS}/public/re/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify({ refresh_token }),
        })

        const datos: RefreshTokenResponse = await respuesta.json()
        res.status(respuesta.status).json(datos)

    } catch (error) {
        console.error('Error al refreshing token:', error)
        res.status(500).json({ error: 'No se pudo conectar con el servidor de pagos' })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})