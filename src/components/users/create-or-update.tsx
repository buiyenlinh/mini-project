import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Stepper } from "@progress/kendo-react-layout";
import { addUser, updateUser } from "../../mockapi/user-list";
import {
  Form,
  FormElement,
  FormSubmitClickEvent,
} from "@progress/kendo-react-form";
import Information from "./information";
import { Contact as UserContact } from "./contact";
import { Button } from "@progress/kendo-react-buttons";
import useStore from "../../store";
import { observer } from "mobx-react";
import NotFound from "../not-found";
import { getUser } from "../../mockapi/user-list";
import { User } from "../../interfaces/user";
import LoadingPanel from "../loading";

export type DetaiUserParams = {
  slug: string;
};

type Step = {
  label: string;
  isValid?: boolean;
};

const stepPages = [<Information />, <UserContact />];

const CreateOrUpdateUser = () => {
  const { slug } = useParams<DetaiUserParams>();
  const history = useHistory();
  const { userStore, toastStore } = useStore();
  const { onAdd, onUpdate, onCreateId, getUserById, onExistEmailOrPhone } =
    userStore;
  const { onAddToast } = toastStore;

  const [user, setUser] = useState<User | undefined>({
    birthday: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  const renderLoading = useMemo(() => {
    if (isLoading) return <LoadingPanel />;
    return <NotFound />;
  }, [isLoading]);

  useEffect(() => {
    getUser(slug).then((res) => {
      if (res) {
        setUser({ ...res, birthday: new Date(res.birthday) });
      }
    });
  }, [slug]);

  useEffect(() => {
    const userInfo = getUserById(slug);
    if (userInfo) {
      setUser({
        ...userInfo,
        birthday: userInfo.birthday ? new Date(userInfo.birthday) : null,
      });
    }
  }, [getUserById, slug]);

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
  ]);

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

  const isLastStep = useMemo(() => {
    return currentStep === steps.length - 1;
  }, [currentStep, steps]);

  const isPreviousStepsValid = useMemo(() => {
    return (
      steps
        .slice(0, currentStep)
        .findIndex((current) => current.isValid === false) === -1
    );
  }, [currentStep, steps]);

  const isLastStepValid = useMemo(() => {
    return steps[steps.length - 1].isValid;
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

      if (isPreviousStepsValid && isLastStepValid) {
        let userInfo = {
          fullName: values.fullName,
          birthday: values.birthday,
          gender: values.gender,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
        };

        const errors = onExistEmailOrPhone(
          values.email,
          values.phoneNumber,
          !isNewUser ? slug : undefined
        );
        if (errors.length > 0) {
          errors.forEach((item) => {
            onAddToast({
              id: new Date(),
              content: item,
              type: "error",
            });
          });
        } else {
          if (isNewUser) {
            userInfo = Object.assign(userInfo, { id: onCreateId() });
            onAdd(userInfo);
            addUser(userInfo);
            onAddToast({
              id: new Date(),
              content: "User added",
              type: "success",
            });
          } else {
            userInfo = Object.assign(userInfo, { id: slug });
            onUpdate(userInfo);
            updateUser(userInfo);
            onAddToast({
              id: new Date(),
              content: "User updated",
              type: "success",
            });
          }
          history.push("/");
        }
      }
    },
    [
      steps,
      isPreviousStepsValid,
      isLastStepValid,
      currentStep,
      onExistEmailOrPhone,
      onAddToast,
      isNewUser,
      history,
      onCreateId,
      onAdd,
      slug,
      onUpdate,
    ]
  );

  return (
    <>
      {slug !== "new" && !user?.id ? (
        renderLoading
      ) : (
        <div className="w-[90%] lg:px-8 xl:px-0 m-auto py-5">
          <div className="mt-5">
            <div className="w-[70%] border-[1px] border-black-600 p-7 m-auto">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleGoBack()}
              >
                <span className="k-icon k-i-arrow-chevron-left"></span>
                <span>Back</span>
              </div>
              <h2 className="font-bold uppercase text-xl text-center pb-3">
                {isNewUser ? "New user" : "Update user"}
              </h2>

              <Stepper value={currentStep} items={steps} />
              <Form
                onSubmitClick={onStepSubmit}
                initialValues={user}
                key={JSON.stringify(user)}
                render={(formRenderProps) => (
                  <div style={{ alignSelf: "center" }}>
                    <FormElement>
                      {render}
                      <span
                        style={{ marginTop: "40px" }}
                        className={"k-form-separator"}
                      />
                      <div
                        style={{
                          justifyContent: "space-between",
                          alignContent: "center",
                        }}
                        className={
                          "k-form-buttons k-button k-button-md k-rounded-md k-button-solid k-button-solid-bases-end"
                        }
                      >
                        <span>
                          Step {currentStep + 1} of {steps.length}
                        </span>
                        <div className="space-x-2">
                          {currentStep !== 0 && (
                            <Button
                              onClick={handlePreviousStep}
                              iconClass="k-i-arrow-chevron-left"
                            >
                              Previous
                            </Button>
                          )}

                          <Button
                            themeColor="primary"
                            disabled={!formRenderProps.allowSubmit}
                            onClick={formRenderProps.onSubmit}
                          >
                            <span>{titleSubmitButton}</span>
                            {!isLastStep && (
                              <span className="k-i-arrow-chevron-up pl-2" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </FormElement>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default observer(CreateOrUpdateUser);
