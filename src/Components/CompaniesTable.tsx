import { RootState } from "../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { AddCompanyRow } from "./AddCompanyRow.tsx";
import {
  removeCompanies,
  setCompanies,
  TCompany,
} from "../store/companiesSlice.ts";
import { CompanyRow } from "./CompanyRow.tsx";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
} from "firebase/firestore";
import { DataBaseContext } from "../context/DataBaseContext.ts";

async function getCompanies(db: Firestore) {
  const companiesCol = collection(db, "companies");
  const companiesSnapshot = await getDocs(companiesCol);
  return companiesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export const CompaniesTable = () => {
  const [selectedCompaniesId, setSelectedCompaniesId] = useState<string[]>([]);
  const companies = useSelector(
    (state: RootState) => state.companies.companies,
  );
  const [selectAll, setSelectAll] = useState(false);
  const dispatch = useDispatch();
  const { db } = useContext(DataBaseContext);

  useEffect(() => {
    getCompanies(db).then((companies) => {
      dispatch(setCompanies(companies as TCompany[]));
    });
  }, []);

  const handleSelectAllCompanies = () => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedCompaniesId([]);
    } else {
      setSelectAll(true);
      setSelectedCompaniesId(companies.map((company) => company.id));
    }
  };

  const handleDeleteSelectedCompanies = async () => {
    if (selectedCompaniesId.length !== 0) {
      for (const companyId of selectedCompaniesId) {
        await deleteDoc(doc(db, "companies", companyId));
      }
      dispatch(removeCompanies(selectedCompaniesId));
      setSelectedCompaniesId([]);
      setSelectAll(false);
    }
  };

  useEffect(() => {
    if (companies.length === selectedCompaniesId.length) {
      if (companies.length !== 0) {
        setSelectAll(true);
      }
    } else {
      setSelectAll(false);
    }
  }, [companies.length, selectedCompaniesId.length]);

  return (
    <div className="companys-list-table">
      <table>
        <caption>Компании</caption>
        <thead>
          <tr>
            <th>
              <input
                checked={selectAll}
                type="checkbox"
                title="Выбрать все"
                onChange={handleSelectAllCompanies}
              />
            </th>
            <th>Название компании</th>
            <th>Кол-во сотрудников</th>
            <th>Адрес</th>
          </tr>
        </thead>
        <tbody>
          <AddCompanyRow />
          {companies.length > 0 ? (
            companies.map((company) => (
              <CompanyRow
                key={company.id}
                company={company}
                selectedRows={selectedCompaniesId}
                setSelectedRows={setSelectedCompaniesId}
              />
            ))
          ) : (
            <tr>
              <td align={"center"} colSpan={4}>
                Нет компаний
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} align="right">
              <button
                className="danger"
                onClick={handleDeleteSelectedCompanies}
              >
                Удалить выбранные
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
