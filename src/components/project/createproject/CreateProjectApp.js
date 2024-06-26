import React, { useEffect, useRef, useState } from "react";
import styles from "../project.module.css";
import TextInput from "../../common/input/TextInput";
import Selectbox from "../../common/selectbox/Selectbox";
import SelectDate from "../../common/selectbox/SelectDate";
import Button from "../../common/Button/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CreateClientModal from "./CreateClientModal";
const CreateProjectApp = () => {
  // const url = "http://43.202.29.221";
  const url = "http://localhost:8080";
  const [isAddClient, setIsAddClient] = useState(false);
  const prjNameRef = useRef();
  const prjMemoRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();
  const [canSave, setCanSave] = useState(true);
  const [editTitle, setEditTitle] = useState("");
  const [customerInfo, setCustomerInfo] = useState("");

  // 고객사 추가 정보
  const titleRef = useRef();
  const cntctRef = useRef();
  const memoRef = useRef();

  const [clientData, setClientData] = useState([]);
  const [clientSelectedData, setClientSelectedData] =
    useState("고객사를 선택해주세요.");

  const [deptData, setDeptData] = useState([]);
  const [deptSelectedData, setDeptSelectedData] =
    useState("부서를 선택해주세요.");
  const [dateInfo, setDateInfo] = useState("");

  const [pmCandidate, setPmCandidate] = useState([]);
  const [pmSelectedData, setPmSelectedData] = useState("PM을 선택해주세요");

  const tokenInfo = useSelector((state) => ({
    token: state.tokenInfo.token,
    credentialsExpired: state.tokenInfo.credentialsExpired,
  }));

  // 고객사 정보 가져오기
  useEffect(() => {
    const getClient = async () => {
      const response = await fetch(`${url}/api/project/client`, {
        headers: { Authorization: tokenInfo.token },
        method: "GET",
      });
      const json = await response.json();
      const list = json.body.map((client) => ({
        label: client.clntName,
        value: client.clntId,
      }));
      setClientData(list);
    };
    getClient();
    setIsAddClient(false);
  }, [tokenInfo.token, isAddClient]);

  // 부서 정보 가져오기
  useEffect(() => {
    const getDept = async () => {
      const response = await fetch(`${url}/api/v1/department`, {
        headers: { Authorization: tokenInfo.token },
        method: "GET",
      });
      const json = await response.json();
      const list = json.body.map((dept) => ({
        label: dept.deptName,
        value: dept.deptId,
      }));
      setDeptData(list);
    };
    getDept();
  }, [tokenInfo.token]);

  // 부서에 따른 PM 후보자 가져오기
  useEffect(() => {
    const getPmCandidates = async () => {
      if (deptSelectedData === "부서를 선택해주세요.") return;

      const response = await fetch(
        `${url}/api/project/employee/findbydeptid/${deptSelectedData}`,
        { headers: { Authorization: tokenInfo.token }, method: "GET" }
      );
      const json = await response.json();
      const list = json.body.map((employee) => ({
        label: employee.empName,
        value: employee.empId,
      }));
      setPmCandidate(list);
    };

    getPmCandidates();
  }, [deptSelectedData, tokenInfo.token]);

  // 날짜 선택 변경 시 처리
  const onChangeSelect = () => {
    if (
      startDateRef.current &&
      endDateRef.current &&
      startDateRef.current > endDateRef.current
    ) {
      setCanSave(false);
      return;
    }
    setCanSave(true);
  };

  const navigate = useNavigate();

  // 프로젝트명 유효성 검사
  useEffect(() => {
    if (
      prjNameRef.current &&
      (prjNameRef.current.value === "" || prjNameRef.current.value.length > 30)
    ) {
      setCanSave(false);
      return;
    }
    if (
      startDateRef.current &&
      endDateRef.current &&
      startDateRef.current > endDateRef.current
    ) {
      setCanSave(false);
      return;
    }

    setCanSave(true);
  }, [prjNameRef.current?.value]);

  // 유효성 검사: 고객사, 부서, PM 선택 확인
  useEffect(() => {
    if (
      clientSelectedData === "고객사를 선택해주세요." ||
      deptSelectedData === "부서를 선택해주세요." ||
      pmSelectedData === "PM을 선택해주세요"
    ) {
      setCanSave(false);
    } else {
      setCanSave(true);
    }
  }, [clientSelectedData, deptSelectedData, pmSelectedData]);

  // 프로젝트 생성 버튼 클릭 핸들러
  const onClickCreateButtonHandler = async () => {
    if (!canSave) {
      alert("형식에 맞춰 재입력 후 저장해주세요.");
      return;
    }
    if (clientSelectedData === "고객사를 선택해주세요.") {
      return;
    }
    if (deptSelectedData === "부서를 선택해주세요.") {
      return;
    }
    if (pmSelectedData === "PM을 선택해주세요") {
      return;
    }

    const response = await fetch(`${url}/api/project/write`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
      body: JSON.stringify({
        prjName: prjNameRef.current.value,
        clntInfo: clientSelectedData,
        deptId: deptSelectedData,
        pmId: pmSelectedData,
        strtDt: startDateRef.current,
        endDt: endDateRef.current,
        prjMemo: prjMemoRef.current.value,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.status === 200) {
      alert("프로젝트 생성에 성공했습니다.");
      navigate("/project");
    }
  };

  // 고객사 추가 모달 관련 상태
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleOpenModal = () => {
    setShowInfoModal(true);
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
  };

  // 새로운 고객사 추가 핸들러
  const onClickCreateNewClientHandler = async () => {
    handleOpenModal();
  };

  // 모달 내에서 고객사 추가 확인 버튼 핸들러
  const handleConfirm = async () => {
    console.log(canSave);
    if (!canSave) {
      alert("형식에 맞춰 재입력 후 저장해주세요.");
      return;
    }
    const response = await fetch(`${url}/api/project/client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
      body: JSON.stringify({
        clntName: titleRef.current.value,
        cntct: cntctRef.current.value,
        info: memoRef.current.value,
      }),
    });
    const json = await response.json();
    if (json.status === 200) {
      alert("고객사를 추가했습니다.");
      setShowInfoModal(false);
      titleRef.current.value = "";
      cntctRef.current.value = "";
      memoRef.current.value = "";
    }

    setIsAddClient(true);
  };

  return (
    <div className={styles.createContainer}>
      <h3 className={styles.createAndModify}>프로젝트 생성</h3>
      <div className={styles.createGrid}>
        <div>프로젝트명</div>
        <div>
          <TextInput
            id="prjName"
            onChangeHandler={(e) => setEditTitle(e.target.value)}
            ref={prjNameRef}
          />
          {prjNameRef.current &&
          prjNameRef.current.value &&
          prjNameRef.current.value.length > 30 ? (
            <span className={styles.alertMessage}>
              ※ 프로젝트명은 30자를 초과할 수 없습니다.
            </span>
          ) : (
            <></>
          )}
          {prjNameRef.current &&
          (prjNameRef.current.value === null ||
            prjNameRef.current.value === "") ? (
            <span className={styles.alertMessage}>
              ※ 프로젝트명은 필수 값입니다.
            </span>
          ) : (
            <></>
          )}
        </div>
        <div>고객사</div>
        <div>
          <div className={styles.displayInfoFlex}>
            <Selectbox
              optionList={clientData}
              setSelectedData={setClientSelectedData}
              selectedData={clientSelectedData}
              onChangeHandler={(e) => setCustomerInfo(e.target.value)}
            />
            <Button onClickHandler={onClickCreateNewClientHandler}>
              고객사 관리
            </Button>
          </div>
          {clientSelectedData === "고객사를 선택해주세요." ? (
            <span className={styles.alertMessage}>
              ※ 고객사는 필수 항목입니다.
            </span>
          ) : (
            <></>
          )}
        </div>
        <div>부서</div>
        <div>
          <Selectbox
            optionList={deptData}
            setSelectedData={setDeptSelectedData}
            selectedData={deptSelectedData}
          />
          {deptSelectedData === "부서를 선택해주세요." ? (
            <span className={styles.alertMessage}>
              ※ 부서는 필수 항목입니다.
            </span>
          ) : (
            <></>
          )}
        </div>
        <div>Project Manage</div>
        <div>
          <Selectbox
            optionList={pmCandidate}
            setSelectedData={setPmSelectedData}
            selectedData={pmSelectedData}
          />
          {pmSelectedData === "PM을 선택해주세요" ? (
            <span className={styles.alertMessage}>※ PM은 필수 항목입니다.</span>
          ) : (
            <></>
          )}
        </div>
        <div>프로젝트 기간</div>
        <div>
          <SelectDate
            onChangeSelect={onChangeSelect}
            onChangeHandler={(e) => setDateInfo(e.target.value)}
            startDateRef={startDateRef}
            endDateRef={endDateRef}
          />
          {startDateRef.current &&
          endDateRef.current &&
          startDateRef.current > endDateRef.current ? (
            <span className={styles.alertMessage}>
              ※ 끝 날짜는 시작날짜보다 이전일 수 없습니다.
            </span>
          ) : (
            <></>
          )}
        </div>
        <div>Project Readme</div>
        <div className={styles.contentBoxContainer}>
          <textarea
            className={styles.contentBox}
            id="prjMemo"
            ref={prjMemoRef}
          ></textarea>
        </div>
      </div>
      <div className={styles.buttonArea}>
        <Button onClickHandler={onClickCreateButtonHandler}>생성</Button>
      </div>
      <CreateClientModal
        show={showInfoModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        cancelContent="취소"
        confirmContent="추가"
        titleRef={titleRef}
        cntctRef={cntctRef}
        memoRef={memoRef}
        setCanSave={setCanSave}
      />
    </div>
  );
};

export default CreateProjectApp;
