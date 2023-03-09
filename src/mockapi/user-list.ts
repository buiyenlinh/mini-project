import { User } from "../interfaces/user";

// export const getUsers = async (callback: Function) => {
//   return await fetch("http://localhost:3001/users").then((res) => res.json()).then(json => callback(json));
// };

export const getUsers = () => {
  return fetch("http://localhost:3001/users")
    .then((res) => res.json())
    .then((json) => json.reverse());
};

export const getUser = (userID: string) => {
  return fetch(`http://localhost:3001/users/${userID}`)
    .then((res) => res.json())
    .then((json) => json);
};

export const addUser = (user: User) => {
  fetch("http://localhost:3001/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};

export const updateUser = (user: User) => {
  fetch(`http://localhost:3001/users/${user.id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};

export const deleteUser = (userIds: string[]) => {
  userIds.forEach((id) => {
    fetch(`http://localhost:3001/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  });
};
