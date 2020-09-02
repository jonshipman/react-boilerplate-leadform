import React from "react";

import Button from "./Button";
import DefaultForm from "./DefaultForm";
import FormError from "./FormError";
import Recaptcha from "./Recaptcha";
import useForm from "./useForm";

const defaultClasses = {
  button: null,
  input: null,
};

const LeadForm = ({
  form = DefaultForm,
  classes = defaultClasses,
  className = "",
}) => {
  const {
    checkAllFields,
    fields,
    formErrors,
    formName,
    FormRender,
    formValues,
    getButton,
    messageError,
    messageSuccess,
    mutation,
    mutationLoading,
    nonce,
    onFormValueChange,
    recatchaSiteKey,
    setToken,
    showRecaptcha,
    token,
  } = useForm({ form });

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
          name={formName}
          fields={fields}
          errors={formErrors}
          values={formValues}
          inputClasses={classes.input}
          updateState={onFormValueChange}
        />
      </div>

      <div className="button-wrap">
        <Button
          form={true}
          loading={mutationLoading}
          className={classes.button}
          onClick={() => {
            if (!Object.values(formErrors).includes(true) && checkAllFields()) {
              const clientMutationId =
                Math.random().toString(36).substring(2) +
                new Date().getTime().toString(36);

              mutation({
                variables: {
                  ...formValues,
                  clientMutationId,
                  wpNonce: nonce,
                  gToken: token,
                },
              });
            }
          }}
        >
          {getButton()}
        </Button>
      </div>
    </div>
  );
};

export default LeadForm;
