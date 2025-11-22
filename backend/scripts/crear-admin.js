-- Eliminar usuarios anteriores de prueba
DELETE FROM users WHERE username IN ('admin', 'superadmin');

-- Crear usuario superadmin con password: 123456
INSERT INTO users (
  username, 
  password_hash, 
  full_name, 
  email, 
  phone,
  role_id, 
  role, 
  is_active, 
  is_verified, 
  failed_login_attempts,
  created_at, 
  updated_at
) VALUES (
  'superadmin',
  '$2b$10$rICgCAzWz5xK6gKVzYQOZeQwJa.XYB7D4KVqgP7P6xZ5WqPvK7Kqu',
  'Super Administrador',
  'superadmin@dabang.com',
  '3009999999',
  1, 
  'admin', 
  1, 
  1, 
  0,
  NOW(), 
  NOW()
);