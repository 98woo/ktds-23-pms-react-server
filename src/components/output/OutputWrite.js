import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadForWriteOutputData, writeOutput } from "../../http/outputHttp";
import styles from "./output.module.css";
import ConfirmModal from "../common/modal/ConfirmModal";
import AlertModal from "../common/modal/AlertModal";

export default function OutoutWrite() {
  const [writeOutputData, setWriteOutputData] = useState({
    projectList: [], // 프로젝트 리스트
    outputType: [], // 산출물 타입
    prjSts: [], // 프로젝트 진행상태(산출물 버전)
  });
  const [writeErrors, setWriteErrors] = useState({
    outTtl: [], // 산출물 제목
    prjId: [], // 프로젝트
    outType: [], // 산출물 타입
    outVer: [], // 프로젝트 진행상태
    outFile: [], // 산출물 파일
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // const query = new URLSearchParams(useLocation().search);
  // const prjNameValue = query.get("prjName");

  const location = useLocation();
  const projectValue = location.state || {};

  const token = localStorage.getItem("token");

  // FormData 전송을 위한 Ref
  const outTtlRef = useRef(); // 산출물 제목
  const prjIdRef = useRef(); // 프로젝트 ID
  const outTypeRef = useRef(); // 산출물 종류
  const outVerRef = useRef(); // 프로젝트 진행상태
  const fileRef = useRef(); // 첨부파일

  // React Router의 Path를 이동시키는 Hook
  // Spring의 redirect와 유사.
  const navigate = useNavigate();

  const { prjIdValue } = useParams();

  const onClickHandler = () => {
    navigate(`/output/${prjIdValue}`, {
      state: { project: projectValue.project },
    });
  };

  const onWriteClickHandler = async () => {
    const check = window.confirm("등록하시겠습니까?");
    if (check) {
      setWriteErrors({
        outTtl: [],
        prjId: [],
        outType: [],
        outVer: [],
        outFile: [],
      });

      const outTtl = outTtlRef.current.value; // 산출물 제목
      const prjId = prjIdValue; // 프로젝트 ID
      const outType = outTypeRef.current.value; // 산출물 종류
      const outVer = outVerRef.current.value; // 프로젝트 진행상태(산출물 버전)
      const file = fileRef.current.files[0]; // 첨부파일
      console.log(fileRef, "aswefawrg");

      if (file === undefined) {
        handleOpenModal();
        return;
      }

      const formData = new FormData();
      formData.append("outTtl", outTtl);
      formData.append("prjId", prjId);
      formData.append("outType", outType);
      formData.append("outVer", outVer);
      formData.append("file", file);
      console.log("formData: ", formData);

      const json = await writeOutput(token, formData);
      if (json.body === true) {
        navigate(`/output/${prjIdValue}`, {
          state: { project: projectValue.project },
        });
      }
      if (json.body !== (true || false)) {
        setWriteErrors(json.body);
      }
    }
  };

  // 등록 버튼 누를 시 Confirm Modal창 열기
  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // Confirm Modal 창에서 "아니오" 클릭 시 Modal 창 닫힘
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // Confirm Modal 창에서 "예" 클릭 시 목록으로 이동
  const handleConfirm = async () => {
    setWriteErrors({
      outTtl: [],
      prjId: [],
      outType: [],
      outVer: [],
      outFile: [],
    });

    const outTtl = outTtlRef.current.value; // 산출물 제목
    const prjId = prjIdValue; // 프로젝트 ID
    const outType = outTypeRef.current.value; // 산출물 종류
    const outVer = outVerRef.current.value; // 프로젝트 진행상태(산출물 버전)
    const file = fileRef.current.files[0]; // 첨부파일
    console.log(fileRef, "aswefawrg");

    if (file === undefined) {
      handleOpenModal();
      return;
    }

    const formData = new FormData();
    formData.append("outTtl", outTtl);
    formData.append("prjId", prjId);
    formData.append("outType", outType);
    formData.append("outVer", outVer);
    formData.append("file", file);
    console.log("formData: ", formData);

    const json = await writeOutput(token, formData);
    if (json.body === true) {
      navigate(`/output/${prjIdValue}`, {
        state: { project: projectValue.project },
      });
    }
    if (json.body !== (true || false)) {
      setWriteErrors(json.body);
    }

    setShowConfirmModal(false);
  };

  // Alert Modal 창에서 "아니오" 클릭 시 Modal 창 닫힘
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Alert 나올 경우가 발생하면
  const handleOpenModal = () => {
    setShowConfirmModal(false);
    setShowModal(true);
  };

  useEffect(() => {
    // 프로젝트, 산출물 타입, 프로젝트 진행상태 데이터 불러오기
    const getOutputWritePage = async () => {
      const json = await loadForWriteOutputData(token);
      const { projectList, outputType, prjSts } = json.body;
      setWriteOutputData({
        projectList,
        outputType,
        prjSts,
      });
    };

    getOutputWritePage();
  }, [token]);

  // 객체 분해를 사용해서 값 추출
  const { projectList, outputType, prjSts } = writeOutputData || {};
  console.log("projectList: ", projectList);
  console.log("outputType: ", outputType);
  console.log("prjSts: ", prjSts);

  return (
    <>
      {writeOutputData && (
        <>
          <div className={styles.writeAndModifyGrid}>
            <label htmlFor="prj-id">프로젝트</label>
            <div>
              <input
                type="text"
                id="prj-id"
                name="prjId"
                ref={prjIdRef}
                defaultValue={projectValue.project.prjName}
                readOnly
              />
              {writeErrors.prjId && writeErrors.prjId.length > 0 && (
                <div className={styles.errorMessage}>{writeErrors.prjId}</div>
              )}
            </div>

            <label htmlFor="out-ttl">산출물 제목</label>
            <div className="ttlInput">
              <input type="text" name="outTtl" id="out-ttl" ref={outTtlRef} />
              {writeErrors.outTtl && writeErrors.outTtl.length > 0 && (
                <div className={styles.errorMessage}>{writeErrors.outTtl}</div>
              )}
            </div>

            <label htmlFor="out-type">산출물 종류</label>
            <div>
              <select name="outType" id="out-type" ref={outTypeRef}>
                <option value="">산출물 종류를 선택해주세요</option>
                {outputType &&
                  outputType.map((item) => (
                    <option value={item.cmcdId} key={item.cmcdId}>
                      {item.cmcdName}
                    </option>
                  ))}
              </select>
              {writeErrors.outType && writeErrors.outType.length > 0 && (
                <div className={styles.errorMessage}>{writeErrors.outType}</div>
              )}
            </div>

            <label htmlFor="out-ver">프로젝트 진행상태</label>
            <div>
              <select name="outVer" id="out-ver" ref={outVerRef}>
                <option value="">진행상태를 선택해주세요</option>
                {prjSts &&
                  prjSts.map((item) => (
                    <option value={item.cmcdId} key={item.cmcdId}>
                      {item.cmcdName}
                    </option>
                  ))}
              </select>
              {writeErrors.outVer && writeErrors.outVer.length > 0 && (
                <div className={styles.errorMessage}>{writeErrors.outVer}</div>
              )}
            </div>

            <label htmlFor="file">산출물 첨부파일</label>
            <div>
              <input type="file" id="outFile" name="outFile" ref={fileRef} />
              {writeErrors.outFile && writeErrors.outFile.length > 0 && (
                <div className={styles.errorMessage}>{writeErrors.outFile}</div>
              )}
            </div>
          </div>

          {showModal && (
            <AlertModal
              show={showModal}
              onClose={handleCloseModal}
              content="파일은 필수입니다."
              closeContent="확인"
            />
          )}

          <div className={styles.buttonArea}>
            <button
              data-id="wirte"
              type="button"
              onClick={handleOpenConfirmModal}
            >
              등록
            </button>
            {showConfirmModal && (
              <ConfirmModal
                show={showConfirmModal}
                onClose={handleCloseConfirmModal}
                content="등록하시겠습니까?"
                cancelContent="아니오"
                confirmContent="예"
                confirmOnClick={handleConfirm}
                cancelOnclick={handleCloseConfirmModal}
              />
            )}
            <button onClick={onClickHandler}>목록으로 이동</button>
          </div>
        </>
      )}
    </>
  );
}
