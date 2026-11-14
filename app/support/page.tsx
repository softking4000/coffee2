"use client";

// ============================================================================
// 파일명: app/support/page.tsx
// 역할: '5. 고객센터' 대메뉴의 5개 하위 메뉴를 통합 제공하는 페이지입니다.
//       - tab=notice            : 공지사항 및 시험공고 게시판
//       - tab=faq               : 자주 묻는 질문 (FAQ)
//       - tab=reissue           : 자격증 재발급 신청 (AES-256 암호화 연동)
//       - tab=certificate-proof : 증명서 발급 센터 (경력·위촉·참석증명서)
//       - tab=location          : 오시는 길 (수원 매탄권선역 4번 출구) 및 입금계좌 안내
// ============================================================================

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  HelpCircle,
  FileBadge,
  FileCheck2,
  MapPin,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  CreditCard,
  Train,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { ORG_INFO, SAMPLE_NOTICES } from "@/lib/menu-data";
import { submitServiceRequest, ServiceRequestRecord } from "@/lib/supabase";

function SupportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") || "notice";
  const noticeIdParam = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<string>(tabParam);
  // 공지사항 카테고리 필터
  const [noticeCategory, setNoticeCategory] = useState<string>("전체");
  // 펼쳐진 공지사항 ID
  const [openNoticeId, setOpenNoticeId] = useState<number | null>(
    noticeIdParam ? Number(noticeIdParam) : 1
  );
  // 펼쳐진 FAQ 번호
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // 자격증 재발급 & 증명서 발급 신청 폼 상태
  const [assocChoice, setAssocChoice] = useState<"KWAC" | "KCAC">("KWAC");
  const [targetDoc, setTargetDoc] = useState<string>("상장형 + 카드형 자격증 재발급 세트");
  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantPhone, setApplicantPhone] = useState<string>("");
  const [applicantBirth, setApplicantBirth] = useState<string>("");
  const [applicantAddr, setApplicantAddr] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [savedRequest, setSavedRequest] = useState<ServiceRequestRecord | null>(null);

  useEffect(() => {
    setActiveTab(tabParam);
    setSavedRequest(null);
    if (tabParam === "reissue") {
      setTargetDoc("상장형 + 카드형 자격증 재발급 세트 (30,000원)");
    } else if (tabParam === "certificate-proof") {
      setTargetDoc("강사 강의 경력증명서 (국문)");
    }
  }, [tabParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/support?tab=${tabId}`, { scroll: false });
  };

  // 재발급 / 증명서 신청 제출 함수
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert("신청자 성명과 연락처를 입력해 주세요.");
      return;
    }

    const label =
      activeTab === "reissue" ? "자격증 재발급 신청" : "각종 증명서 발급 신청";

    const res = await submitServiceRequest({
      association: assocChoice,
      serviceType: activeTab === "reissue" ? "cert-issue" : "proof",
      serviceLabel: label,
      applicantName,
      phone: applicantPhone,
      birthOrBizNo: applicantBirth || "-",
      address: applicantAddr || "-",
      targetItem: targetDoc,
      organizationName: "고객센터 온라인 신청",
      detailMemo: memo || "-",
    });

    setSavedRequest(res);
  };

  const tabs = [
    { id: "notice", label: "공지사항", icon: Bell },
    { id: "faq", label: "자주 묻는 질문", icon: HelpCircle },
    { id: "reissue", label: "자격증 재발급 신청", icon: FileBadge },
    { id: "certificate-proof", label: "증명서 발급 센터", icon: FileCheck2 },
    { id: "location", label: "오시는 길·계좌", icon: MapPin },
  ];

  // 자주 묻는 질문 데이터
  const faqList = [
    {
      q: "Q1. 시험 원서접수 후 응시료 입금은 어떻게 하나요?",
      a: "온라인 원서접수 완료 후, 와인(KWAC) 종목은 신한은행 100-028-455336 (한국와인아카데미협의회), 커피(KCAC) 종목은 신한은행 100-028-455457 (한국커피아카데미협의회) 계좌로 응시자 본인 성명으로 입금해 주시면 확인 후 '입금완료'로 승인됩니다.",
    },
    {
      q: "Q2. 커피바리스타 2급과 핸드드립, 와인 디켄팅 서비스는 필기시험이 없나요?",
      a: "네, 맞습니다. 커피바리스타 2급, 커피핸드드립, 커피라떼아트(1·2급), 와인 디켄팅 서비스 종목은 필기시험 없이 실기시험(100점 만점 중 70~80점 이상)만으로 자격 취득이 가능합니다.",
    },
    {
      q: "Q3. 합격 확인 후 자격증은 언제 어떻게 받을 수 있나요?",
      a: "합격자 발표 조회 후 [자격증신청] 메뉴에서 상장형/카드형 자격증을 신청하시면, 매주 정기 제작 후 입력하신 수령 주소 또는 교육 이수 지정검정기관으로 등기 발송됩니다.",
    },
    {
      q: "Q4. 경력증명서, 위촉증명서, 연수 참석증명서는 어디서 발급받나요?",
      a: "본 고객센터의 [증명서 발급 센터] 탭 또는 각 협회(KWAC/KCAC) 하위 메뉴인 [증명서신청]에서 온라인으로 신청하실 수 있습니다.",
    },
    {
      q: "Q5. 아카데미(학원)를 운영 중인데 공식 지정검정장(고사장)으로 등록하려면 어떻게 하나요?",
      a: "KWAC 또는 KCAC 메뉴의 [검정기관등록]에서 시설 현황과 대표자 정보를 입력해 신청해 주시면, 협의회 심사를 거쳐 공식 지정검정기관 인증서와 현판을 교부해 드립니다.",
    },
  ];

  const filteredNotices = SAMPLE_NOTICES.filter((n) =>
    noticeCategory === "전체" ? true : n.category === noticeCategory
  );

  return (
    <div className="pb-16">
      {/* 1. 상단 서브 비주얼 배너 */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#4A2C2A] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-amber-200 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>고객센터</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
            고객센터 및 증명서·재발급 지원
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-2xl">
            공지사항, 자주 묻는 질문(FAQ), 자격증 재발급, 경력·위촉·참석증명서 발급 및 본부 오시는 길을 안내해 드립니다.
          </p>
        </div>
      </section>

      {/* 2. 상단 5개 탭 네비게이션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`py-3.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 탭별 본문 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* =================================================================
            탭 1: 공지사항 (notice)
        ================================================================= */}
        {activeTab === "notice" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                  공지사항 및 시험공고
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  제목을 클릭하시면 공지 상세 내용을 바로 확인하실 수 있습니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {["전체", "시험공고", "KWAC(와인)", "KCAC(커피)", "공통"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNoticeCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      noticeCategory === cat
                        ? "bg-[#722F37] text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
              {filteredNotices.map((notice) => {
                const isOpen = openNoticeId === notice.id;
                return (
                  <div key={notice.id} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenNoticeId(isOpen ? null : notice.id)}
                      className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2 py-1 hover:bg-stone-50 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded shrink-0 ${
                            notice.isImportant
                              ? "bg-[#722F37] text-white"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {notice.category}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-stone-900">
                          {notice.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-400 shrink-0">
                        <span>조회 {notice.views}</span>
                        <span>{notice.date}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? "rotate-180 text-stone-900" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-3 mx-2 p-5 rounded-xl bg-[#faf8f5] border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
                        <p>{notice.content}</p>
                        <p className="text-xs text-stone-500 pt-2 border-t border-stone-200">
                          • 문의처: {ORG_INFO.kwacName} · {ORG_INFO.kcacName} 사무국 (
                          {ORG_INFO.phones.join(" / ")})
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================
            탭 2: 자주 묻는 질문 FAQ (faq)
        ================================================================= */}
        {activeTab === "faq" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                자주 묻는 질문 (FAQ)
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                수험생 및 지정검정기관에서 가장 많이 문의하시는 질문과 답변입니다.
              </p>
            </div>

            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-xl border border-stone-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 bg-stone-50 hover:bg-stone-100 text-left flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-stone-900 cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-5 bg-white text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-200">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================
            탭 3 & 4: 자격증 재발급 신청 (reissue) & 증명서 발급 센터 (certificate-proof)
        ================================================================= */}
        {(activeTab === "reissue" || activeTab === "certificate-proof") && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-[#722F37]">
                  {activeTab === "reissue"
                    ? "CERTIFICATE RE-ISSUANCE"
                    : "OFFICIAL PROOF CERTIFICATE CENTER"}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  {activeTab === "reissue"
                    ? "자격증 온라인 재발급 신청"
                    : "경력 · 위촉 · 참석증명서 온라인 발급 신청"}
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  {activeTab === "reissue"
                    ? "분실 또는 훼손된 상장형 자격증 및 플라스틱 카드형 자격증을 재발급 신청합니다."
                    : "강사 경력증명서, 심사위원 위촉증명서, 세미나 및 산지 연수 참석증명서를 발급 신청합니다."}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" /> 개인정보 AES-256 암호화 보호
              </span>
            </div>

            {savedRequest && (
              <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    신청이 정상 접수되었습니다! (접수번호: {savedRequest.requestCode})
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  주관협회: <strong>{savedRequest.association}</strong> | 신청항목:{" "}
                  <strong>{savedRequest.targetItem}</strong> | 신청자:{" "}
                  {savedRequest.applicantName} ({savedRequest.decryptedPhone})
                </p>
              </div>
            )}

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    1. 주관 협회 선택 *
                  </label>
                  <select
                    value={assocChoice}
                    onChange={(e) => setAssocChoice(e.target.value as "KWAC" | "KCAC")}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white font-bold"
                  >
                    <option value="KWAC">KWAC (한국와인아카데미협의회)</option>
                    <option value="KCAC">KCAC (한국커피아카데미협의회)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    2. 신청 구분 및 증명서 종류 *
                  </label>
                  <select
                    value={targetDoc}
                    onChange={(e) => setTargetDoc(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white font-bold"
                  >
                    {activeTab === "reissue" ? (
                      <>
                        <option value="상장형 + 카드형 자격증 재발급 세트 (30,000원)">
                          상장형 + 카드형 자격증 재발급 세트 (30,000원)
                        </option>
                        <option value="상장형 자격증(A4 케이스) 단독 재발급 (20,000원)">
                          상장형 자격증(A4 케이스) 단독 재발급 (20,000원)
                        </option>
                        <option value="카드형 자격증(PVC) 단독 재발급 (15,000원)">
                          카드형 자격증(PVC) 단독 재발급 (15,000원)
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="강사 강의 경력증명서 (국문)">
                          강사 강의 경력증명서 (국문)
                        </option>
                        <option value="실기 심사위원 위촉증명서">
                          실기 심사위원 위촉증명서
                        </option>
                        <option value="세미나 · 직무연수 참석증명서">
                          세미나 · 직무연수 참석증명서
                        </option>
                        <option value="자격취득 사실 확인 증명서 (국문/영문)">
                          자격취득 사실 확인 증명서 (국문/영문)
                        </option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    3. 신청자 성명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    4. 연락처 (AES-256 암호화 저장) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    5. 생년월일 (암호화 저장)
                  </label>
                  <input
                    type="date"
                    value={applicantBirth}
                    onChange={(e) => setApplicantBirth(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    6. 수령 주소 또는 이메일 (암호화 저장)
                  </label>
                  <input
                    type="text"
                    value={applicantAddr}
                    onChange={(e) => setApplicantAddr(e.target.value)}
                    placeholder="우편 수령지 주소 또는 이메일 주소"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                    7. 취득 종목명 및 제출 용도 기재
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 와인 소믈리에 1급 / 커피바리스타 1급 (대학 및 기관 제출용)"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#722F37] hover:bg-[#59232a] text-white font-extrabold text-sm shadow-md cursor-pointer"
              >
                온라인 신청 접수하기
              </button>
            </form>
          </div>
        )}

        {/* =================================================================
            탭 5: 오시는 길 및 입금계좌 안내 (location)
        ================================================================= */}
        {activeTab === "location" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                LOCATION & CONTACT INFO
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                협의회 본부 오시는 길 및 입금계좌 안내
              </h2>
            </div>

            {/* 시각적 약도 및 지하철 안내 배너 */}
            <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black">
                  <Train className="w-4 h-4" />
                  <span>수인분당선 매탄권선역 4번 출구 도보 인접</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold">
                  {ORG_INFO.kwacName} · {ORG_INFO.kcacName} 중앙본부
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-stone-200">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>도로명 주소 1:</strong> {ORG_INFO.addressMain}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>도로명 주소 2:</strong> {ORG_INFO.addressSub}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>
                      <strong>대표전화:</strong> {ORG_INFO.phones.join(" / ")}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>
                      <strong>공식 이메일:</strong> {ORG_INFO.email}
                    </span>
                  </p>
                </div>
              </div>

              {/* 우측 시각적 약도 다이어그램 */}
              <div className="lg:col-span-5 bg-white/10 rounded-xl p-5 border border-white/20 text-center space-y-3">
                <p className="text-xs font-bold text-amber-300">지하철 이용 안내</p>
                <div className="p-4 rounded-xl bg-amber-400/20 border border-amber-300/40">
                  <p className="text-sm font-extrabold text-white">
                    수인분당선 [매탄권선역] 하차
                  </p>
                  <p className="text-xs text-amber-200 mt-1">
                    4번 출구로 나와 동탄원천로881번길 / 권선로820번길 방면
                  </p>
                </div>
                <p className="text-[11px] text-stone-300">
                  상담시간: {ORG_INFO.operatingHours}
                </p>
              </div>
            </div>

            {/* 공식 지정 은행 계좌 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ORG_INFO.bankAccounts.map((acc) => (
                <div
                  key={acc.accountNumber}
                  className="p-6 rounded-2xl border-2 border-stone-200 bg-[#faf8f5] space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#722F37]">
                    <CreditCard className="w-4 h-4" />
                    <span>{acc.org} 공식 입금계좌</span>
                  </div>
                  <p className="text-2xl font-black text-stone-900">
                    {acc.bank} {acc.accountNumber}
                  </p>
                  <p className="text-xs text-stone-600">예금주: {acc.holder}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
          고객센터 페이지를 불러오는 중입니다...
        </div>
      }
    >
      <SupportContent />
    </Suspense>
  );
}

