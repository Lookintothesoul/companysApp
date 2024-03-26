import { setOpenedCompanyId, TCompany } from "../store/companiesSlice.ts";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmployees, TEmployee } from "../store/employeesSlice.ts";
import { RootState } from "../store/store.ts";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { DataBaseContext } from "../context/DataBaseContext.ts";

interface CompanyRowProps {
  company: TCompany;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CompanyRow = ({
  company,
  selectedRows,
  setSelectedRows,
}: CompanyRowProps) => {
  const openedCompanyId = useSelector(
    (state: RootState) => state.companies.openedCompanyId,
  );
  const dispatch = useDispatch();
  const { db } = useContext(DataBaseContext);
  const [changeValues, setChangeValues] = useState<{
    companyName: string;
    companyLocation: string;
  }>({
    companyName: company.companyName,
    companyLocation: company.companyLocation,
  });

  const handleOpenEmployees = () => {
    if (openedCompanyId === company.id) {
      dispatch(setOpenedCompanyId(null));
      dispatch(setEmployees([]));
    } else {
      const q = query(
        collection(db, "employees"),
        where("companyId", "==", company.id),
      );

      getDocs(q).then((querySnapshot) => {
        const employees: TEmployee[] = [];
        querySnapshot.forEach((doc) =>
          employees.push({ id: doc.id, ...doc.data() } as TEmployee),
        );

        dispatch(setOpenedCompanyId(company.id));
        dispatch(setEmployees(employees));
      });
    }
  };

  const handleSelectCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.currentTarget.checked) {
      setSelectedRows((prev) => prev.filter((id) => id !== company.id));
    } else {
      setSelectedRows((prev) => [...prev, company.id]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDoc(doc(db, "companies", company.id), changeValues, {
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
    <tr
      onClick={handleOpenEmployees}
      className={openedCompanyId === company.id ? "selected" : ""}
    >
      <td>
        <input
          onClick={(e) => e.stopPropagation()}
          type="checkbox"
          title="Выбрать компанию"
          checked={selectedRows.includes(company.id)}
          onChange={handleSelectCompanyChange}
        />
      </td>
      <td>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            onClick={(e) => e.stopPropagation()}
            value={changeValues.companyName}
            onChange={handeChange}
            name="companyName"
            required={true}
          />
        </form>
      </td>
      <td>
        <input disabled={true} type="text" value={company.employeesCount} />
      </td>
      <td>
        <form action="" onSubmit={handleSubmit}>
          <input
            onClick={(e) => e.stopPropagation()}
            type="text"
            value={changeValues.companyLocation}
            onChange={handeChange}
            name="companyLocation"
            required={true}
          />
        </form>
      </td>
    </tr>
  );
};
