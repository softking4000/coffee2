"use client";

// ============================================================================
// 파일명: app/admin/page.tsx
// 역할: KWAC(한국와인아카데미협의회) 및 KCAC(한국커피아카데미협의회) 통합 관리자 페이지입니다.
//       1) 시험 원서접수자의 응시료 입금확인, 필기/실기 점수 입력, 최종 합격 처리 및 자격번호 부여
//       2) 자격증 발급, 강사/심사위원/지정검정기관 등록, 증명서/교재 신청건의 승인 상태 변경
//       3) AES-256-GCM으로 암호화되어 저장된 개인정보 복호화 열람 및 보안 상태 점검
// ============================================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  FileCheck2,
  Lock,
  Save,
  RefreshCw,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  getAllExamApplicationsForAdmin,
  updateExamApplicationByAdmin,
  getAllServiceRequestsForAdmin,
  updateServiceRequestStatusByAdmin,
  ExamApplicationRecord,
  ServiceRequestRecord,
} from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"exams" | "requests">("exams");
  const [examList, setExamList] = useState<ExamApplicationRecord[]>([]);
  const [requestList, setRequestList] = useState<ServiceRequestRecord[]>([]);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // 데이터 로드 함수
  const loadAdminData = async () => {
    const apps = await getAllExamApplicationsForAdmin();
    const reqs = await getAllServiceRequestsForAdmin();
    setExamList(apps);
    setRequestList(reqs);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // 개별 수험생 점수/합격/입금 상태 로컬 수정 핸들러
  const handleExamFieldChange = (
    id: string,
    field: keyof ExamApplicationRecord,
    value: string | number | null
  ) => {
    setExamList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // 수정된 수험생 채점/합격 결과 저장
  const handleSaveExamRow = async (row: ExamApplicationRecord) => {
    const autoCertNo =
      row.passStatus === "합격" && !row.certificateNo
        ? `${row.association}-2026-${Math.floor(1000 + Math.random() * 9000)}`
        : row.certificateNo;

    await updateExamApplicationByAdmin(row.id, {
      paymentStatus: row.paymentStatus,
      writtenScore: row.writtenScore,
      practicalScore: row.practicalScore,
      passStatus: row.passStatus,
      certificateNo: autoCertNo,
    });

    await loadAdminData();
    setSavedNotice(
      `[${row.examNumber}] ${row.applicantName} 수험생의 입금·점수·합격 정보가 저장되었습니다.`
    );
    setTimeout(() => setSavedNotice(null), 3500);
  };

  // 부가 신청(자격증/강사/기관/증명서 등) 상태 변경 저장
  const handleChangeRequestStatus = async (
    id: string,
    newStatus: "접수완료" | "심사중" | "발급/승인완료"
  ) => {
    await updateServiceRequestStatusByAdmin(id, newStatus);
    await loadAdminData();
    setSavedNotice(`신청 건의 처리 상태가 '${newStatus}'(으)로 변경되었습니다.`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const totalPaid = examList.filter((e) => e.paymentStatus === "입금완료").length;
  const totalPassed = examList.filter((e) => e.passStatus === "합격").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. 상단 관리자 헤더 배너 */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4" />
            <span>KWAC · KCAC ADMINISTRATOR CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            통합 자격검정 및 신청 관리 시스템 (관리자)
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            수험생 응시료 입금 승인, 필기·실기 점수 채점, 합격 발표 및 강사·기관·증명서 신청을 실시간 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> 데이터 새로고침
        </button>
      </div>

      {/* 2. 요약 통계 카드 4종 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-bold text-stone-500">전체 시험 원서접수</p>
          <p className="text-2xl font-black text-stone-900 mt-1">{examList.length}건</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-bold text-stone-500">응시료 입금완료</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{totalPaid}건</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-bold text-stone-500">최종 합격 처리</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{totalPassed}명</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs font-bold text-stone-500">자격증·강사·기관·증명서 신청</p>
          <p className="text-2xl font-black text-[#722F37] mt-1">{requestList.length}건</p>
        </div>
      </div>

      {/* 저장 알림 토스트 */}
      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 3. 관리 탭 전환 버튼 */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("exams")}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer ${
            activeTab === "exams"
              ? "bg-[#722F37] text-white"
              : "bg-white border border-stone-200 text-stone-700"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>1. 시험 원서접수 및 채점·합격 관리 ({examList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer ${
            activeTab === "requests"
              ? "bg-[#4A2C2A] text-amber-100"
              : "bg-white border border-stone-200 text-stone-700"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>2. 자격증·강사·기관·증명서 신청 관리 ({requestList.length})</span>
        </button>
      </div>

      {/* =====================================================================
          탭 1: 시험 원서접수 및 채점·합격 관리 테이블
      ===================================================================== */}
      {activeTab === "exams" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-stone-900">
              수험생별 입금확인 · 필기/실기 점수 입력 · 합격 판정
            </h2>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> AES-256-GCM 암호화 데이터 복호화 열람 중
            </span>
          </div>

          <div className="space-y-4">
            {examList.map((row) => {
              const isWine = row.association === "KWAC";
              return (
                <div
                  key={row.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-[#faf8f5] space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded text-white ${
                          isWine ? "bg-[#722F37]" : "bg-[#4A2C2A]"
                        }`}
                      >
                        {row.association} · {row.examNumber}
                      </span>
                      <span className="text-sm font-extrabold text-stone-900">
                        {row.qualificationName} ({row.grade}) [{row.examType}]
                      </span>
                      <span className="text-xs text-stone-500">
                        | 응시자: <strong>{row.applicantName}</strong> ({row.decryptedPhone} /{" "}
                        {row.decryptedBirth})
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">
                      고사장: {row.trainingCenter} | 응시료: {row.feeAmount}
                    </span>
                  </div>

                  {/* 입금 / 점수 / 합격 / 자격번호 입력 컨트롤 */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        응시료 입금상태
                      </label>
                      <select
                        value={row.paymentStatus}
                        onChange={(e) =>
                          handleExamFieldChange(
                            row.id,
                            "paymentStatus",
                            e.target.value as "입금대기" | "입금완료"
                          )
                        }
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-bold"
                      >
                        <option value="입금대기">입금대기</option>
                        <option value="입금완료">입금완료</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        필기점수 (면제시 공란)
                      </label>
                      <input
                        type="number"
                        value={row.writtenScore ?? ""}
                        onChange={(e) =>
                          handleExamFieldChange(
                            row.id,
                            "writtenScore",
                            e.target.value === "" ? null : Number(e.target.value)
                          )
                        }
                        placeholder="예: 84"
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        실기점수
                      </label>
                      <input
                        type="number"
                        value={row.practicalScore ?? ""}
                        onChange={(e) =>
                          handleExamFieldChange(
                            row.id,
                            "practicalScore",
                            e.target.value === "" ? null : Number(e.target.value)
                          )
                        }
                        placeholder="예: 88"
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        최종 합격 판정
                      </label>
                      <select
                        value={row.passStatus}
                        onChange={(e) =>
                          handleExamFieldChange(
                            row.id,
                            "passStatus",
                            e.target.value as "검정예정" | "합격" | "불합격"
                          )
                        }
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-bold"
                      >
                        <option value="검정예정">검정예정</option>
                        <option value="합격">합격 (자격번호 부여)</option>
                        <option value="불합격">불합격</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveExamRow(row)}
                      className="py-2 px-4 rounded-lg bg-stone-900 hover:bg-[#722F37] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>저장 반영</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          탭 2: 자격증·강사·기관·증명서·교재 신청 승인 관리
      ===================================================================== */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-lg font-extrabold text-stone-900">
            자격증 발급 · 강사/심사위원/지정검정장 등록 · 증명서 신청 승인 관리
          </h2>

          {requestList.length === 0 ? (
            <p className="text-xs sm:text-sm text-stone-500 py-8 text-center">
              현재 접수된 부가 신청 내역이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {requestList.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-stone-200 bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold px-2 py-0.5 rounded bg-stone-800 text-white text-xs">
                        {req.association} · {req.serviceLabel}
                      </span>
                      <span className="text-xs text-stone-500">{req.requestCode}</span>
                    </div>
                    <p className="font-extrabold text-stone-900">{req.targetItem}</p>
                    <p className="text-xs text-stone-600">
                      신청자: <strong>{req.applicantName}</strong> ({req.decryptedPhone}) | 소속:{" "}
                      {req.organizationName} | 수령지: {req.decryptedAddress}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {(["접수완료", "심사중", "발급/승인완료"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleChangeRequestStatus(req.id, st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                          req.status === st
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

