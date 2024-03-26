import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useState } from "react";
import { addEmployee } from "../store/employeesSlice.ts";
import { RootState } from "../store/store.ts";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { setCompanyEmployeesCount } from "../store/companiesSlice.ts";
import { DataBaseContext } from "../context/DataBaseContext.ts";
import {getUid} from "../utils/createUid.ts";

type Values = {
  employeeFirstName: string;
  employeeSecondName: string;
  employeePosition: string;
};

const defaultValues = {
  employeeFirstName: "",
  employeeSecondName: "",
  employeePosition: "",
};

export const AddEmployeeRow = () => {
  const [newEmployeeValues, setNewEmployeeValues] = useState<Values>({
    ...defaultValues,
  });
  const employees = useSelector(
    (state: RootState) => state.employees.employees,
  );
  const openedCompanyId = useSelector(
    (state: RootState) => state.companies.openedCompanyId,
  );
  const dispatch = useDispatch();
  const { db } = useContext(DataBaseContext);

  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (openedCompanyId !== null) {
      const data = {
        ...newEmployeeValues,
        id: getUid(),
        companyId: openedCompanyId,
      };

      setDoc(doc(db, "employees", data.id), data).then(() => {
        dispatch(addEmployee(data));
        dispatch(
          setCompanyEmployeesCount({
            id: openedCompanyId,
            employeesCount: employees.length + 1,
          }),
        );
        setNewEmployeeValues({ ...defaultValues });
        updateDoc(doc(db, "companies", openedCompanyId), {
          employeesCount: employees.length + 1,
        });
      });
    } else {
      alert("Выберите компанию");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployeeValues({ ...newEmployeeValues, [name]: value });
  };

  return (
    <tr>
      <td>
        <form action="" id="addNewEmployeeForm" onSubmit={handleAddEmployee}>
          <button className="success" type="submit">
            +
          </button>
        </form>
      </td>
      <td>
        <input
          required
          form="addNewEmployeeForm"
          name="employeeSecondName"
          value={newEmployeeValues.employeeSecondName}
          onChange={handleChange}
          type="text"
          placeholder="Фамилия"
        />
      </td>
      <td>
        <input
          required
          name="employeeFirstName"
          form="addNewEmployeeForm"
          value={newEmployeeValues.employeeFirstName}
          onChange={handleChange}
          type="text"
          placeholder="Имя"
        />
      </td>
      <td>
        <input
          required
          name="employeePosition"
          form="addNewEmployeeForm"
          value={newEmployeeValues.employeePosition}
          onChange={handleChange}
          type="text"
          placeholder="Должность"
        />
      </td>
    </tr>
  );
};
