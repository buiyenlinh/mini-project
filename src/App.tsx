import { observer } from "mobx-react";
import { Route, Switch } from "react-router-dom";
import { Header } from "./components/header";
import { NotFound } from "./components/not-found";
import { Toast } from "./components/toast";
import { CreateOrUpdate as CreateOrUpdateUser } from "./components/users/create-or-update";
import { List as UserList } from "./components/users/list";
import useStore from "./store";

function App() {
  const { toastStore } = useStore();
  const { toasts } = toastStore;
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={UserList} />
        <Route path="/user/:slug" component={CreateOrUpdateUser} />
        <Route path="*" component={NotFound} />
      </Switch>

      <Toast toastList={toasts} />
    </div>
  );
}

export default observer(App);
