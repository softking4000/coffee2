// ============================================================================
// 파일명: app/kcac/page.tsx
// 역할: '4. KCAC (한국커피아카데미협의회)' 대메뉴의 14개 전체 하위 메뉴
//       (응시현황, 시험접수, 접수확인, 합격확인, 자격증신청, 커피강사등록, 심사위원등록,
//        검정기관등록, 커피교육등록, 커피대회신청, 커피교재신청, 커피증명서신청,
//        커피연수신청, 문제은행신청)를 제공하는 페이지입니다.
// ============================================================================

import React, { Suspense } from "react";
import AssociationPortal from "@/components/AssociationPortal";

export default function KcacPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
          한국커피아카데미협의회(KCAC) 통합 서비스를 불러오는 중입니다...
        </div>
      }
    >
      <AssociationPortal association="KCAC" />
    </Suspense>
  );
}

