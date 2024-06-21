import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Modal,
  message,
  Row,
  Col,
} from "antd";
import {
  loadRentalSupplyCategory,
  loadRentalSupplyList,
  loadRentalSupply,
  applyForMultipleRentalSupplies,
} from "../../../../http/rentalSupplyHttp";
import { useSelector } from "react-redux";
import style from "../../rentalSupply.module.css";

const RentalSupplyRequestModal = ({ visible, onClose, onApply }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [supplyList, setSupplyList] = useState([]);
  const [inputFields, setInputFields] = useState([
    {
      selectedCategory: "",
      selectedSupply: "",
      quantity: "",
      remainingStock: null,
    },
  ]);

  const { token } = useSelector((state) => state.tokenInfo);
  const [form] = Form.useForm();

  const memoizedLoadRentalSupplyCategory = useCallback(
    loadRentalSupplyCategory,
    []
  );
  const memoizedLoadRentalSupplyList = useCallback(loadRentalSupplyList, []);
  const memoizedLoadRentalSupply = useCallback(loadRentalSupply, []);
  const memoizedToken = useMemo(() => {
    return { token };
  }, [token]);

  useEffect(() => {
    const fetchingData = async () => {
      const json = await memoizedLoadRentalSupplyCategory({ ...memoizedToken });
      const categories = json.rentalSupplyList.map((item) => item.rsplCtgr);
      setCategoryList(categories);
    };

    fetchingData();
  }, [memoizedLoadRentalSupplyCategory, memoizedToken]);

  const handleCategoryChange = (index, value) => {
    const values = [...inputFields];
    values[index].selectedCategory = value;
    values[index].selectedSupply = "";
    values[index].remainingStock = null;
    setInputFields(values);

    if (value) {
      const fetchingData = async () => {
        const json = await memoizedLoadRentalSupplyList({ ...memoizedToken });
        const filteredSupplies = json.body.filter(
          (item) => item.rsplCtgr === value
        );
        setSupplyList(filteredSupplies);
      };

      fetchingData();
    }
  };

  const handleSupplyChange = async (index, value) => {
    const supplyId = value;
    const values = [...inputFields];
    const isDuplicate = inputFields.some(
      (field, i) => field.selectedSupply === supplyId && i !== index
    );

    if (isDuplicate) {
      alert("이미 선택된 대여품입니다. 다른 대여품을 선택해 주세요.");
      return;
    }

    values[index].selectedSupply = supplyId;
    if (supplyId) {
      const json = await memoizedLoadRentalSupply({
        selectedRsplId: supplyId,
        token,
      });
      values[index].remainingStock = json.body.invQty;
    } else {
      values[index].remainingStock = null;
    }
    setInputFields(values);
  };

  const handleQuantityChange = (index, value) => {
    const values = [...inputFields];
    if (value < 0) {
      alert("음수는 입력할 수 없습니다.");
      values[index].quantity = "";
    } else {
      values[index].quantity = value;
    }
    setInputFields(values);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        selectedCategory: "",
        selectedSupply: "",
        quantity: "",
        remainingStock: null,
      },
    ]);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const onApplyClickHandler = async () => {
    for (const field of inputFields) {
      const { selectedSupply, quantity } = field;
      if (!selectedSupply || !quantity || quantity <= 0) {
        alert("모든 필드를 올바르게 입력해 주세요.");
        return;
      }
    }

    const supplies = inputFields.map((field) => ({
      rsplId: field.selectedSupply,
      rsplRqstQty: field.quantity,
    }));

    const json = await applyForMultipleRentalSupplies(token, supplies);

    if (json.errors) {
      json.errors.forEach((error) => {
        alert(error);
      });
    } else if (json.body) {
      message.success("대여품 신청에 대한 결재 요청 성공!");
      onApply();
      onClose();
    }
  };

  return (
    <Modal
      title="대여품 신청"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        {inputFields.map((inputField, index) => (
          <div key={index} className={style.supplyForm}>
            <Form.Item
              name={`category-${index}`}
              label="카테고리"
              rules={[{ required: true, message: "카테고리를 선택하세요" }]}
            >
              <Select
                value={inputField.selectedCategory}
                onChange={(value) => handleCategoryChange(index, value)}
              >
                <Select.Option value="">카테고리를 선택하세요</Select.Option>
                {categoryList.map((category, i) => (
                  <Select.Option key={i} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {inputField.selectedCategory && (
              <Form.Item
                name={`supply-${index}`}
                label="대여품 이름"
                rules={[{ required: true, message: "대여품을 선택하세요" }]}
              >
                <Select
                  value={inputField.selectedSupply}
                  onChange={(value) => handleSupplyChange(index, value)}
                >
                  <Select.Option value="">대여품을 선택하세요</Select.Option>
                  {supplyList.map((supply) => (
                    <Select.Option key={supply.rsplId} value={supply.rsplId}>
                      {supply.rsplName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item
              label="신청 갯수"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Row gutter={8} align="middle">
                <Col span={12}>
                  <Form.Item
                    name={`quantity-${index}`}
                    rules={[
                      { required: true, message: "신청 갯수를 입력하세요" },
                      {
                        validator: (_, value) =>
                          value && value > 0
                            ? Promise.resolve()
                            : Promise.reject("1개 이상 입력하세요"),
                      },
                    ]}
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      value={inputField.quantity}
                      onChange={(value) => handleQuantityChange(index, value)}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  {inputField.remainingStock !== null && (
                    <span>남은 재고: {inputField.remainingStock}개</span>
                  )}
                </Col>
              </Row>
            </Form.Item>
            {inputFields.length > 1 && (
              <Button
                type="danger"
                onClick={() => handleRemoveFields(index)}
                className={style.removeButton}
              >
                제거
              </Button>
            )}
          </div>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={handleAddFields}
            className={style.addButton}
          >
            대여품 추가
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onApplyClickHandler}>
            신청
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            취소
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RentalSupplyRequestModal;
