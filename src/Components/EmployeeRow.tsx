import React, { FC, useContext, useState } from "react";
import { TEmployee } from "../store/employeesSlice.ts";
import { DataBaseContext } from "../context/DataBaseContext.ts";
import { doc, setDoc } from "firebase/firestore";

interface EmployeeRowProps {
  employee: TEmployee;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

export const EmployeeRow: FC<EmployeeRowProps> = ({
  employee,
  selectedRows,
  setSelectedRows,
}) => {
  const { db } = useContext(DataBaseContext);
  const [changeValues, setChangeValues] = useState<{
    employeeFirstName: string;
    employeeSecondName: string;
    employeePosition: string;
  }>({
    employeeFirstName: employee.employeeFirstName,
    employeeSecondName: employee.employeeSecondName,
    employeePosition: employee.employeePosition,
  });
  const handleSelectEmployeeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    EmployeeId: string,
  ) => {
    if (!e.currentTarget.checked) {
      setSelectedRows((prev) => prev.filter((id) => id !== EmployeeId));
    } else {
      setSelectedRows((prev) => [...prev, EmployeeId]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDoc(doc(db, "employees", employee.id), changeValues, {
      merge: true,
    }).then(() => {
      console.log("Success!");
    });
  };

  const handeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          title="Выбрать компанию"
          checked={selectedRows.includes(employee.id)}
          onChange={(e) => handleSelectEmployeeChange(e, employee.id)}
        />
      </td>
      <td>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handeChange}
            name="employeeSecondName"
            value={changeValues.employeeSecondName}
          />
        </form>
      </td>
      <td>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handeChange}
            name="employeeFirstName"
            value={changeValues.employeeFirstName}
          />
        </form>
      </td>
      <td>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handeChange}
            name="employeePosition"
            value={changeValues.employeePosition}
          />
        </form>
      </td>
    </tr>
  );
};
