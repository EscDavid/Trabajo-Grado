# Configuración de Base de Datos

## Paso 1: Configurar el archivo .env

El archivo `.env` ya está creado en el directorio `backend/`. Necesitas actualizar las siguientes variables según tu configuración de MySQL:

```env
DB_HOST=127.0.0.1          # Dirección del servidor MySQL
DB_PORT=3306               # Puerto de MySQL (por defecto 3306)
DB_USERNAME=root           # Usuario de MySQL
DB_PASSWORD=tu_contraseña  # ⚠️ IMPORTANTE: Agrega tu contraseña aquí
DB_DATABASE=isp_management_system  # Nombre de la base de datos
```

## Paso 2: Verificar que MySQL esté corriendo

Asegúrate de que el servidor MySQL esté ejecutándose:

```bash
# En Linux/Mac
sudo systemctl status mysql
# o
sudo service mysql status

# Si no está corriendo, inícialo:
sudo systemctl start mysql
# o
sudo service mysql start
```

## Paso 3: Verificar que la base de datos exista

Si ya tienes la base de datos `isp_management_system` creada en MySQL Workbench (como se ve en la imagen), puedes continuar.

Si no existe, créala ejecutando en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS isp_management_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

## Paso 4: Probar la conexión

Ejecuta el script de prueba de conexión:

```bash
npm run test:db
```

Si la conexión es exitosa, verás un mensaje de confirmación y las tablas disponibles.

## Paso 5: Iniciar el servidor

Una vez que la conexión funcione, puedes iniciar el servidor:

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## Solución de Problemas

### Error: "Access denied for user 'root'@'localhost'"

**Solución:** Agrega tu contraseña de MySQL en el archivo `.env`:

```env
DB_PASSWORD=tu_contraseña_real_aqui
```

### Error: "Can't connect to MySQL server"

**Solución:** 
1. Verifica que MySQL esté corriendo
2. Verifica que el puerto sea correcto (por defecto 3306)
3. Verifica que el host sea correcto (127.0.0.1 para local)

### Error: "Unknown database 'isp_management_system'"

**Solución:** Crea la base de datos en MySQL Workbench o ejecuta:

```sql
CREATE DATABASE isp_management_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### ¿No recuerdas tu contraseña de MySQL?

Si no recuerdas la contraseña de root, puedes:

1. **Resetear la contraseña de MySQL** (consulta la documentación de MySQL)
2. **Crear un nuevo usuario** con permisos para la base de datos:

```sql
CREATE USER 'isp_user'@'localhost' IDENTIFIED BY 'nueva_contraseña';
GRANT ALL PRIVILEGES ON isp_management_system.* TO 'isp_user'@'localhost';
FLUSH PRIVILEGES;
```

Luego actualiza el `.env` con el nuevo usuario y contraseña.

## Notas Importantes

- ⚠️ **Nunca** subas el archivo `.env` a un repositorio público
- El archivo `.env` debe estar en `.gitignore`
- Para producción, usa variables de entorno del servidor o un gestor de secretos
- La contraseña en `.env` debe coincidir exactamente con la de MySQL (sin espacios extras)








