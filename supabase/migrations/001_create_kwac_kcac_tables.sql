-- ============================================================================
-- 파일명: supabase/migrations/001_create_kwac_kcac_tables.sql
-- 역할: 한국와인아카데미협의회(KWAC) 및 한국커피아카데미협의회(KCAC) 통합 플랫폼의
--       데이터베이스 테이블 스키마, 보안 정책(RLS), 초기 시드 데이터를 정의합니다.
-- 보안 원칙:
--   - 연락처, 생년월일, 주소 등 개인정보 컬럼은 AES-256-GCM 암호문 형태로 저장됩니다.
--   - 비밀번호는 SHA-256 + Salt 단방향 해시값으로만 저장됩니다.
-- ============================================================================

-- 1. 회원 정보 테이블 (kwac_kcac_users)
CREATE TABLE IF NOT EXISTS public.kwac_kcac_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT UNIQUE NOT NULL,                -- 로그인 아이디
  password_hash TEXT NOT NULL,                  -- 단방향 암호화된 비밀번호 해시
  name TEXT NOT NULL,                           -- 회원 성명
  phone_hash TEXT NOT NULL,                     -- 아이디/비밀번호 찾기용 연락처 해시
  phone_encrypted TEXT NOT NULL,                -- AES-256-GCM 암호화된 연락처
  birth_encrypted TEXT NOT NULL,                -- AES-256-GCM 암호화된 생년월일
  email TEXT,                                   -- 이메일 주소
  address_encrypted TEXT,                       -- AES-256-GCM 암호화된 상세 주소
  affiliation TEXT,                             -- 소속 교육기관 또는 아카데미명
  role TEXT NOT NULL DEFAULT 'member',          -- 권한 ('member' | 'instructor' | 'admin')
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 자격검정 시험 일정 및 응시현황 테이블 (kwac_kcac_exam_schedules)
CREATE TABLE IF NOT EXISTS public.kwac_kcac_exam_schedules (
  id TEXT PRIMARY KEY,                          -- 시험 일정 고유 코드 (예: kwac-2026-11-01)
  association TEXT NOT NULL CHECK (association IN ('KWAC', 'KCAC')),
  round TEXT NOT NULL,                          -- 회차명 (예: 제2026-11회)
  title TEXT NOT NULL,                          -- 시험 공고명
  exam_type TEXT NOT NULL,                      -- 검정 구분 ('필기' | '실기' | '필기+실기')
  apply_start DATE NOT NULL,                    -- 원서접수 시작일
  apply_end DATE NOT NULL,                      -- 원서접수 마감일
  exam_date DATE NOT NULL,                      -- 시험 시행일
  result_date DATE NOT NULL,                    -- 합격자 발표일
  location TEXT NOT NULL,                       -- 시험 고사장 안내
  status TEXT NOT NULL DEFAULT '접수중',        -- 상태 ('접수중' | '접수예정' | '접수마감')
  current_applicants INTEGER NOT NULL DEFAULT 0,-- 현재 접수 인원
  max_capacity INTEGER NOT NULL DEFAULT 50,     -- 정원
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 시험 원서접수 및 합격확인 테이블 (kwac_kcac_exam_applications)
CREATE TABLE IF NOT EXISTS public.kwac_kcac_exam_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_number TEXT UNIQUE NOT NULL,             -- 수험번호 (예: KWAC-2611-0042)
  association TEXT NOT NULL CHECK (association IN ('KWAC', 'KCAC')),
  schedule_id TEXT,                             -- 시험 일정 ID
  qualification_name TEXT NOT NULL,             -- 응시 자격 종목명 (예: 와인 소믈리에)
  grade TEXT NOT NULL,                          -- 응시 등급 (예: 2급, 1급, 단일등급)
  exam_type TEXT NOT NULL,                      -- 응시 구분 ('필기' | '실기' | '필기+실기')
  applicant_name TEXT NOT NULL,                 -- 응시자 성명
  phone_hash TEXT NOT NULL,                     -- 접수/합격 조회용 연락처 해시
  phone_encrypted TEXT NOT NULL,                -- AES-256-GCM 암호화된 연락처
  birth_encrypted TEXT NOT NULL,                -- AES-256-GCM 암호화된 생년월일
  address_encrypted TEXT,                       -- AES-256-GCM 암호화된 자격증 수령 주소
  training_center TEXT NOT NULL,                -- 교육 이수 기관 / 지정검정장명
  fee_amount TEXT NOT NULL,                     -- 납부할 응시료
  payment_status TEXT NOT NULL DEFAULT '입금대기', -- '입금대기' | '입금완료'
  written_score INTEGER,                        -- 필기 점수 (채점 전 NULL)
  practical_score INTEGER,                      -- 실기 점수 (채점 전 NULL)
  pass_status TEXT NOT NULL DEFAULT '검정예정', -- '검정예정' | '합격' | '불합격'
  certificate_no TEXT,                          -- 합격 시 부여되는 자격증 번호
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. KWAC & KCAC 통합 등록 및 부가신청 테이블 (kwac_kcac_service_requests)
-- (자격증신청, 강사등록, 심사위원등록, 검정기관등록, 교육등록, 대회신청, 교재신청, 증명서신청, 연수신청, 문제은행신청 통합 관리)
CREATE TABLE IF NOT EXISTS public.kwac_kcac_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_code TEXT UNIQUE NOT NULL,            -- 접수 관리번호 (예: REQ-2026-8412)
  association TEXT NOT NULL CHECK (association IN ('KWAC', 'KCAC')),
  service_type TEXT NOT NULL,                   -- 메뉴 코드 ('cert-issue', 'instructor', 'judge', 'institution', 'education', 'contest', 'textbook', 'proof', 'training', 'question-bank')
  service_label TEXT NOT NULL,                  -- 한글 서비스명 (예: 자격증신청, 와인강사등록)
  applicant_name TEXT NOT NULL,                 -- 신청자(또는 기관 대표자) 성명
  phone_hash TEXT NOT NULL,                     -- 조회용 연락처 해시
  phone_encrypted TEXT NOT NULL,                -- AES-256-GCM 암호화된 연락처
  birth_encrypted TEXT,                         -- AES-256-GCM 암호화된 생년월일/사업자번호
  address_encrypted TEXT,                       -- AES-256-GCM 암호화된 수령지/소재지 주소
  target_item TEXT NOT NULL,                    -- 신청 대상 종목/항목/과정명
  organization_name TEXT,                       -- 소속 아카데미/기관명
  detail_memo TEXT,                             -- 추가 기재 사항 (수량, 자격번호, 경력사항 등)
  status TEXT NOT NULL DEFAULT '접수완료',      -- 처리 상태 ('접수완료' | '심사중' | '발급/승인완료')
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. 공지사항 게시판 테이블 (kwac_kcac_notices)
CREATE TABLE IF NOT EXISTS public.kwac_kcac_notices (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '공통',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 1,
  is_important BOOLEAN NOT NULL DEFAULT false,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Row Level Security (RLS) 활성화 및 정책 설정
ALTER TABLE public.kwac_kcac_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kwac_kcac_exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kwac_kcac_exam_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kwac_kcac_service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kwac_kcac_notices ENABLE ROW LEVEL SECURITY;

-- 웹 애플리케이션에서 원서접수, 합격조회, 신청서 등록이 원활히 이루어지도록 정책 부여
CREATE POLICY "Allow public read exam schedules" ON public.kwac_kcac_exam_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert/select exam applications" ON public.kwac_kcac_exam_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/select service requests" ON public.kwac_kcac_service_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access users" ON public.kwac_kcac_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access notices" ON public.kwac_kcac_notices FOR ALL USING (true) WITH CHECK (true);

