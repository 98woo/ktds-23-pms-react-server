import { useEffect } from "react";
import w from "../ContentMain.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getApprovalListByApprover } from "../../../http/approvalHttp";
import TableNoPage from "../../../utils/TableNoPage";

export function MemuApproval() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.tokenInfo);
  const { apprCnt, apprList } = useSelector((state) => state.approvalInfo);

  const nonApprList = apprList.filter((appr) => appr.apprYn === null);
  useEffect(() => {
    dispatch(getApprovalListByApprover(token));
  }, [token, dispatch]);
  console.log(nonApprList);
  const supplyNonAppr = nonApprList.filter(
    (appr) => appr.apprType === "SUPPLY"
  );
  const rsupplyNonAppr = nonApprList.filter(
    (appr) => appr.apprType === "RSUPPLY"
  );
  const departmentNonAppr = nonApprList.filter(
    (appr) => appr.apprType === "DEPARTMENT"
  );
  const colums = [
    {
      key: "supplyNonAppr",
      label: "소모품 미결제 건",
      children: supplyNonAppr.length,
    },
    {
      key: "rsupplyNonAppr",
      label: "대여품 미결제 건",
      children: rsupplyNonAppr.length,
    },
    {
      key: "supplyNonAppr",
      label: "부  서 미결제 건",
      children: departmentNonAppr.length,
    },
  ];

  return (
    <>
      {apprCnt !== 0 && (
        <div className={w.cardBodyContent}>
          <div>총 {apprCnt} 개의 승인요청 중</div>
          <div>{nonApprList.length}개의 미승인 건이 있습니다.</div>
          <ul>
            <li>소모품 미결제 건: {supplyNonAppr.length}</li>
            <li>대여품 미결제 건: {rsupplyNonAppr.length}</li>
            <li>부 서 미결제 건: {departmentNonAppr.length}</li>
          </ul>
        </div>
      )}
      {(!apprCnt || apprCnt === 0) && <div>결제 승인 요청건이 없습니다</div>}
    </>
  );
}
