"use client";

// ============================================================================
// 파일명: app/mypage/page.tsx
// 역할: 수험생 및 회원의 시험 접수내역, 합격/자격증 취득 현황, 증명서·강사·기관 신청 내역을
//       한눈에 확인하고, AES-256-GCM 암호화 보호 상태를 확인할 수 있는 마이페이지입니다.
// ============================================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Award,
  FileCheck,
  Lock,
  LogOut,
  Printer,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  getCurrentSessionUser,
  logoutUserAccount,
  findExamApplications,
  findServiceRequests,
  UserAccountRecord,
  ExamApplicationRecord,
  ServiceRequestRecord,
} from "@/lib/supabase";

export default function MyPage() {
  const [user, setUser] = useState<UserAccountRecord | null>(null);
  const [examApps, setExamApps] = useState<ExamApplicationRecord[]>([]);
  const [serviceReqs, setServiceReqs] = useState<ServiceRequestRecord[]>([]);

  // 비로그인 상태에서 성명+연락처로 빠른 조회 시 사용하는 상태
  const [quickName, setQuickName] = useState<string>("홍길동");
  const [quickPhone, setQuickPhone] = useState<string>("010-1234-5678");

  useEffect(() => {
    const session = getCurrentSessionUser();
    if (session) {
      setUser(session);
      loadMemberData(session.name, session.decryptedPhone || "010-1234-5678");
    } else {
      loadMemberData("홍길동", "010-1234-5678");
    }
  }, []);

  const loadMemberData = async (name: string, phone: string) => {
    const apps = await findExamApplications({ applicantName: name, phone });
    const reqs = await findServiceRequests({ applicantName: name, phone });
    setExamApps(apps);
    setServiceReqs(reqs);
  };

  const handleQuickLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadMemberData(quickName, quickPhone);
  };

  const handleLogout = () => {
    logoutUserAccount();
    setUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. 상단 마이페이지 프로필 및 암호화 보안 상태 배너 */}
      <div className="bg-gradient-to-r from-stone-900 via-[#4A2C2A] to-[#722F37] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-200 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4" />
            <span>AES-256-GCM 개인정보 암호화 보호 적용</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {user ? `${user.name} 님의 통합 마이페이지` : "수험생 접수·합격·자격증 통합 조회"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-200">
            KWAC(와인) 및 KCAC(커피) 자격검정 접수 내역, 합격 자격번호, 각종 증명서 신청 현황을 한곳에서 관리합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-extrabold"
                >
                  관리자 대시보드 이동 →
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> 로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/auth?mode=login"
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-extrabold"
            >
              회원 로그인 / 회원가입 →
            </Link>
          )}
        </div>
      </div>

      {/* 2. 성명 + 연락처 통합 조회 바 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <form
          onSubmit={handleQuickLookup}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-800">
            <UserCheck className="w-5 h-5 text-[#722F37]" />
            <span>조회 대상 수험생(회원) 정보:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
            <input
              type="text"
              required
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="성명 (예: 홍길동)"
              className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
            />
            <input
              type="tel"
              required
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value)}
              placeholder="연락처 (예: 010-1234-5678)"
              className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-extrabold cursor-pointer"
            >
              내역 불러오기
            </button>
          </div>
        </form>
      </div>

      {/* 3. 시험 원서접수 및 합격 내역 섹션 */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#722F37]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
              KWAC · KCAC 시험 접수 및 합격 내역 ({examApps.length}건)
            </h2>
          </div>
          <Link
            href="/kwac?menu=apply"
            className="text-xs font-extrabold text-[#722F37] hover:underline"
          >
            + 신규 시험 원서접수
          </Link>
        </div>

        {examApps.length === 0 ? (
          <p className="text-xs sm:text-sm text-stone-500 py-6 text-center">
            조회된 시험 접수 내역이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examApps.map((app) => {
              const isWine = app.association === "KWAC";
              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-[#faf8f5] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded text-white ${
                          isWine ? "bg-[#722F37]" : "bg-[#4A2C2A]"
                        }`}
                      >
                        {app.association} · {app.examNumber}
                      </span>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
                          app.passStatus === "합격"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.passStatus} ({app.paymentStatus})
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900">
                      {app.qualificationName} ({app.grade}) - {app.examType}
                    </h3>

                    <div className="text-xs text-stone-600 space-y-1">
                      <p>
                        • 응시자: <strong>{app.applicantName}</strong> ({app.decryptedBirth}) /{" "}
                        {app.decryptedPhone}
                      </p>
                      <p>• 지정검정장: {app.trainingCenter}</p>
                      <p>
                        • 점수: 필기{" "}
                        <strong>{app.writtenScore !== null ? `${app.writtenScore}점` : "면제"}</strong>{" "}
                        / 실기{" "}
                        <strong>
                          {app.practicalScore !== null ? `${app.practicalScore}점` : "채점예정"}
                        </strong>
                      </p>
                      {app.certificateNo && (
                        <p className="text-[#722F37] font-bold">
                          • 자격증 번호: {app.certificateNo}
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-[11px] text-stone-400 break-all">
                      <Lock className="w-3 h-3 inline mr-1 text-emerald-600" />
                      암호화 저장문(DB): {app.phoneEncrypted.slice(0, 42)}...
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-950 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> 수험표/합격증 인쇄
                    </button>
                    <Link
                      href={isWine ? "/kwac?menu=cert-issue" : "/kcac?menu=cert-issue"}
                      className="text-xs font-extrabold text-[#722F37] hover:underline"
                    >
                      자격증 발급 신청 →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. 자격증·강사·기관·증명서·교재 신청 내역 섹션 */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#4A2C2A]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
              자격증 · 강사/기관 등록 · 증명서 · 교재 신청 내역 ({serviceReqs.length}건)
            </h2>
          </div>
        </div>

        {serviceReqs.length === 0 ? (
          <p className="text-xs sm:text-sm text-stone-500 py-6 text-center">
            접수된 부가 신청 내역이 없습니다. (KWAC/KCAC 메뉴 또는 고객센터에서 자격증·강사등록·증명서를 신청하면 이곳에 표시됩니다.)
          </p>
        ) : (
          <div className="space-y-3">
            {serviceReqs.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold px-2 py-0.5 rounded bg-stone-800 text-white text-xs">
                      {req.association} · {req.serviceLabel}
                    </span>
                    <span className="text-xs text-stone-500">{req.requestCode}</span>
                  </div>
                  <p className="font-bold text-stone-900">{req.targetItem}</p>
                  <p className="text-xs text-stone-500">
                    신청자: {req.applicantName} ({req.decryptedPhone}) | 신청일: {req.createdAt}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold self-start sm:self-center">
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

