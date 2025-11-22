# 🚀 Prueba Rápida del Login

## ✅ Usuario de Prueba Creado

**Credenciales:**
- **Username:** `testuser`
- **Password:** `Test1234`
- **Email:** `test@example.com`

## 📝 Pasos Rápidos para Probar

### 1. Iniciar el Backend

```bash
cd /home/juan/Trabajo-Grado/backend
npm run dev
```

Espera a ver:
```
✅ SERVIDOR INICIADO EXITOSAMENTE
📍 Puerto:          3000
```

### 2. Iniciar el Frontend

En otra terminal:
```bash
cd /home/juan/Trabajo-Grado/frontend
npm run dev
```

Espera a ver:
```
➜  Local:   http://localhost:5173/
```

### 3. Abrir el Navegador

1. Abre tu navegador
2. Ve a: **http://localhost:5173**

### 4. Hacer Login

1. Ingresa:
   - **Correo Electrónico:** `testuser`
   - **Contraseña:** `Test1234`

2. Haz clic en **"Iniciar Sesión"**

3. **Resultado esperado:** Te redirige al Dashboard y ves la información del usuario

### 5. Verificar que Funciona

- ✅ El botón muestra "Iniciando sesión..." durante la carga
- ✅ Después del login, apareces en el Dashboard
- ✅ Ves tu información de usuario (username, nombre, email)
- ✅ Puedes hacer clic en "Cerrar Sesión"
- ✅ Después de cerrar sesión, no puedes acceder al dashboard sin login

## 🧪 Probar Errores

### Credenciales Incorrectas
- Username: `testuser`
- Password: `password_incorrecta`
- **Resultado:** Debe mostrar error "Credenciales inválidas"

### Toggle de Contraseña
- Ingresa una contraseña
- Haz clic en el icono del ojo 👁️
- **Resultado:** La contraseña se muestra/oculta

### Recordarme
- Marca el checkbox "Recordarme"
- Haz login
- Cierra el navegador
- Abre el navegador de nuevo
- **Resultado:** El username debería estar pre-llenado

## 🔍 Verificar en DevTools

1. Presiona **F12** para abrir DevTools
2. Ve a la pestaña **Network** (Red)
3. Haz login
4. Busca la petición a `/api/auth/login`
5. Verifica:
   - **Request:** Envía `username` y `password`
   - **Response:** Devuelve `success: true` y tokens
6. Ve a **Application** → **Local Storage**
7. Verifica que existan:
   - `accessToken`
   - `refreshToken`
   - `user`

## ⚠️ Si Algo No Funciona

### Backend no inicia
```bash
cd backend
npm run test:db  # Verificar conexión a BD
```

### Frontend no inicia
```bash
cd frontend
npm install  # Reinstalar dependencias si es necesario
```

### Error de CORS
- Verifica que el backend permita `http://localhost:5173`
- Revisa `backend/src/app.js` - CORS_ORIGIN

### Error de autenticación
```bash
cd backend
npm run check:users  # Ver usuarios disponibles
```

## 📚 Más Información

Para más detalles, revisa: `COMO_PROBAR_LOGIN.md`







