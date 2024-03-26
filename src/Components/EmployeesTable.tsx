import { AddEmployeeRow } from "./AddEmployeeRow.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import React, {useContext, useEffect, useState} from "react";
import { removeEmployees } from "../store/employeesSlice.ts";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { DataBaseContext } from "../context/DataBaseContext.ts";
import { setCompanyEmployeesCount } from "../store/companiesSlice.ts";
import {EmployeeRow} from "./EmployeeRow.tsx";

export const EmployeesTable = () => {
  const [selectedEmployeesId, setSelectedEmployeesId] = useState<string[]>([]);
  const openedCompanyId = useSelector(
    (state: RootState) => state.companies.openedCompanyId,
  );
  const employees = useSelector(
    (state: RootState) => state.employees.employees,
  );
  const [selectAll, setSelectAll] = useState(false);
  const dispatch = useDispatch();
  const { db } = useContext(DataBaseContext);

  const handleSelectAllEmployees = () => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedEmployeesId([]);
    } else {
      setSelectAll(true);
      setSelectedEmployeesId(employees.map((employee) => employee.id));
    }
  };

  const handleDeleteSelectedEmployees = async () => {
    if (selectedEmployeesId.length !== 0) {
      for (const employeeId of selectedEmployeesId) {
        await deleteDoc(doc(db, "employees", employeeId));
      }
      dispatch(
        setCompanyEmployeesCount({
          id: openedCompanyId as string,
          employeesCount: employees.length - selectedEmployeesId.length,
        }),
      );
      updateDoc(doc(db, "companies", openedCompanyId as string), {
        employeesCount: employees.length - selectedEmployeesId.length,
      });
      dispatch(removeEmployees(selectedEmployeesId));
      setSelectedEmployeesId([]);
      setSelectAll(false);
    }
  };

  useEffect(() => {
    if (employees.length === selectedEmployeesId.length) {
      if (employees.length !== 0) {
        setSelectAll(true);
      }
    } else {
      setSelectAll(false);
    }
  }, [employees.length, selectedEmployeesId.length]);

  return (
    openedCompanyId !== null && (
      <div className="companys-list-table">
        <table>
          <caption>Сотрудники</caption>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  title="Выбрать все"
                  onChange={handleSelectAllEmployees}
                  checked={selectAll}
                />
              </th>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Должность</th>
            </tr>
          </thead>
          <tbody>
            <AddEmployeeRow />
            {employees.length > 0 ? (
              employees.map((employee) => (
                <EmployeeRow key={employee.id} employee={employee} selectedRows={selectedEmployeesId} setSelectedRows={setSelectedEmployeesId} />
              ))
            ) : (
              <tr>
                <td align={"center"} colSpan={4}>
                  Нет сотрудников
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} align="right">
                <button
                  className="danger"
                  onClick={handleDeleteSelectedEmployees}
                >
                  Удалить выбранные
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  );
};
