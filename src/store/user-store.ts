import md5 from "md5";
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../interfaces/user";
import { getUsers } from "../mockapi/user-list";

const deleteItem = (arr: any[], itemId: string) => {
  return arr.filter((item) => item.id !== itemId);
};

export class UserStore {
  users: User[] = [];

  getUser = getUsers().then((res) => (this.users = res));

  constructor() {
    makeAutoObservable(this);
  }

  onAdd = (user: User) => {
    runInAction(() => {
      this.users = this.users.concat(user);
    });
  };

  onUpdate = (user: User) => {
    runInAction(() => {
      const index = this.users.findIndex((item) => item.id === user.id);
      this.users[index] = user;
    });
  };

  onDelete = (userIds: string[]) => {
    runInAction(() => {
      userIds.forEach((item) => {
        this.users = deleteItem(this.users, item);
      });
    });
  };

  onSetUsers = (users: User[]) => {
    runInAction(() => {
      this.users = users;
    });
  };

  getUserById = (userId: string) => {
    return this.users.find((user) => user.id === userId);
  };

  onCreateId = () => {
    const now = new Date();
    return md5(now.getTime().toString());
  };

  onExistEmailOrPhone = (email?: string, phone?: string, id?: string) => {
    const errors = [];
    const existEmail = this.users.find(
      (user) => user.email === email && user.id !== id
    );
    const existPhone = this.users.find(
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
