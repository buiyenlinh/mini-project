import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Stepper } from "@progress/kendo-react-layout";
import { addUser, getUsers, updateUser } from "../../mockapi/user-list";
import {
  Form,
  FormElement,
  FormSubmitClickEvent,
} from "@progress/kendo-react-form";
import { Information } from "./steps/information";
import { Contact as UserContact } from "./steps/contact";
import useStore from "../../store";
import { observer } from "mobx-react";
import NotFound from "../not-found";
import { getUser } from "../../mockapi/user-list";
import { User } from "../../interfaces/user";
import LoadingPanel from "../loading";
import { ButtonCustom } from "../button";
import { checkDisabledSubmitButton } from "../../helper";
import { ToastType } from "../toast/toast-item";
import { Work } from "./steps/work";

export type DetaiUserParams = {
  slug: string;
};

type Step = {
  label: string;
  isValid?: boolean;
};

const stepPages = [<Information />, <UserContact />, <Work />];

const CreateOrUpdateUser = () => {
  const { slug } = useParams<DetaiUserParams>();
  const history = useHistory();

  const { userStore, toastStore } = useStore();
  const { onAddToast } = toastStore;
  const { onAdd, onUpdate, onCreateId, getUserById, onSetUsers } = userStore;

  const [user, setUser] = useState<User>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const [steps, setSteps] = useState<Step[]>([
    {
      label: "Information",
      isValid: undefined,
    },
    {
      label: "Contact",
      isValid: undefined,
    },
    {
      label: "Work",
      isValid: undefined,
    },
  ]);

  useEffect(() => {
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

    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [onSetUsers]);

  const renderLoading = useMemo(() => {
    if (isLoading) return <LoadingPanel />;
    return <NotFound />;
  }, [isLoading]);

  useEffect(() => {
    getUser(slug).then((res) => {
      setUser(res);
    });
  }, [slug]);

  useEffect(() => {
    const userInfo = getUserById(slug);
    if (userInfo) {
      setUser(userInfo);
    }
  }, [getUserById, slug]);

  const handleGoBack = () => {
    history.goBack();
  };

  const isNewUser = useMemo(() => {
    return slug === "new";
  }, [slug]);

  const render = useMemo(() => {
    return stepPages[currentStep];
  }, [currentStep]);

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
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

  const isLastStep = useMemo(() => {
    return currentStep === steps.length - 1;
  }, [currentStep, steps]);

  const isAllStepsValid = useMemo(() => {
    let isValid = true;
    steps.forEach((_step) => {
      if (!_step.isValid || _step.isValid === undefined) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }, [steps]);

  const titleSubmitButton = useMemo(() => {
    if (isLastStep) {
      if (isNewUser) return "New user";
      return "Update user";
    }
    return "Next";
  }, [isLastStep, isNewUser]);

  const onStepSubmit = useCallback(
    (event: FormSubmitClickEvent) => {
      const { isValid, values } = event;
      const current = steps.map((step, index) => ({
        ...step,
        isValid: index === currentStep ? isValid : step.isValid,
      }));

      if (!isValid) return;

      setSteps(current);
      setCurrentStep(() => Math.min(currentStep + 1, steps.length - 1));

      if (isAllStepsValid) {
        const id = user.id ? user.id : onCreateId();
        let userInfo = Object.assign(values, { id });

        if (isNewUser) {
          userInfo = Object.assign(userInfo, {
            created_at: new Date(),
            updated_at: new Date(),
          });
          onAdd(userInfo);
          addUser(userInfo);
        } else {
          userInfo = Object.assign(userInfo, { updated_at: new Date() });
          onUpdate(userInfo);
          updateUser(userInfo);
        }

        handleAddToast(isNewUser ? "User added" : "User updated", "success");
        history.push("/");
      }
    },
    [
      steps,
      isAllStepsValid,
      currentStep,
      user.id,
      onCreateId,
      handleAddToast,
      isNewUser,
      history,
      onAdd,
      onUpdate,
    ]
  );

  const isDisabledSubmitButton = useCallback(
    (errors: { [name: string]: any }, allowSubmit: boolean) => {
      const isError = checkDisabledSubmitButton(errors);

      let isDisabled = false;
      if (isError || !allowSubmit) {
        isDisabled = true;
      }

      if (user && !isError) {
        isDisabled = false;
      }
      return isDisabled;
    },
    [user]
  );

  return (
    <>
      {slug !== "new" && !user?.id ? (
        renderLoading
      ) : (
        <div className="2xl:w-[60%] w-[80%] lg:px-8 xl:px-0 m-auto py-5">
          <div className="mt-5">
            <div className="w-[70%] border-[1px] border-black-600 p-7 m-auto">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleGoBack()}
              >
                <i className="fas fa-angle-left mr-2" />
                <span className="inline-block pb-[2px] font-bold">Back</span>
              </div>
              <h2 className="font-bold uppercase text-xl text-center pb-3">
                {isNewUser ? "New user" : "Update user"}
              </h2>

              <div className="flex justify-between">
                <div className="">
                  <Stepper
                    value={currentStep}
                    items={steps}
                    orientation="vertical"
                    className="w-[200px]"
                  />
                </div>
                <div className="w-[calc(100%-200px)]">
                  <Form
                    onSubmitClick={onStepSubmit}
                    initialValues={user}
                    key={JSON.stringify(user)}
                    render={(formRenderProps) => {
                      const isDisabled = isDisabledSubmitButton(
                        formRenderProps.errors,
                        formRenderProps.allowSubmit
                      );

                      return (
                        <div style={{ alignSelf: "center" }}>
                          <FormElement>
                            {render}
                            <span className="k-form-separator mt-10" />
                            <div className="k-form-buttons k-button k-button-md k-rounded-md k-button-solid k-button-solid-bases-end content-center !justify-between">
                              <span className="font-bold">
                                Step {currentStep + 1} of {steps.length}
                              </span>
                              <div className="space-x-2">
                                {currentStep !== 0 && (
                                  <ButtonCustom
                                    title="Previous"
                                    iconLeftClass="fas fa-angle-left"
                                    onClick={handlePreviousStep}
                                  />
                                )}

                                <ButtonCustom
                                  themeColor="primary"
                                  title={titleSubmitButton}
                                  iconRightClass={
                                    !isLastStep ? "fas fa-angle-right" : ""
                                  }
                                  disabled={isDisabled}
                                  onClick={formRenderProps.onSubmit}
                                  type="submit"
                                />
                              </div>
                            </div>
                          </FormElement>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default observer(CreateOrUpdateUser);
