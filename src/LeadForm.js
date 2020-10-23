import React from "react";

import Button from "./Button";
import DefaultForm from "./DefaultForm";
import FormError from "./FormError";
import Recaptcha from "./Recaptcha";
import useForm from "./useForm";

const LeadForm = ({
  form = DefaultForm,
  className = "",
  buttonClassName,
  groupClassName,
  children,
  modifyValuesOnSubmit = () => {},
  buttonLoading,
  onCompleted = () => {},
}) => {
  const {
    fields,
    formErrors,
    formName,
    FormRender,
    formValues,
    getButton,
    messageError,
    messageSuccess,
    mutationLoading,
    onFormValueChange,
    recatchaSiteKey,
    setToken,
    showRecaptcha,
    submit,
  } = useForm({ form, modifyValuesOnSubmit, onCompleted });

  return (
    <div className={`lead-form relative ${className}`}>
      {messageError && <FormError>{messageError}</FormError>}

      {messageSuccess && (
        <React.Fragment>
          <div className="success-message gold fw7 f6 mb3">
            {messageSuccess}
          </div>
          <div className="absolute absolute--fill" />
        </React.Fragment>
      )}

      {recatchaSiteKey && showRecaptcha && (
        <Recaptcha callback={(token) => setToken(token)} />
      )}

      <div className="form-groups">
        <FormRender
          {...{ groupClassName, fields }}
          name={formName}
          errors={formErrors}
          values={formValues}
          updateState={onFormValueChange}
        >
          {children}
        </FormRender>
      </div>

      <div className="button-wrap">
        <Button
          form
          loading={mutationLoading || buttonLoading}
          className={buttonClassName}
          onClick={submit}
        >
          {getButton()}
        </Button>
      </div>
    </div>
  );
};

export default LeadForm;
