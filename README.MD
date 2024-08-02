### Endpoints

## Turnos

Obtener todos los turnos registrados (Solo admin)
- URL: http://localhost:1234/api/v1/turns/{date}/registered
- Método: GET
- Credentials: include

Obtener mis turnos solicitados (Solo usuarios loggeados)
- URL: http://localhost:1234/api/v1/turns/user
- Método: GET
- Credentials: include

Obtener los turnos disponibles para un determinado día
- URL: http://localhost:1234/api/v1/turns/{date}/available
- Método: GET
- Parámetros de ruta:
    date: La fecha para la cual se desean obtener los turnos disponibles.

Generar turnos (Solo admin)
- Descripción: Esta ruta sirve para generar los turnos disponibles en la web.
- URL: http://localhost:1234/api/v1/turns
- Método: POST
- Credentials: include
- Headers:
    Content-Type: application/json
- Body: 
    {
        "startHour1": 8,
        "endHour1": 12,
        "startHour2": 16,
        "endHour2": 20
    }
    
    'startHour1' (obligatorio): Horario desde el cual se generan los turnos.
    'endHour1' (obligatorio): Horario hasta el cual se generan los turnos.
    'startHour2' (opcional): Horario desde el cual se generan los turnos para el segundo rango de horario opcional.
    'endHour2' (opcional): Horario hasta el cual se generan los turnos para el segundo rango de horario opcional.

Solicitar un turno (Solo usuarios loggeados)
- URL: http://localhost:1234/api/v1/turns?turnId={id-turn}&serviceId={id-service}
- Método: PATCH
- Credentials: include
- Parámetros de consulta:
    'turnId' (obligatorio): El ID único del turno que se desea solicitar.
    'serviceId' (obligatorio): El ID único del servicio que se desea consumir en el turno.

Cancelar un turno (Solo usuarios loggeados)
- URL: http://localhost:1234/api/v1/turns/{id-turn}/status
- Método: PATCH
- Credentials: include

## Servicios

Obtener todos los servicios
- URL: http://localhost:1234/api/v1/services
- Method: GET

Crear un servicio (Solo admin)
- URL: http://localhost:1234/api/v1/services
- Método: POST
- Credentials: include
- Headers:
    Content-Type: application/json
- Body:
    {
        "name": "Corte y barba",
        "duration": 30,
        "price" 5500
    }

    'name' (obligatorio): Nombre del servicio.
    'duration' (obligatorio): Duración del turno exresada en minutos.
    'price' (obligatorio): Valor del turno.

Eliminar un servicio (Solo admin)
- URL: http://localhost:1234/api/v1/services/{id}/deactivate
- Método: PATCH
- Credentials: include
- Parámetros de ruta:
    'id': El ID único del servicio que se desea eliminar.

Editar un servicio (Solo admin)
- URL: http://localhost:1234/api/v1/services/{id}
- Método: PATCH
- Credentials: include
- Parámetros de ruta:
    'id': El ID único del servicio que se desea editar.
- Headers:
    Content-Type: application/json
- Body:
    {
        "name": "Corte",
        "duration" 30,
        "price": 5500
    }

    'name (opcional)': Nombre del servicio.
    'duration (opcional)': Duración del servicio.
    'price (opcional)': Valor del servicio.

## Usuarios

Obtener todos los usuarios (Solo admin)
- URL: http://localhost:1234/api/v1/users
- Método: GET
- Credentials: include

Registrarse
- URL: http://localhost:1234/api/v1/users
- Método: POST
- Headers:
    Content-Type: application/json
- Body:
    {
        "name": "JuanPerez",
        "email": "juanperez8912@gmail.com,
        "password": "chacabuco1892",
        "passwordConfirm": "chacabuco1892",
        "phoneNum": "2389012368"
    }

    'name (obligatorio)': Nombre de usuario.
    'email (obligatorio)': Correo electrónico del usuario.
    'password (obligatorio)': Contraseña del usuario.
    'passwordConfirm (obligatorio)': Confirmación de contraseña del usuario.
    'phoneNum (obligatorio)': Número de teléfono del usuario.

Editar perfil (Solo usuarios loggeados)
- Descripción: Permite editar información personal como el nombre de usuario o el número de teléfono.
- URL: http://localhost:1234/api/v1/users
- Método: PATCH
- Credentials: include
- Headers:
    Content-Type: application/json
- Body:
    {
        "name": "julioguti",
        "phoneNum" "2456890769"
    }

    'name (opcional)': Nombre de usuario.
    'phoneNum (opcional)': Número de teléfono del usuario.

Obtener mi información de usuario (Solo usuarios loggeados)
- Descripción: Obtiene la información personal del usuario.
- URL: http://localhost:1234/api/v1/users/info
- Método: GET
- Credentials: include

Editar contraseña (Solo usuarios loggeados)
- Descripción: Permite modificar la contraseña de acceso.
- URL: http://localhost:1234/api/v1/users/password
- Método: PATCH
- Credentials: include
- Headers:
    Content-Type: application/json
- Body:
    {
        "currentPassword": "oscarguti891",
        "newPassword": "perrito123",
        "passwordConfirm": "perrito123
    }

    'currentPassword' (obligatorio): Contraseña actual del usuario.
    'newPassword' (obligatorio): Nueva contraseña deseada.
    'passwordConfirm' (obligatorio): 'Confirmación de la nueva contraseña.

Cambiar rol (Solo administradores)
- Descripción: Permite cambiarle el rol a un usuario.
- URL: http://localhost:1234/api/v1/users/role
- Método: PATCH
- Credentials: include
- Headers:
    Content-Type: application/json
- Body:
    {
        "id": "422r8fuwrugfnw4g",
        "role": "client"
    }

    'id' (obligatorio): Id del usuario a cambiar el rol.
    'role' (obligatorio): Nuevo rol a asignar.

Iniciar sesión
- URL: http://localhost:1234/api/v1/users/auth
- Método: POST
- Headers:
    Content-Type: application/json
- Body:
    {
        "email": "oscarguti90@gmail.com",
        "password": "perrito123"
    }

    'email' (obligatorio): Correo electrónico del usuario.
    'password' (obligatorio): Contraseña del usuario.

Cerrar sesión
- URL: http://localhost:1234/api/v1/users/logout
- Método: POST