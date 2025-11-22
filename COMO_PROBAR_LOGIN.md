# 🧪 Guía: Cómo Probar el Login

## 📋 Pasos para Probar el Frontend de Login

### Paso 1: Verificar que el Backend esté corriendo

1. Abre una terminal y ve al directorio del backend:
```bash
cd /home/juan/Trabajo-Grado/backend
```

2. Inicia el servidor backend:
```bash
npm run dev
```

Deberías ver un mensaje como:
```
✅ SERVIDOR INICIADO EXITOSAMENTE
📍 Puerto:          3000
🌍 Ambiente:        development
📊 Base de datos:   isp_management_system
🔗 URL Local:       http://localhost:3000
```

### Paso 2: Verificar usuarios en la base de datos

En otra terminal, ejecuta:
```bash
cd /home/juan/Trabajo-Grado/backend
npm run check:users
```

Esto mostrará los usuarios disponibles. Si no hay usuarios, crea uno de prueba:
```bash
npm run create:test-user
```

Esto creará un usuario con:
- **Username:** `testuser`
- **Password:** `Test1234`
- **Email:** `test@example.com`

### Paso 3: Iniciar el Frontend

1. Abre otra terminal y ve al directorio del frontend:
```bash
cd /home/juan/Trabajo-Grado/frontend
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Deberías ver algo como:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 4: Abrir el navegador

1. Abre tu navegador web (Chrome, Firefox, etc.)
2. Ve a: `http://localhost:5173`

Deberías ver la página de login con:
- Título "Iniciar Sesión"
- Campo de Correo Electrónico
- Campo de Contraseña
- Checkbox "Recordarme en este dispositivo"
- Botón "Iniciar Sesión"
- Enlaces "¿Olvidó su contraseña?" y "Cambiar de Empresa"

### Paso 5: Probar el Login

#### ✅ Prueba exitosa:

1. Ingresa las credenciales:
   - **Correo Electrónico:** `testuser` (o el username que tengas)
   - **Contraseña:** `Test1234` (o la contraseña correcta)

2. Opcionalmente marca "Recordarme en este dispositivo"

3. Haz clic en "Iniciar Sesión"

4. **Resultado esperado:**
   - El botón muestra "Iniciando sesión..." mientras procesa
   - Si las credenciales son correctas, te redirige a `/dashboard`
   - En el dashboard verás:
     - Información del usuario (username, nombre, email, rol)
     - Botón "Cerrar Sesión"
     - Estado del backend

#### ❌ Prueba de error:

1. Ingresa credenciales incorrectas:
   - **Username:** `testuser`
   - **Password:** `password_incorrecta`

2. Haz clic en "Iniciar Sesión"

3. **Resultado esperado:**
   - Se muestra un mensaje de error en rojo: "Credenciales inválidas"
   - No te redirige al dashboard
   - Puedes intentar de nuevo

### Paso 6: Probar otras funcionalidades

#### Probar el toggle de contraseña:
1. Ingresa una contraseña
2. Haz clic en el icono del ojo (👁️) junto al campo de contraseña
3. La contraseña debería mostrarse/ocultarse

#### Probar "Recordarme":
1. Marca el checkbox "Recordarme en este dispositivo"
2. Ingresa un username y haz login exitoso
3. Cierra el navegador completamente
4. Abre el navegador nuevamente y ve a `http://localhost:5173`
5. El username debería estar pre-llenado

#### Probar protección de rutas:
1. Haz login exitoso
2. Ve al dashboard
3. Haz clic en "Cerrar Sesión"
4. Intenta acceder directamente a `http://localhost:5173/dashboard`
5. Deberías ser redirigido automáticamente al login

### Paso 7: Verificar en las DevTools del Navegador

1. Abre las DevTools (F12 o clic derecho → Inspeccionar)
2. Ve a la pestaña **Network** (Red)
3. Intenta hacer login
4. Busca la petición a `/api/auth/login`
5. Verifica:
   - **Request:** Debe enviar `username` y `password`
   - **Response:** Debe devolver `success: true` y los tokens
   - **Status:** Debe ser `200 OK`

6. Ve a la pestaña **Application** (Aplicación) → **Local Storage**
7. Verifica que se hayan guardado:
   - `accessToken`
   - `refreshToken`
   - `user` (con la información del usuario)

### 🐛 Solución de Problemas

#### Problema: "Error al conectar con el servidor"
**Solución:**
- Verifica que el backend esté corriendo en el puerto 3000
- Verifica que no haya errores en la consola del backend
- Verifica la URL en `frontend/src/services/api.js`

#### Problema: "Credenciales inválidas" (pero las credenciales son correctas)
**Solución:**
- Verifica que el usuario exista en la base de datos: `npm run check:users`
- Verifica que el usuario esté activo (`is_active = 1`)
- Verifica que la contraseña sea correcta

#### Problema: El frontend no carga
**Solución:**
- Verifica que el frontend esté corriendo: `npm run dev`
- Verifica que no haya errores en la consola del navegador
- Verifica que el puerto no esté siendo usado por otra aplicación

#### Problema: Error de CORS
**Solución:**
- Verifica que el backend tenga configurado CORS correctamente
- Verifica que la URL del frontend esté en `CORS_ORIGIN` del backend
- El backend debería permitir `http://localhost:5173`

### 📝 Comandos útiles

```bash
# Backend
cd backend
npm run dev              # Iniciar servidor en modo desarrollo
npm run test:db          # Probar conexión a base de datos
npm run check:users      # Ver usuarios disponibles
npm run create:test-user # Crear usuario de prueba

# Frontend
cd frontend
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run preview          # Previsualizar build de producción
```

### ✅ Checklist de Pruebas

- [ ] Backend está corriendo en puerto 3000
- [ ] Frontend está corriendo en puerto 5173 (o el que muestre Vite)
- [ ] Hay al menos un usuario en la base de datos
- [ ] El login funciona con credenciales correctas
- [ ] El login muestra error con credenciales incorrectas
- [ ] El toggle de contraseña funciona
- [ ] "Recordarme" guarda el username
- [ ] Después del login, redirige al dashboard
- [ ] El dashboard muestra la información del usuario
- [ ] El botón "Cerrar Sesión" funciona
- [ ] Las rutas están protegidas (redirige al login si no estás autenticado)
- [ ] Los tokens se guardan en localStorage
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la consola del backend

### 🎉 ¡Listo!

Si todas las pruebas pasan, el sistema de login está funcionando correctamente. 

¿Necesitas ayuda con algo más? Puedes:
- Personalizar los estilos del login
- Agregar más funcionalidades (recuperar contraseña, etc.)
- Mejorar el manejo de errores
- Agregar validaciones adicionales







