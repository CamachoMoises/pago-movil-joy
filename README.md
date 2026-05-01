# Joy Pago Móvil - Cliente API Bancamiga

## Descripción

Cliente TypeScript para la integración con la API de Pago Móvil de Bancamiga 2025. Esta biblioteca permite la integración automatizada de servicios financieros para la conciliación y recepción de pagos móviles interbancarios.

## Requisitos del Sistema

- Cuenta jurídica activa en Bancamiga
- Afiliación al servicio de Pago Móvil jurídico
- Canal de comunicación seguro establecido (IP fija, AWS Peering o VPN)
- Node.js y TypeScript

## Instalación

```bash
npm install
```

## Configuración

1. **Cambio de Contraseña**: Utilizar el endpoint para actualizar la contraseña temporal.
2. **Generación de Tokens**: Obtener Access y Refresh Tokens iniciales.
3. **Configuración de Variables de Entorno**: Crear un archivo `.env` con las credenciales necesarias.

### Variables de Entorno

- `HOST`: URL del host de la API
- `ACCESS_TOKEN`: Token de acceso
- `REFRESH_TOKEN`: Token de refresco
- `CLIENT_TOKEN`: Token propio para validación de webhooks

## Uso

### Construir el Proyecto

```bash
npm run build
```

### Ejecutar en Modo Desarrollo

```bash
npm run dev
```

### Iniciar el Servidor

```bash
npm start
```

### Métodos de Conciliación

- **Búsqueda Específica**: POST - FIND PAYMENT MOBILE
- **Búsqueda Masiva**: POST - FIND PAYMENT MOBILE HISTORY
- **Notificaciones en Tiempo Real**: POST - WEBHOOK PAYMENT MOBILE

## Referencia de Endpoints

### GET - CHECK
Verifica la disponibilidad de la plataforma.

**Request**: `GET {{HOST}}/healthcheck`

**Response**:
```json
{
    "code": 200,
    "time": "2025-05-08T15:47:36.951226361-04:00"
}
```

### POST - NEW PASSWORD
Actualización de contraseña.

**Request**: `POST {{HOST}}/public/auth/security/users/password/new`

**Headers**:
- Content-Type: application/json
- Authorization: Bearer {{TOKEN}}

**Body**:
```json
{
    "Dni": "J000000000",
    "Pass": "ClaveTemporal123",
    "PassNew": "NuevaClaveSegura2025"
}
```

### POST - NEW ACCESS TOKEN
Generación de tokens de acceso.

**Request**: `POST {{HOST}}/public/auth/security/users/token`

**Headers**:
- Content-Type: application/json

**Body**:
```json
{
    "Dni": "J000000000",
    "Pass": "NuevaClaveSegura2025"
}
```

### POST - REFRESH TOKEN
Renovación del Access Token.

**Request**: `POST {{HOST}}/public/re/refresh`

**Headers**:
- Content-Type: application/json
- Authorization: Bearer {{ACCESS_TOKEN}}

**Body**:
```json
{
    "refresh_token": "eyJhbGciOi..."
}
```

### POST - FIND PAYMENT MOBILE
Búsqueda de transacciones específicas.

**Request**: `POST {{HOST}}/public/protected/pm/find`

**Headers**:
- Content-Type: application/json
- Authorization: Bearer {{ACCESS_TOKEN}}

**Body**:
```json
{
    "Phone": "584240000000",
    "Bank": "0172",
    "Date": "2025-05-08"
}
```

### POST - FIND PAYMENT MOBILE HISTORY
Búsqueda histórica masiva por fecha.

**Request**: `POST {{HOST}}/public/protected/pm/history/find`

**Headers**:
- Content-Type: application/json
- Authorization: Bearer {{ACCESS_TOKEN}}

**Body**:
```json
{
    "Date": "2025-05-08"
}
```

## Implementación del Webhook

Para recibir notificaciones automáticas, configure un endpoint que reciba POST requests de Bancamiga.

**Headers Recibidos**:
- Authorization: Bearer {{CLIENT_OWN_TOKEN}}
- Content-Type: application/json

**Body Recibido**:
```json
{
    "BancoOrig": "0172",
    "FechaMovimiento": "2025-05-08",
    "HoraMovimiento": "16:02:49",
    "NroReferencia": "018219",
    "PhoneOrig": "584240000000",
    "PhoneDest": "584240000000",
    "Status": "000",
    "Descripcion": "pago",
    "Amount": "5.64",
    "Refpk": "202505080172584240000000018219"
}
```

**Respuesta Requerida**:
```json
{
    "Code": 200,
    "Refpk": "202505080172584240000000018219"
}
```

## Diccionario de Parámetros

| Campo | Formato | Ejemplo |
|-------|---------|---------|
| Dni | Tipo (Letra) + Número | J000000000 |
| Pass / PassNew | String alfanumérico | AN#LklI#*r1A |
| refresh_token | JWT String | eyJhbGciOiJI... |
| Phone / PhoneOrig | 58 + Operadora + Número | 584140000000 |
| Bank / BancoOrig | String (4 dígitos) | 0172 |
| Date | String (AAAA-MM-DD) | 2025-05-08 |
| Amount | Decimal (Numérico o String) | 5.64 |
| NroReferencia | String (12 dígitos) | 000000575202 |
| HoraMovimiento | String (HH:MM:SS) | 10:12:02 |
| Refpk | Concatenación Única | 202505080172584240000000575202 |
| Status | String (Código de estado) | 000 |
| Descripcion | String | pago |
| PhoneDest | 58 + Operadora + Número | 584120000000 |

## Seguridad

- Utilice HTTPS para todas las comunicaciones
- Renueve tokens mensualmente
- Implemente validación de webhooks con tokens propios
- Siga mejores prácticas de desarrollo seguro

## Licencia

ISC</content>
<parameter name="filePath">c:\Joy\joy-pago-movil\README.md