// ============================================================================
// 파일명: app/kwac/page.tsx
// 역할: '3. KWAC (한국와인아카데미협의회)' 대메뉴의 14개 전체 하위 메뉴
//       (응시현황, 시험접수, 접수확인, 합격확인, 자격증신청, 와인강사등록, 심사위원등록,
//        검정기관등록, 와인교육등록, 와인대회신청, 와인교재신청, 와인증명서신청,
//        와인연수신청, 문제은행신청)를 제공하는 페이지입니다.
// ============================================================================

import React, { Suspense } from "react";
import AssociationPortal from "@/components/AssociationPortal";

export default function KwacPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
          한국와인아카데미협의회(KWAC) 통합 서비스를 불러오는 중입니다...
        </div>
      }
    >
      <AssociationPortal association="KWAC" />
    </Suspense>
  );
}

