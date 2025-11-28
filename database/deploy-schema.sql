-- ===================================================================
-- JKN-TODOLIST 배포용 통합 데이터베이스 스키마
-- Version: 1.0
-- 생성일: 2025-11-28
-- 설명: Supabase 배포를 위한 완전한 데이터베이스 스키마
-- ===================================================================

-- ===================================================================
-- 1. 기존 테이블 삭제 (재배포 시)
-- ===================================================================
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS public_events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ===================================================================
-- 2. Users Table
-- ===================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===================================================================
-- 3. Todos Table
-- ===================================================================
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    start_date TIMESTAMP,
    due_date TIMESTAMP,
    priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    deleted_status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (deleted_status IN ('ACTIVE', 'DELETED')),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===================================================================
-- 4. Refresh Tokens Table
-- ===================================================================
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===================================================================
-- 5. Public Events Table (공휴일, 기념일, 24절기, 잡절)
-- ===================================================================
CREATE TABLE public_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(20) DEFAULT 'HOLIDAY' CHECK (type IN ('HOLIDAY', 'NOTICE', 'SOLAR_TERM', 'SEASONAL_DAY')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_public_event_date_title UNIQUE (date, title)
);

-- ===================================================================
-- 6. Indexes (성능 최적화)
-- ===================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_deleted_status ON todos(deleted_status);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_public_events_date ON public_events(date);
CREATE INDEX idx_public_events_type ON public_events(type);

-- ===================================================================
-- 7. Trigger Function for updated_at
-- ===================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ===================================================================
-- 8. Triggers
-- ===================================================================
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_events_updated_at
    BEFORE UPDATE ON public_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- 9. Row Level Security (RLS) 설정 (Supabase 권장)
-- ===================================================================
-- Users 테이블 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Todos 테이블 RLS 활성화
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Refresh Tokens 테이블 RLS 활성화
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Public Events 테이블 RLS 활성화
ALTER TABLE public_events ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- 10. RLS Policies
-- ===================================================================

-- Users: 사용자는 자신의 정보만 조회/수정 가능
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Todos: 사용자는 자신의 할일만 조회/생성/수정/삭제 가능
CREATE POLICY "Users can view own todos"
    ON todos FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own todos"
    ON todos FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own todos"
    ON todos FOR UPDATE
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own todos"
    ON todos FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- Refresh Tokens: 사용자는 자신의 토큰만 조회/생성/삭제 가능
CREATE POLICY "Users can view own refresh tokens"
    ON refresh_tokens FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own refresh tokens"
    ON refresh_tokens FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own refresh tokens"
    ON refresh_tokens FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- Public Events: 모든 인증된 사용자가 조회 가능
CREATE POLICY "Anyone can view public events"
    ON public_events FOR SELECT
    TO authenticated
    USING (true);

-- ===================================================================
-- 11. Comments (문서화)
-- ===================================================================
COMMENT ON TABLE users IS '사용자 정보 테이블';
COMMENT ON TABLE todos IS '할일 정보 테이블';
COMMENT ON TABLE refresh_tokens IS 'JWT Refresh Token 테이블';
COMMENT ON TABLE public_events IS '공휴일/기념일/24절기/잡절 정보 테이블';

-- ===================================================================
-- 배포 완료
-- ===================================================================
-- 스키마 버전 확인용 테이블
CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT NOW(),
    description TEXT
);

INSERT INTO schema_version (version, description)
VALUES ('1.0', 'Initial schema deployment for JKN-TODOLIST')
ON CONFLICT (version) DO NOTHING;
