# Doc API Bancamiga - PM

**Bancamiga 3rd party APIs**  
📖 Última modificación: 2025-05-08

---

## Tabla de contenido

- [Doc API Bancamiga - PM](#doc-api-bancamiga---pm)
  - [Tabla de contenido](#tabla-de-contenido)
  - [Requerimientos](#requerimientos)
  - [Información de interés](#información-de-interés)
    - [Interconexión](#interconexión)
    - [Certificado SSL](#certificado-ssl)
  - [Configuración inicial](#configuración-inicial)
    - [Pasos a seguir](#pasos-a-seguir)
  - [Flujos de conciliación de pagos](#flujos-de-conciliación-de-pagos)
    - [Conciliar pago móvil](#conciliar-pago-móvil)
  - [GET - CHECK](#get---check)
    - [Request (ejemplo)](#request-ejemplo)
    - [Response](#response)
  - [POST - NEW PASSWORD](#post---new-password)
    - [Request (ejemplo)](#request-ejemplo-1)
    - [Response](#response-1)
    - [Códigos de respuesta](#códigos-de-respuesta)
  - [POST - NEW ACCESS TOKEN](#post---new-access-token)
    - [Request (ejemplo)](#request-ejemplo-2)
    - [Response](#response-2)
    - [Códigos de respuesta](#códigos-de-respuesta-1)
  - [POST - REFRESH TOKEN](#post---refresh-token)
    - [Request (ejemplo)](#request-ejemplo-3)
    - [Response](#response-3)
    - [Códigos de respuesta](#códigos-de-respuesta-2)
  - [POST - FIND PAYMENT MOBILE](#post---find-payment-mobile)
    - [Request (ejemplo)](#request-ejemplo-4)
    - [Response](#response-4)
    - [Códigos de respuesta](#códigos-de-respuesta-3)
  - [POST - FIND PAYMENT MOBILE HISTORY](#post---find-payment-mobile-history)
    - [Request (ejemplo)](#request-ejemplo-5)
    - [Response](#response-5)
    - [Códigos de respuesta](#códigos-de-respuesta-4)
  - [POST - WEBHOOK PAYMENT MOBILE](#post---webhook-payment-mobile)
    - [Headers](#headers)
    - [Request](#request)
    - [Response](#response-6)
  - [Parámetros API](#parámetros-api)
    - [NEW PASSWORD](#new-password)
    - [NEW ACCESS TOKEN](#new-access-token)
    - [REFRESH TOKEN](#refresh-token)
    - [FIND PAYMENT MOBILE](#find-payment-mobile)
    - [FIND PAYMENT MOBILE HISTORY](#find-payment-mobile-history)

---

## Requerimientos

Es necesario que valide contar con los siguientes requerimientos para configurar las credenciales de consumo de APIs.

- Tener cuenta jurídica Bancamiga.
- Estar afiliado a pago móvil de Bancamiga.
- Tener una interconexión entre su servidor y el nuestro.
- Para el uso del webhook y recibir un request POST cada vez que se reciba un pago móvil, es necesario enviarnos el URL ENDPOINT con un ACCESS TOKEN para recibir la información, por favor consultar [POST - WEBHOOK PAYMENT MOBILE](#post---webhook-payment-mobile).
- Uso de las mejores practicas de seguridad en su código con el fin de evitar bloqueos por el mal uso de APIs.

---

## Información de interés

### Interconexión

Para hacer uso de las APIs en esta documentación, es necesaria una interconexión entre el servidor donde se consumirán las APIs y el nuestro. Para esto, los métodos de interconexión que tiene disponible son:

- **IP pública fija.** Deben proporcionar la IP pública fija del servidor donde consumirán las APIs y de nuestro lado será agregado a una lista blanca.
- **AWS peering.** Se les solicitará la data necesaria para establecer la conexión por un peering de AWS.
- **VPN.** Se les enviará una planilla con los datos necesarios de su lado para establecer una conexión VPN site-to-site.

### Certificado SSL

Si su interconexión fue por VPN, es posible que obtenga algún error referente al certificado SSL al consumir los endpoints de esta documentación. Esto puede suceder debido a que la VPN agrega una capa adicional de infraestructura de red, lo que resulta en interferencia durante el SSL handshake. Debe saltar la verificación SSL al consumir los endpoints para solucionar estos errores y poder consumir las APIs.

**Ejemplo de cómo saltar la verificación SSL con PHP:**

```php
$curl = curl_init();
curl_setopt_array($curl, array(
    // Otras configuraciones...
    // Agregar las siguientes opciones al curl:
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    // Otras configuraciones...
));

$response = curl_exec($curl);
curl_close($curl);
```

**Ejemplo de cómo saltar la verificación SSL con cURL (flag `-k`):**

```bash
curl -k --location --request POST '{{HOST}}/public/protected/pm/find' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS TOKEN}}' \
--data-raw '{
  "Phone":"584120000000",
  "Bank":"0172",
  "Date":"2025-05-08"
}'
```

---

## Configuración inicial

Es recomendable que la actualización de contraseña y la generación del token sean de forma manual (por ejemplo, utilizando el comando cURL dentro del terminal del servidor, o una herramienta como Postman) y no a través de código/servicio automatizado, para que evite algún error durante el flujo y que potencialmente pierda las credenciales.

### Pasos a seguir

1. Utilizar **POST - NEW PASSWORD** para actualizar la contraseña temporal enviada por correo.
   - La nueva contraseña (campo `PassNew`), debe ser totalmente diferente a la enviada por correo, estar bien resguardada y no ser compartida por nadie.
2. Utilizar **POST - NEW ACCESS TOKEN** para generar su token de acceso y de renovación de token de acceso. El token de acceso (access token) es el que usará para consumir las API donde se le solicite el `{{ACCESS TOKEN}}`.
3. Implementar **POST - REFRESH TOKEN** para actualizar el token de acceso al menos **un mes antes** de que este expire.

---

## Flujos de conciliación de pagos

### Conciliar pago móvil

Métodos para conciliar pago móvil:

- **POST - FIND PAYMENT MOBILE** — Para conciliar todos los pago móviles de un número de teléfono, banco y fecha en específico. Esta API es la que se usa generalmente.
- **POST - FIND PAYMENT MOBILE HISTORY** — Para conciliar **todos** los pago móviles recibidos en la cuenta bancaria en una fecha en específico. Consumir esta API solo un máximo de una vez cada 10 minutos, y solo de ser necesario.

Método opcional para notificaciones de pago móvil recibidos:

- **POST - WEBHOOK PAYMENT MOBILE** — Para recibir notificaciones de forma automática de los pago móviles recibidos mediante un webhook que debe ser previamente configurado.

---

## GET - CHECK

Permite consultar el estatus del servicio.

### Request (ejemplo)

```bash
curl '{{HOST}}/healthcheck'
```

### Response

```json
{
  "code": 200,
  "time": "2025-05-08T15:47:36.951226361-04:00"
}
```

---

## POST - NEW PASSWORD

Permite actualizar la contraseña. Por medida de seguridad, todos los usuarios nuevos deben actualizar la contraseña temporal enviada por correo por una nueva. Puede utilizar este endpoint para actualizar su contraseña en caso de que lo requiera.

### Request (ejemplo)

```bash
curl --location --request POST '{{HOST}}/public/auth/security/users/password/new' \
--header 'Authorization: Bearer {{TEMP TOKEN}}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "Dni":"J000000000",
  "Pass":"AN#LklI#*r1",
  "PassNew":"AN#LklI#*r1A"
}'
```

### Response

```json
{
  "code": 200,
  "mensaje": "Contrasena Actualizada",
  "mod": "users"
}
```

### Códigos de respuesta

| Código | Mensaje                               |
|--------|---------------------------------------|
| 511    | Error formato                         |
| 550    | Error en contraseña                   |
| 200    | Contrasena Actualizada                |
| 551    | Error en usuario o contrasena invalida |

---

## POST - NEW ACCESS TOKEN

> ⚠️ Antes de utilizar este endpoint, debe asegurarse de haber actualizado la contraseña previamente con el endpoint **POST - NEW PASSWORD**.

Permite generar un token de acceso y token de renovación (refresh token). Cada token de acceso tiene un tiempo de vigencia de **1 año**. Antes de que expire, debe usar el endpoint **POST - REFRESH TOKEN** para generar un nuevo token de acceso y de renovación.

### Request (ejemplo)

```bash
curl --location --request POST '{{HOST}}/public/auth/security/users/token' \
--header 'Authorization: Bearer {{TEMP TOKEN}}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "Dni": "J000000000",
  "Pass": "AN#LklI#*r1A"
}'
```

### Response

```json
{
  "code": 200,
  "expireDate": 1778246388,
  "mensaje": "Token generado exitosamente",
  "mod": "users",
  "refresToken": "{{REFRESH TOKEN}}",
  "token": "{{ACCESS TOKEN}}"
}
```

### Códigos de respuesta

| Código | Mensaje                      |
|--------|------------------------------|
| 511    | Error formato                |
| 550    | Error en Contraseña          |
| 201    | Su contraseña esta expirada  |
| 200    | Token generado exitosamente  |
| 503    | Credenciales invalidas       |

---

## POST - REFRESH TOKEN

Permite generar un nuevo token de acceso por 1 año más de vigencia utilizando el token de acceso actual y el token de renovación.

> 💡 Si no desea llevar un control anualmente de cuándo debe renovar el token de acceso, recomendamos que implemente un flujo que consuma este endpoint mínimo mensualmente.

### Request (ejemplo)

```bash
curl --location --request POST '{{HOST}}/public/re/refresh' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS TOKEN}}' \
--data-raw '{
  "refresh_token":"{{REFRESH TOKEN}}"
}'
```

### Response

```json
{
  "code": 200,
  "expireDate": 1778246388,
  "mensaje": "Token generado exitosamente",
  "mod": "users",
  "refresToken": "{{REFRESH TOKEN NEW}}",
  "token": "{{ACCESS TOKEN NEW}}"
}
```

### Códigos de respuesta

| Codigo | Mensaje                         |
|--------|---------------------------------|
| 511    | Error formato                   |
| 512    | Error token expirado o invalido |
| 200    | Token generado exitosamente     |

---

## POST - FIND PAYMENT MOBILE

Permite buscar un pago móvil recibido de un teléfono, fecha y banco definido. Regresará un JSON con una lista de resultados.

### Request (ejemplo)

```bash
curl --location --request POST '{{HOST}}/public/protected/pm/find' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS TOKEN}}' \
--data-raw '{
  "Phone":"584240000000",
  "Bank":"0172",
  "Date":"2025-05-08"
}'
```

### Response

```json
{
  "code": 200,
  "lista": [
    {
      "ID": "b6639593-7623-41c1-b1e0-4b041a64018f",
      "created_at": "2025-05-08T10:12:02.594289-04:00",
      "update_at": "2025-05-08T10:12:03.358268-04:00",
      "deleted_at": null,
      "Dni": "J000000000",
      "PhoneDest": "584120000000",
      "PhoneOrig": "584240000000",
      "Amount": 5.12,
      "BancoOrig": "0172",
      "NroReferenciaCorto": "575202",
      "NroReferencia": "000000575202",
      "HoraMovimiento": "10:12:02",
      "FechaMovimiento": "2025-05-08",
      "Descripcion": "pago",
      "Status": "500",
      "Refpk": "202505080172584240000000575202",
      "Ref": 29211968
    }
  ],
  "mod": "find",
  "num": 1
}
```

### Códigos de respuesta

| Codigo | Mensaje                              |
|--------|--------------------------------------|
| 511    | Error formato                        |
| 551    | Error formato Bank                   |
| 552    | Error formato Phone                  |
| 553    | Error formato Date                   |
| 200    | Respuesta exitosa                    |
| 503    | Error token no autorizado o expirado |

---

## POST - FIND PAYMENT MOBILE HISTORY

Permite buscar un pago móvil recibido de una fecha definida. Regresará un JSON con una lista de resultados.

> ⚠️ Consumir esta API solo un máximo de **una vez cada 10 minutos**, y solo de ser necesario.

### Request (ejemplo)

```bash
curl --location --request POST '{{HOST}}/public/protected/pm/history/find' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS TOKEN}}' \
--data-raw '{
  "Date":"2025-05-08"
}'
```

### Response

```json
{
  "code": 200,
  "lista": [
    {
      "ID": "b6639593-7623-41c1-b1e0-4b041a64018f",
      "created_at": "2025-05-08T10:12:02.594289-04:00",
      "update_at": "2025-05-08T10:12:03.358268-04:00",
      "deleted_at": null,
      "Dni": "J000000000",
      "PhoneDest": "584240000000",
      "PhoneOrig": "584240000000",
      "Amount": 5.12,
      "BancoOrig": "0172",
      "NroReferenciaCorto": "575202",
      "NroReferencia": "000000575202",
      "HoraMovimiento": "10:12:02",
      "FechaMovimiento": "2025-05-08",
      "Descripcion": "pago",
      "Status": "500",
      "Refpk": "202505080172584240000000575202",
      "Ref": 29211968
    }
  ],
  "mod": "find",
  "num": 1
}
```

### Códigos de respuesta

| Codigo | Mensaje           |
|--------|-------------------|
| 511    | Error formato     |
| 553    | Error formato Date |
| 200    | Respuesta exitosa |

---

## POST - WEBHOOK PAYMENT MOBILE

Permite recibir un request cada vez que se reciba un pago móvil.

Debe enviarnos el endpoint con su respectivo token de acceso para ese endpoint (este token debe ser generado por ustedes, **no es el token de acceso que genera con nuestra API NEW ACCESS TOKEN**). Su endpoint será consumido por el webhook ya en funcionamiento para su certificación.

### Headers

Estructura de los headers que serán usados al consumir su endpoint. El `{{ACCESS TOKEN}}` será el que recibiremos de su correo.

```
Authorization: Bearer {{ACCESS TOKEN}}
Content-Type: application/json
```

### Request

Estructura del cuerpo de la petición que será usado al consumir su endpoint.

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

### Response

Al consumir su endpoint, de recibir la petición debe responder a la misma con código 200, de lo contrario se marcará como no entregado.

Debe responder con un `Content-Type: application/json`.

```json
{
  "Code": 200,
  "Refpk": "202505080172584240000000018219"
}
```

---

## Parámetros API

Diccionario de parámetros que se envían en el cuerpo de las peticiones (requests).

### NEW PASSWORD

| Campo   | Formato                                    | Ejemplo      |
|---------|--------------------------------------------|--------------|
| Dni     | String — Tipo de documento + Nº documento  | J500969920   |
| Pass    | String                                     | AN1Pp02zr9B  |
| PassNew | String                                     | AN#LklI#*r1A |

### NEW ACCESS TOKEN

| Campo | Formato                                    | Ejemplo      |
|-------|--------------------------------------------|--------------|
| Dni   | String — Tipo de documento + Nº documento  | J500969920   |
| Pass  | String                                     | AN#LklI#*r1A |

### REFRESH TOKEN

| Campo         | Formato                 | Ejemplo  |
|---------------|-------------------------|----------|
| refresh_token | String — JSON Web Token | eyJhbGc… |

### FIND PAYMENT MOBILE

| Campo | Formato                                   | Ejemplo      |
|-------|-------------------------------------------|--------------|
| Phone | String — 58 + operadora + nº identificador | 584140000000 |
| Bank  | String                                    | 0172         |
| Date  | String                                    | 2025-05-08   |

### FIND PAYMENT MOBILE HISTORY

| Campo | Formato | Ejemplo    |
|-------|---------|------------|
| Date  | String  | 2025-05-08 |
