import { Button } from "@progress/kendo-react-buttons";
import { getter } from "@progress/kendo-react-common";
import { deleteUser, getUsers } from "../../mockapi/user-list";
import {
  getSelectedState,
  Grid,
  GridColumn,
  GridHeaderSelectionChangeEvent,
  GridPageChangeEvent,
  GridSelectionChangeEvent,
  GridSortChangeEvent,
} from "@progress/kendo-react-grid";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../interfaces/user";
import useStore from "../../store";
import LoadingPanel from "../loading";
import DeleteConfirm from "../modals/delete-confirm";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";

const DATA_ITEM_KEY: string = "id";
const SELECTED_FIELD: string = "selected";
const idGetter = getter(DATA_ITEM_KEY);

interface PageState {
  skip: number;
  take: number;
}
const initialPageState: PageState = { skip: 0, take: 5 };
const initialSort: Array<SortDescriptor> = [{ field: "fullName" }];

export const UserList = () => {
  const { userStore, toastStore } = useStore();
  const { users, onDelete } = userStore;
  const { onAddToast } = toastStore;

  const [dataState, setDataState] = useState<User[]>([]);
  const [selectedState, setSelectedState] = useState<{
    [id: string]: boolean | number[];
  }>({});

  const [userIds, setUserIds] = useState<string[]>([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState<PageState>(initialPageState);

  const pageChange = (event: GridPageChangeEvent) => {
    setPage(event.page);
  };

  const customUsers = (users: User[]) => {
    return users.map((item) => {
      let birthday = {};
      if (item.birthday) {
        birthday = { birthday: new Date(item.birthday) };
      }

      return Object.assign({ selected: false }, item, birthday);
    });
  };

  useEffect(() => {
    getUsers().then((result: User[]) => {
      setDataState(customUsers(result));
    });
  }, []);

  useEffect(() => {
    setDataState(customUsers(users));
  }, [users]);

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
    setIsVisibleModal(false);
  };

  const onSelectionChange = useCallback(
    (event: GridSelectionChangeEvent) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });

      const userSelected = event.dataItem;

      if (userSelected.selected) {
        setUserIds((prevState) =>
          prevState.filter((item) => item !== userSelected.id)
        );
      } else {
        setUserIds((prevState) => [...prevState, userSelected.id]);
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

      event.dataItems.forEach((item: any) => {
        const id = idGetter(item);
        if (checked) {
          userIDs.push(id);
        }
        newSelectedState = Object.assign(newSelectedState, {
          [id]: checked,
        });
      });
      setSelectedState(newSelectedState);
      setUserIds(userIDs);
    },
    []
  );

  const columns = [
    {
      field: "fullName",
      title: "Full name",
      width: "",
    },
    {
      field: "birthday",
      title: "Birthday",
      width: "",
      format: "{0:D}",
    },
    {
      field: "gender",
      title: "Gender",
      width: "",
    },
    {
      field: "email",
      title: "Email",
      width: "",
    },
    {
      field: "phoneNumber",
      title: "Phone Number",
      width: "",
    },
    {
      field: "address",
      title: "Address",
      width: "",
    },
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  });

  return (
    <div className="w-[90%] lg:px-8 xl:px-0 m-auto p-5">
      <div className="flex justify-end space-x-3">
        <Link to="/user/new">
          <Button className="buttons-container-button" icon="plus">
            New
          </Button>
        </Link>
        <Link
          to={`user/${userIds[0]}`}
          className={userIds.length !== 1 ? "pointer-events-none" : ""}
        >
          <Button
            className="buttons-container-button"
            icon="edit"
            disabled={userIds.length !== 1}
          >
            Edit
          </Button>
        </Link>
        <Button
          className="buttons-container-button"
          icon="delete"
          themeColor="error"
          onClick={() => setIsVisibleModal(true)}
          disabled={userIds.length === 0}
        >
          Delete
        </Button>
      </div>
      <div className="mt-5">
        {users.length === 0 && isLoading && <LoadingPanel />}
        <Grid
          style={{ height: "80vh" }}
          data={orderBy(
            dataState
              .map((item) => ({
                ...item,
                [SELECTED_FIELD]: selectedState[idGetter(item)],
              }))
              .slice(page.skip, page.take + page.skip),
            sort
          )}
          skip={page.skip}
          take={page.take}
          total={dataState.length}
          pageable={{
            info: true,
            buttonCount: 5,
            pageSizes: true,
          }}
          onPageChange={pageChange}
          dataItemKey={DATA_ITEM_KEY}
          selectedField={SELECTED_FIELD}
          selectable={{
            enabled: true,
            drag: false,
            cell: false,
            mode: "multiple",
          }}
          sortable={true}
          sort={sort}
          onSortChange={(e: GridSortChangeEvent) => {
            setSort(e.sort);
          }}
          onSelectionChange={onSelectionChange}
          onHeaderSelectionChange={onHeaderSelectionChange}
        >
          <GridColumn
            field={SELECTED_FIELD}
            width="45px"
            headerSelectionValue={
              dataState
                .slice(page.skip, page.take + page.skip)
                .findIndex((item) => !selectedState[idGetter(item)]) === -1
            }
          />
          {columns.map((column, index) => (
            <GridColumn key={index} {...column} />
          ))}
        </Grid>
      </div>
      <DeleteConfirm
        content="Are you sure you want to continue?"
        visible={isVisibleModal}
        setVisible={setIsVisibleModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};
