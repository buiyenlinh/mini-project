import md5 from "md5";
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../interfaces/user";

const deleteItem = (arr: any[], itemId: string) => {
  return arr.filter((item) => item.id !== itemId);
};

// const getCount = (date: Date, arr: User[]) => {
//   let count = 0;
//   arr.forEach((item) => {
//     if (item.created_at === date) {
//       count++;
//     }
//   });
//   return count;
// };

export class UserStore {
  users: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  onAdd = (user: User) => {
    console.log("user", user);
    runInAction(() => {
      this.users = [user, ...this.users];
    });
  };

  onUpdate = (user: User) => {
    runInAction(() => {
      const newList = this.users.map((item) => {
        if (item.id === user.id) item = user;
        return item;
      });

      this.users = newList;
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
