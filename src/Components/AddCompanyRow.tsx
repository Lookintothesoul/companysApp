import { addCompany } from "../store/companiesSlice.ts";
import { useDispatch } from "react-redux";
import React, { useContext, useState } from "react";
import { DataBaseContext } from "../context/DataBaseContext.ts";
import { doc, setDoc } from "firebase/firestore";
import {getUid} from "../utils/createUid.ts";

type Values = {
  companyName: string;
  companyLocation: string;
};

const defaultValues = {
  companyName: "",
  companyLocation: "",
};

export const AddCompanyRow = () => {
  const dispatch = useDispatch();
  const [newCompanyValues, setNewCompanyValues] = useState<Values>({
    ...defaultValues,
  });
  const { db } = useContext(DataBaseContext);

  const handleAddCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      ...newCompanyValues,
      id: getUid(),
      employeesCount: 0,
    };

    setDoc(doc(db, "companies", data.id), data).then(() => {
      dispatch(addCompany(data));
      setNewCompanyValues({ ...defaultValues });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompanyValues({ ...newCompanyValues, [name]: value });
  };

  return (
    <tr>
      <td>
        <form action="" id="addNewCompanyForm" onSubmit={handleAddCompany}>
          <button className="success" type="submit">
            +
          </button>
        </form>
      </td>
      <td>
        <input
          required
          name={"companyName"}
          form="addNewCompanyForm"
          value={newCompanyValues.companyName}
          onChange={handleChange}
          type="text"
          placeholder="Название компании"
        />
      </td>
      <td>
        <input value={0} disabled={true} type="text" form="addNewCompanyForm" />
      </td>
      <td>
        <input
          required
          name={"companyLocation"}
          form="addNewCompanyForm"
          value={newCompanyValues.companyLocation}
          onChange={handleChange}
          type="text"
          placeholder="Адресс"
        />
      </td>
    </tr>
  );
};
