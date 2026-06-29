CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  requester TEXT NOT NULL,
  department TEXT,
  item TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  deadline DATE,
  status TEXT DEFAULT 'создана',
  description TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
