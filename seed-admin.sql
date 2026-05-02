-- Insert admin user for ARAS
INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
VALUES (
  'admin-aras-2025',
  'Administrateur ARAS',
  'admin@aras.local',
  'manual',
  'admin',
  NOW(),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  role = 'admin',
  updatedAt = NOW();

-- Verify the admin user was created
SELECT id, openId, name, email, role FROM users WHERE role = 'admin';
