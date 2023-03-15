import md5 from "md5";
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../interfaces/user";

const deleteItem = (arr: any[], itemId: string) => {
  return arr.filter((item) => item.id !== itemId);
};

export class UserStore {
  private _users: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get users() {
    return this._users;
  }

  addUserState = (user: User) => {
    runInAction(() => {
      this._users = [user, ...this._users];
    });
  };

  updateUserState = (user: User) => {
    runInAction(() => {
      const newList = this._users.map((item) => {
        if (item.id === user.id) item = user;
        return item;
      });

      this._users = newList;
    });
  };

  deleteUserState = (userIds: string[]) => {
    runInAction(() => {
      userIds.forEach((item) => {
        this._users = deleteItem(this._users, item);
      });
    });
  };

  setUsersState = (users: User[]) => {
    runInAction(() => {
      this._users = users;
    });
  };

  getUserStateById = (userId: string) => {
    return this._users.find((user) => user.id === userId);
  };

  createUserId = () => {
    const now = new Date();
    return md5(now.getTime().toString());
  };

  checkExistEmailOrPhone = (email?: string, phone?: string, id?: string) => {
    const errors = [];
    const existEmail = this._users.find(
      (user) => user.email === email && user.id !== id
    );
    const existPhone = this._users.find(
      (user) => user.phoneNumber === phone && user.id !== id
    );
    if (existEmail) {
      errors.push("This email is already in use");
    }

    if (existPhone) {
      errors.push("This phone is already in use");
    }

    return errors;
  };
}
