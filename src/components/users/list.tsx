import { observer } from "mobx-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteUser, getUsers } from "../../mockapi/user-list";
import useStore from "../../store";
import { getter, process } from "@progress/kendo-data-query";
import {
  getSelectedState,
  Grid,
  GridColumn,
  GridDataStateChangeEvent,
  GridHeaderSelectionChangeEvent,
  GridNoRecords,
  GridPagerSettings,
  GridSelectionChangeEvent,
} from "@progress/kendo-react-grid";
import LoadingPanel from "../loading";
import { ColumnMenu } from "../column-menu";
import {
  userColumns,
  USER_DATA_ITEM_KEY,
  USER_SELECTED_FIELD,
} from "../../const";
import { User } from "../../interfaces/user";
import { Button } from "@progress/kendo-react-buttons";
import { Link } from "react-router-dom";
import DeleteConfirm from "../modals/delete-confirm";
import { CreateOrUpdate as CreateOrUpdateModal } from "../modals/create-or-update";
import { CreateOrUpdateForm } from "./create-or-update-form";
import { Form } from "@progress/kendo-react-form";

interface DataState {
  take: number;
  skip: number;
  sortable: boolean;
  resizable: boolean;
}

let initialState = {
  take: 5,
  skip: 0,
  sortable: true,
  resizable: true,
  selectedField: USER_SELECTED_FIELD,
  selectable: {
    enabled: true,
    drag: true,
    cell: false,
    mode: "multiple",
  },
};

const pageable: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: "numeric",
  pageSizes: true,
  previousNext: true,
};

const idGetter = getter(USER_DATA_ITEM_KEY);

export const List = observer(() => {
  const { userStore, toastStore } = useStore();
  const { users, onSetUsers, onDelete } = userStore;
  const { onAddToast } = toastStore;

  const [dataState, setDataState] = useState<DataState>(initialState);
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);
  const [isShowModalCreateUpdate, setIsShowModalCreateUpdate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeOut = setTimeout(() => {
      getUsers()
        .then((res) => {
          onSetUsers(res);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timeOut);
    };
  }, [onSetUsers]);

  useEffect(() => {
    const newData = users.map((user) => {
      const newUser = user;
      if (newUser.birthday) {
        newUser.birthday = new Date(newUser.birthday);
      }
      return user;
    });
    setData(newData);
  }, [users]);

  useEffect(() => {
    console.log("userIds", userIds);
  }, [userIds]);

  const onDataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState((prevState) => ({
      ...prevState,
      ...(e.dataState as DataState),
    }));
  };

  const [selectedState, setSelectedState] = useState<{
    [id: string]: boolean | number[];
  }>({});

  const onSelectionChange = useCallback(
    (event: GridSelectionChangeEvent) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: USER_DATA_ITEM_KEY,
      });

      const ids = [];
      for (const key in newSelectedState) {
        if (newSelectedState[key]) {
          ids.push(key);
        } else {
          setUserIds((prevState) => prevState.filter((item) => item !== key));
        }
      }

      if (ids.length > 0) {
        setUserIds(ids);
      }
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );

  const onHeaderSelectionChange = useCallback(
    (event: GridHeaderSelectionChangeEvent) => {
      const checkboxElement: any = event.syntheticEvent.target;
      const checked = checkboxElement.checked;
      let newSelectedState = {};
      const userIDs: string[] = [];

      event.dataItems.forEach((item) => {
        const id = idGetter(item);
        if (checked) {
          userIDs.push(id);
        }
        newSelectedState = Object.assign(newSelectedState, {
          [idGetter(item)]: checked,
        });
      });
      setSelectedState(newSelectedState);
      setUserIds(userIDs);
    },
    []
  );

  const newData = useMemo(() => {
    return process(
      data.map((item) => ({
        ...item,
        [USER_SELECTED_FIELD]: selectedState[idGetter(item)],
      })),
      dataState
    );
  }, [data, dataState, selectedState]);

  const handleDeleteUser = () => {
    onDelete(userIds);
    deleteUser(userIds);
    const contentToast = userIds.length > 1 ? "Users deleted" : "User deleted";
    onAddToast({
      id: new Date(),
      content: contentToast,
      type: "success",
    });
    setUserIds([]);
    setSelectedState({});
    setIsVisibleConfirmModal(false);
  };

  return (
    <div className="w-[90%] lg:px-8 xl:px-0 m-auto p-5">
      <div className="flex justify-end space-x-3">
        <Link to="/user/new">
          <Button
            className="buttons-container-button"
            icon="plus"
            themeColor="primary"
          >
            New
          </Button>
        </Link>
        <Button
          className="buttons-container-button"
          icon="plus"
          themeColor="primary"
          onClick={() => setIsShowModalCreateUpdate(true)}
        >
          New
        </Button>
        <Link
          to={`user/${userIds[0]}`}
          className={userIds.length !== 1 ? "pointer-events-none" : ""}
        >
          <Button
            className="buttons-container-button"
            icon="edit"
            disabled={userIds.length !== 1}
            themeColor="primary"
          >
            Edit
          </Button>
        </Link>
        <Button
          className="buttons-container-button"
          icon="delete"
          themeColor="error"
          onClick={() => setIsVisibleConfirmModal(true)}
          disabled={userIds.length === 0}
        >
          Delete
        </Button>
      </div>
      <div className="mt-5">
        {isLoading && users.length === 0 && <LoadingPanel />}
        <Grid
          style={{ height: "75vh" }}
          data={newData}
          {...dataState}
          pageable={pageable}
          onDataStateChange={onDataStateChange}
          onSelectionChange={onSelectionChange}
          onHeaderSelectionChange={onHeaderSelectionChange}
        >
          <GridNoRecords>
            {isLoading ? "Loading..." : "There is no data available"}
          </GridNoRecords>

          <GridColumn field={USER_SELECTED_FIELD} width="50px" />
          {userColumns.map((column, index) => (
            <GridColumn key={index} {...column} columnMenu={ColumnMenu} />
          ))}
        </Grid>

        <DeleteConfirm
          content="Are you sure you want to continue?"
          visible={isVisibleConfirmModal}
          setVisible={setIsVisibleConfirmModal}
          onConfirm={handleDeleteUser}
        />

        <CreateOrUpdateModal
          setVisible={setIsShowModalCreateUpdate}
          visible={isShowModalCreateUpdate}
          onConfirm={() => console.log("confirm")}
        >
          <Form
            onSubmit={() => console.log("onSubmit")}
            render={(formRenderProps) => <CreateOrUpdateForm />}
          ></Form>
        </CreateOrUpdateModal>
      </div>
    </div>
  );
});
