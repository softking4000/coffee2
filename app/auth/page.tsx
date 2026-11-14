"use client";

// ============================================================================
// 파일명: app/auth/page.tsx
// 역할: 회원 로그인, 신규 회원가입(AES-256 개인정보 암호화 & SHA-256 비밀번호 해시),
//       아이디/비밀번호 찾기 안내를 제공하는 통합 인증 페이지입니다.
// ============================================================================

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  UserPlus,
  Lock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { registerUserAccount, loginUserAccount } from "@/lib/supabase";
import { ORG_INFO } from "@/lib/menu-data";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get("mode") || "login";

  // 'login' | 'register' | 'find'
  const [mode, setMode] = useState<string>(modeParam);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  // 로그인 입력 상태
  const [loginId, setLoginId] = useState<string>("");
  const [loginPw, setLoginPw] = useState<string>("");

  // 회원가입 입력 상태
  const [regId, setRegId] = useState<string>("");
  const [regPw, setRegPw] = useState<string>("");
  const [regName, setRegName] = useState<string>("");
  const [regPhone, setRegPhone] = useState<string>("");
  const [regBirth, setRegBirth] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regAddr, setRegAddr] = useState<string>("");
  const [regAffiliation, setRegAffiliation] = useState<string>("");

  useEffect(() => {
    setMode(modeParam);
    setMessage(null);
  }, [modeParam]);

  // 로그인 실행 핸들러
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUserAccount(loginId, loginPw);
    if (!res.ok) {
      setMessage({ type: "err", text: res.message });
      return;
    }
    router.push("/mypage");
  };

  // 데모 계정(홍길동 / admin) 원클릭 로그인
  const handleDemoLogin = async () => {
    await loginUserAccount("admin", "admin1234");
    router.push("/mypage");
  };

  // 회원가입 실행 핸들러 (비밀번호 해싱 + 개인정보 AES-256 암호화)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regId || !regPw || !regName || !regPhone || !regBirth) {
      setMessage({
        type: "err",
        text: "아이디, 비밀번호, 성명, 연락처, 생년월일은 필수 입력 항목입니다.",
      });
      return;
    }

    const res = await registerUserAccount({
      loginId: regId,
      passwordPlain: regPw,
      name: regName,
      phone: regPhone,
      birth: regBirth,
      email: regEmail,
      address: regAddr,
      affiliation: regAffiliation || "개인회원",
    });

    if (!res.ok) {
      setMessage({ type: "err", text: res.message });
      return;
    }

    router.push("/mypage");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* 상단 모드 전환 탭 */}
        <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-50 text-xs sm:text-sm font-extrabold">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-4 flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "login"
                ? "bg-[#722F37] text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <User className="w-4 h-4" /> 로그인
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`py-4 flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "register"
                ? "bg-[#4A2C2A] text-amber-100"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <UserPlus className="w-4 h-4" /> 회원가입
          </button>
          <button
            type="button"
            onClick={() => setMode("find")}
            className={`py-4 flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "find"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <KeyRound className="w-4 h-4" /> 계정찾기
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* 암호화 보안 안내 배지 */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              비밀번호는 <strong>SHA-256 솔트 해싱</strong>, 연락처·생년월일·주소는{" "}
              <strong>AES-256-GCM 암호화</strong>되어 저장됩니다.
            </span>
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold ${
                message.type === "ok"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* ===============================================================
              모드 1: 로그인 폼
          =============================================================== */}
          {mode === "login" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-extrabold text-stone-900">
                  KWAC · KCAC 통합 회원 로그인
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  하나의 계정으로 한국와인아카데미협의회와 한국커피아카데미협의회 서비스를 모두 이용하실 수 있습니다.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    아이디
                  </label>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#722F37] hover:bg-[#59232a] text-white font-extrabold text-sm shadow-sm cursor-pointer"
                >
                  로그인하기
                </button>
              </form>

              {/* 원클릭 체험 로그인 버튼 */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>데모 계정(홍길동 / 관리자 겸용) 원클릭 자동 로그인</span>
                </button>
              </div>
            </div>
          )}

          {/* ===============================================================
              모드 2: 회원가입 폼
          =============================================================== */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h1 className="text-xl font-extrabold text-stone-900">
                  KWAC · KCAC 신규 회원가입
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  수험생, 강사, 심사위원, 지정검정기관 대표자 모두 가입 가능합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    로그인 아이디 *
                  </label>
                  <input
                    type="text"
                    required
                    value={regId}
                    onChange={(e) => setRegId(e.target.value)}
                    placeholder="영문/숫자 조합"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    비밀번호 (해시 암호화) *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPw}
                    onChange={(e) => setRegPw(e.target.value)}
                    placeholder="8자 이상 권장"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    성명 (실명) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    휴대폰 연락처 (AES 암호화) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    생년월일 (AES 암호화) *
                  </label>
                  <input
                    type="date"
                    required
                    value={regBirth}
                    onChange={(e) => setRegBirth(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    소속 아카데미/학교명
                  </label>
                  <input
                    type="text"
                    value={regAffiliation}
                    onChange={(e) => setRegAffiliation(e.target.value)}
                    placeholder="예: 수원 와인&커피 아카데미"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    우편물 수령 주소 (AES 암호화)
                  </label>
                  <input
                    type="text"
                    value={regAddr}
                    onChange={(e) => setRegAddr(e.target.value)}
                    placeholder="자격증 및 증명서 수령 주소"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#4A2C2A] hover:bg-[#361f1e] text-amber-100 font-extrabold text-sm shadow-sm cursor-pointer"
              >
                개인정보 암호화 동의 및 회원가입 완료
              </button>
            </form>
          )}

          {/* ===============================================================
              모드 3: 아이디/비밀번호 찾기 안내
          =============================================================== */}
          {mode === "find" && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <h2 className="text-lg font-extrabold text-stone-900">
                아이디 · 비밀번호 찾기 및 비회원 조회 안내
              </h2>
              <p className="leading-relaxed">
                • 시험 접수확인 및 합격조회는 로그인 없이도{" "}
                <Link
                  href="/kwac?menu=verify"
                  className="text-[#722F37] font-extrabold underline"
                >
                  [접수확인]
                </Link>{" "}
                및{" "}
                <Link
                  href="/kwac?menu=result"
                  className="text-[#722F37] font-extrabold underline"
                >
                  [합격확인]
                </Link>{" "}
                메뉴에서 성명과 휴대폰 번호로 즉시 조회가 가능합니다.
              </p>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <p className="font-bold text-stone-900">고객센터 계정 초기화 지원</p>
                <p>대표전화: {ORG_INFO.phones.join(" / ")}</p>
                <p>이메일: {ORG_INFO.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
          인증 페이지를 불러오는 중입니다...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

