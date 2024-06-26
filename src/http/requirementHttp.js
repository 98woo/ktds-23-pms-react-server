// const url = "http://43.202.29.221";
const url = "http://localhost:8080";

export const loadRequirements = async (token, prjIdValue) => {
  if (!token) {
    return undefined;
  }
  const response = await fetch(
    `${url}/api/v1/requirement/search/${prjIdValue}`,
    {
      method: "GET",
      headers: { Authorization: token },
    }
  );

  const json = await response.json();

  return json;
};

export const loadOneRequirement = async (token, prjId, rqmId) => {
  if (!token) {
    return undefined;
  }
  const response = await fetch(
    `${url}/api/v1/requirement/view?prjId=${prjId}&rqmId=${rqmId}`,
    {
      method: "GET",
      headers: { Authorization: token },
    }
  );
  const json = await response.json();

  return json;
};

export const loadForWriteRequirementData = async (token) => {
  if (!token) {
    return undefined;
  }
  const response = await fetch(`${url}/api/v1/requirement/write`, {
    method: "GET",
    headers: { Authorization: token },
  });
  const json = await response.json();

  return json;
};

export const loadTeamListByPrjId = async (token, prjIdValue) => {
  if (!token) {
    return undefined;
  }
  const response = await fetch(
    `${url}/api/v1/requirement/teammate/${prjIdValue}`,
    {
      method: "GET",
      headers: { Authorization: token },
    }
  );
  const json = await response.json();

  return json;
};

export const writeRequirement = async (token, formData) => {
  if (!token) {
    return undefined;
  }
  const response = await fetch(`${url}/api/v1/requirement/write`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  });

  const json = await response.json();

  return json;
};

export const loadForModifyRequirementData = async (token, prjId, rqmId) => {
  if (!token) {
    return undefined;
  }
  const response = await fetch(
    `${url}/api/v1/requirement/modify?prjId=${prjId}&rqmId=${rqmId}`,
    {
      method: "GET",
      headers: { Authorization: token },
    }
  );
  const json = await response.json();

  return json;
};

export const modifyRequirement = async (token, rqmId, formData) => {
  const response = await fetch(`${url}/api/v1/requirement/modify/${rqmId}`, {
    method: "PUT",
    headers: {
      Authorization: token,
    },
    body: formData,
  });

  const json = await response.json();

  return json;
};

export const deleteRequirement = async (token, rqmId) => {
  const response = await fetch(`${url}/api/v1/requirement/delete/${rqmId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  return json;
};

export const requirementFileDownload = async (token, selectedRequirementId) => {
  const response = await fetch(
    `${url}/api/v1/requirement/downloadFile/${selectedRequirementId}`,
    {
      method: "GET",
      headers: { Authorization: token },
    }
  );
  // const json = await response.json();

  return response;
};

export const delayRequirement = async (token, selectedRequirementId) => {
  const response = await fetch(
    `${url}/api/v1/requirement/delaycall/${selectedRequirementId}`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    }
  );

  const json = await response.json();

  return json;
};

export const delayApprove = async (token, selectedRequirementId, isApprove) => {
  const response = await fetch(
    `${url}/api/v1/requirement/delayapprove/${selectedRequirementId}`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: isApprove.toString(),
    }
  );

  const json = await response.json();

  return json;
};

export const requirementTestResult = async (
  token,
  selectedRequirementId,
  testApprove
) => {
  const response = await fetch(
    `${url}/api/v1/requirement/testresult/${selectedRequirementId}`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: testApprove.toString(),
    }
  );

  const json = await response.json();

  return json;
};
