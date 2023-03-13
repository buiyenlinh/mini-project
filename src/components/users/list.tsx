import { observer } from "mobx-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../mockapi/user-list";
import useStore from "../../store";
import { getter, process } from "@progress/kendo-data-query";
import {
  getSelectedState,
  Grid,
  GridColumn,
  GridColumnMenuWrapper,
  GridDataStateChangeEvent,
  GridHeaderCellProps,
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
import { Link } from "react-router-dom";

import { ModalCustom } from "../modals";
import { CreateOrUpdateForm } from "./create-or-update-form";
import { Form, FormElement } from "@progress/kendo-react-form";
import { ButtonCustom } from "../button";
import { ToastType } from "../toast/toast-item";
import { checkDisabledSubmitButton } from "../../helper";

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
  const {
    users,
    onSetUsers,
    onDelete,
    onUpdate,
    getUserById,
    onCreateId,
    onAdd,
    onExistEmailOrPhone,
  } = userStore;
  const { onAddToast } = toastStore;

  const [dataState, setDataState] = useState<DataState>(initialState);
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);

  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);
  const [isShowModalCreateUpdate, setIsShowModalCreateUpdate] = useState(false);
  const [user, setUser] = useState<User>({});

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

  const onDataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState((prevState) => ({
      ...prevState,
      ...(e.dataState as DataState),
    }));
  };

  const [selectedState, setSelectedState] = useState<{
    [id: string]: boolean | number[];
  }>({});

  const [isUpdate, setIsUpdate] = useState(false);

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

  const resetUserSelect = () => {
    setUserIds([]);
    setUser({});
    setSelectedState({});
  };

  const handleAddToast = useCallback(
    (content: string, type: ToastType) => {
      onAddToast({
        id: new Date(),
        content: content,
        type: type,
      });
    },
    [onAddToast]
  );

  const handleDeleteUser = () => {
    onDelete(userIds);
    deleteUser(userIds);
    const toastTitle = userIds.length > 1 ? "Users deleted" : "User deleted";
    handleAddToast(toastTitle, "success");
    resetUserSelect();
    setIsVisibleConfirmModal(false);
  };

  const onAddOrUpdate = useCallback(
    (dataItem: { [name: string]: any }) => {
      const id = user.id ? user.id : onCreateId();
      dataItem = Object.assign(dataItem, { id });

      const errors = onExistEmailOrPhone(
        dataItem.email,
        dataItem.phoneNumber,
        user.id
      );

      if (errors.length > 0) {
        errors.forEach((item) => {
          handleAddToast(item, "error");
        });
      } else {
        if (user.id) {
          onUpdate(dataItem);
          updateUser(dataItem);
          resetUserSelect();
        } else {
          onAdd(dataItem);
          addUser(dataItem);
        }
        const toastTitle = user.id ? "User updated" : "User added";
        handleAddToast(toastTitle, "success");
        setIsShowModalCreateUpdate(false);
      }
    },
    [handleAddToast, onAdd, onCreateId, onExistEmailOrPhone, onUpdate, user.id]
  );

  const getUserUpdate = () => {
    const userInfo = getUserById(userIds[0]);
    if (userInfo) {
      setUser(userInfo);
    }
    setIsShowModalCreateUpdate(true);
    setIsUpdate(true);
  };

  const handleShowUserModal = () => {
    setUser({});
    setIsShowModalCreateUpdate(true);
    setIsUpdate(false);
  };

  const HeaderCell = (props: GridHeaderCellProps) => {
    return (
      <div>
        <div className="pb-[3px] pl-2.5 font-bold text-white">
          {props.title} <span>{props.children}</span>
        </div>
        <div className="text-white">
          <GridColumnMenuWrapper {...props.columnMenuWrapperProps} />
        </div>
      </div>
    );
  };

  const isDisabledSubmitButton = useCallback(
    (errors: { [name: string]: any }, allowSubmit: boolean) => {
      const isError = checkDisabledSubmitButton(errors);

      return isError || allowSubmit === false;
    },
    []
  );

  return (
    <div className="w-[90%] lg:px-8 xl:px-0 m-auto p-5">
      <div className="flex justify-end space-x-3 pt-3">
        <ButtonCustom
          className="buttons-container-button"
          themeColor="primary"
          onClick={handleShowUserModal}
          iconLeftClass="fa fa-user-plus"
          title="New"
        />

        <ButtonCustom
          className="buttons-container-button"
          disabled={userIds.length !== 1}
          themeColor="primary"
          onClick={getUserUpdate}
          iconLeftClass="fa fa-edit"
          title="Edit"
        />

        <Link to="/user/new">
          <ButtonCustom
            className="buttons-container-button"
            themeColor="primary"
            iconLeftClass="fa fa-user-plus"
            title="New"
          />
        </Link>

        <Link
          to={`user/${userIds[0]}`}
          className={userIds.length !== 1 ? "pointer-events-none" : ""}
        >
          <ButtonCustom
            className="buttons-container-button"
            disabled={userIds.length !== 1}
            themeColor="primary"
            iconLeftClass="fa fa-edit"
            title="Edit"
          />
        </Link>

        <ButtonCustom
          className="buttons-container-button"
          themeColor="error"
          onClick={() => setIsVisibleConfirmModal(true)}
          disabled={userIds.length === 0}
          iconLeftClass="fa fa-trash"
          title="Delete"
        />
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

          <GridColumn
            field={USER_SELECTED_FIELD}
            width="50px"
            headerClassName="bg-[#67a0f4] !text-center"
            className="!text-center"
          />
          {userColumns.map((column, index) => (
            <GridColumn
              key={index}
              {...column}
              columnMenu={ColumnMenu}
              headerCell={HeaderCell}
              headerClassName="!bg-[#67a0f4] text-lg"
              className="!p-4 text-base"
            />
          ))}
        </Grid>

        <ModalCustom
          visible={isVisibleConfirmModal}
          setVisible={setIsVisibleConfirmModal}
          modalTitle={userIds.length > 1 ? "Delete users" : "Delete user"}
          iconClass="fa fa-trash"
          headerModalClass="text-red-600"
          confirmBtn={{
            title: "Yes",
            themeColor: "error",
            onClick: handleDeleteUser,
            className: "w-1/2",
          }}
          cancelBtn={{
            title: "No",
            onClick: () => setIsVisibleConfirmModal(false),
            className: "w-1/2",
          }}
        >
          <div className="w-[300px]">Are you sure you want to continue?</div>
        </ModalCustom>

        <ModalCustom
          setVisible={setIsShowModalCreateUpdate}
          visible={isShowModalCreateUpdate}
          modalTitle={isUpdate ? "Update user" : "New user"}
          iconClass={user.id ? "fa fa-edit" : "fa fa-user-plus"}
          headerModalClass="text-blue-600"
        >
          <Form
            onSubmit={onAddOrUpdate}
            initialValues={user}
            key={JSON.stringify(user)}
            render={(formRenderProps) => {
              const isError = isDisabledSubmitButton(
                formRenderProps.errors,
                formRenderProps.allowSubmit
              );

              return (
                <FormElement>
                  <CreateOrUpdateForm userId={user.id} />
                  <div className="space-x-4 border-t-2 pt-5 mt-5 flex justify-between">
                    <ButtonCustom
                      className="w-1/2"
                      title={isUpdate ? "Update" : "Add"}
                      themeColor="primary"
                      disabled={isError}
                      onClick={formRenderProps.onSubmit}
                    />

                    <ButtonCustom
                      className="w-1/2"
                      onClick={() => setIsShowModalCreateUpdate(false)}
                      title="Close"
                    />
                  </div>
                </FormElement>
              );
            }}
          />
        </ModalCustom>
      </div>
    </div>
  );
});
