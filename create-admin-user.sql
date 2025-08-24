-- Create admin user in Google Cloud SQL
-- Password: admin123 (hashed with bcrypt)

INSERT INTO app_users (
  email, 
  name, 
  password, 
  company, 
  role, 
  "emailVerified", 
  phone, 
  city, 
  country,
  "createdAt", 
  "updatedAt"
) VALUES (
  'admin@fixingmaritime.com',
  'System Administrator',
  '$2a$12$LQv3c1yqBwEHXrjlXWNEeOhfKzwwAMKU5YcPwCd1pGj2MpfRlKJ1C', -- bcrypt hash of 'admin123'
  'Fixing Maritime',
  'super_admin',
  true,
  '+1 (555) 123-4567',
  'New York', 
  'United States',
  NOW(),
  NOW()
) 
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password = EXCLUDED.password,
  company = EXCLUDED.company,
  role = EXCLUDED.role,
  "emailVerified" = EXCLUDED."emailVerified",
  phone = EXCLUDED.phone,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  "updatedAt" = NOW();

-- Verify the user was created
SELECT 
  id,
  email, 
  name, 
  role, 
  "emailVerified",
  "createdAt"
FROM app_users 
WHERE email = 'admin@fixingmaritime.com';