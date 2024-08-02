### Revisión 03/05/2024
- El backend ya estaria, termine de realizar todas las funcionalidades de los turnos.
- Se puede solicitar, cancelar turnos. El admina puede generar turnos, tambien puede consultar los turnos agendados.
- Se puede consultar los turnos disponibles de un dia.
- Un usuario puede ver sus turnos.


### Cosas a tener en cuenta
- Al empezar con el calendario, tengo que corroborar que pueda clickear en algun dia del calendario y hacer la peticion a la api, en caso de que se dificulte con el calendario de react-big-callendar o similar, tendre que agregar una funcionalidad para traer todas las fechas de turnos, asi hacer una especie de calendariio a mano, y ahi se va a facilitar laobtencion de turnos disponibles por dia.


### Revisión 05/05/2024
- Ya empeze a hacer el frontend, funciona el calendario correctamente, obtiene todos los turnos de un dia determinado.
- Proxima funcionalidad a realizar es listar servicios.


### TODO 10/05/2024
- Hacer que se pueda logear y registrarse en el frontend.


### Revisión 16/05/2024
- Revisar que estilos en la web, quedaron medios desordenados.
- Revisar el manejo de errores en el frontend.
- Revisar el formState de la store del user.
- Ya casi esta todo implementado, hice la edicion de perfil y de contraseña.
- En caso de que el token haya expirado para editar perfil o contraseña, se cierra la sesion y se redirige.


### Revisión 20/05/2024
- Ya esta acomodado todo el manejo de errores en el backend.
- Proxima tarea a hacer es manejar bien los errores desde el frontend para mejorar el feedback con el usuario.

### Revisión 21/05/2024
- Dejar toda la validacion del formulario de registro para el backend y luego ajusto en el frontend.

### TODO 27/05/2024
- Realizar la funcionalidad de solicitar un turno en el frontend.

### Revisión 18/6/2024
- Mejore el manejo de errores para turnos y servicios, falta hacerlo con usuarios.
- Tengo que mejorar la autenticación, generando el Json Web Token y guardandolo en una cookie.

### Revisión 20/6/2024
- Ya esta todo listo en el backend, se guarda el token en las cookies, también implemente el logout.
- Lo que queda ahora es acomodar el frontend para que se adapte a los cambios que realize en el back.

### Revisión 24/6/2024
- Acomode todas las funcionalidades de usuario en el frontend.
- Verificar cuando el token no sea válido, realizar algún tipo de redirección.

### Revisión 25/6/2024
- Realize todas las tareas que quedaron pendientes del 24/06/2024
- Falta agregar las funcionalidades faltantes y arreglar temas de diseño.

### Revisión 26/6/2024
- Agregue la sección de Gestión de servicios.
- Por ahora solo agregue la funcionalidad de obtener los servicios y eliminarlos, faltaría editarlos y agregarlos.

### Revisión 1/7/2024
- La sección de administrar los servicios esta terminada, para la próxima verificar diferentes errores para informarlos al usuario.

### Revisión 2/7/2024
- La sección de ver los usuarios de la web ya esta terminada.
- Avanzada la sección de ver los turnos agendados, corregir la ruta de la api que realiza esta funcion y replicarlo en la store de turn.

### Revisión 4/7/2024
- Mejore la sección de mis turnos, dividiendola en turnos pasados y futuros.
- Agregue las funcionalidades de solicitar un turno y cancelarlo.

### Revisión 5/7/2024
- Para la próxima agregar la sección para configurar horarios de trabajo y de turnos, etc.
- Faltaría ver como incorporar notificaciones.
- Agregar funcionalidad para que el administrador pueda asignar roles a usuarios.

### Revisión 17/7/2024
- Avanzada sección de configurar horarios de atención en el frontend, luego hay que modificar el backend.

### Revisión 18/7/2024
- Sección de configurar calendario muy avanzada, practicamente terminada. Falta mejorar manejo de errores y validaciones y posibles mejoras para que sea más funcional.


### Revisión 19/7/2024
- Terminada la sección de configurar el calendario.
- Cuando se configura el calendario, se eliminan los turnos con horarios que no pertenecen a los nuevos (solo si no estaban solicitados ya por un cliente), los turnos que estan dentro de los nuevos horarios se mantienen para que no haya duplicados.
- Entender los minTime y maxTime de los TimePickers para que no se solapen las franjas horarias, hecho solamente en el frontend. Ya estan hechos pero tengo que entenderlos mejor.
- Agregar una capa más de seguridad y realizar las verificaciones para que no se solapen las franjas horarias también en el backend.

### Revisión 22/7/2024
- Terminada la sección de configurar calendario, con llenado automático y todo.
- Agregue una nueva funcionalidad para cambiar el rol a un usuario, funcionalidad solo para administradores. Me falta hacer verificaciones como que no sean nulos los valores o sea un rol válido, tambien que solo se pueda cambiar el rol de otro usuario y no el de uno mismo, ya que genera una inconsistencia en la web.

### Revisión 24/7/2024
- Arranque a testear la api para que quede todo listo. Por ahora solo algunos endpoints de users.

### Revisión  25/7/2024
- Ya testeados endpoints de users y services, falta de turns.
- Testeando detecte un error, cuando se edita el nombre de usuario y se pone el mismo que ya tenia, da error porque ya existe, tengo que arreglar eso.
- Modificar documentación de la api para la funcionalidaad de editar servicio (falta indicar que lleva un body con sus atributos correspondientes)

### Revisión 26/7/2024
- Arregle bugs, tengo que testear de nuevo

### Revisión 29/7/2024
- Ajuste límites para solicitar turnos, limitando así a que se tengan que solicitar 12 horas antes y que se solicite el día anterior.
- Falta testear api de nuevo.


### Revisión 30/7/2024
- Todos los test de integración salieron bien.

### Revisión 1/8/2024
- Decidi cambiar de gestor de base de datos, ahora utilizo postgreSQL.
- Esto me favorecio mucho en terminos de manejo de fechas y horas y uuids.
- Falta implementar las siguientes funcionalidades: solicitar turno, cancelar turno, obtener mis turnos, obtener turnos de usuarios (admin)