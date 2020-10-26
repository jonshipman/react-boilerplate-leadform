import React, { useState } from "react";
import { FormGroup } from "./FormGroup";
import Button from "./Button";
import { useRecaptcha } from "./useRecaptcha";
import { useFormData, useLeadFormMutation, useForm } from "./useForm";
import { isEmail, isPhone } from "./functions";

const schema = {
  yourName: {
    valid: function (v) {
      return v !== "";
    },
    text: "You must include a name.",
  },
  email: {
    valid: function (v) {
      return isEmail(v);
    },
    text: "You must include a email.",
  },
  phone: {
    valid: function (v) {
      return isPhone(v);
    },
    text: "Invalid phone.",
  },
  message: {
    valid: function () {
      return true;
    },
  },
};

export const LeadForm = ({
  children,
  className,
  buttonClassName,
  groupClassName,
  submitionMessage = "Form submitted. Thank you for your submission.",
  buttonLabel = "Submit",
  loading: loadingProp,
  mutation,
}) => {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState();
  const { recaptchaSiteKey, nonce } = useFormData("default");
  const [completed, setCompleted] = useState(false);
  const { token } = useRecaptcha({
    trigger: isEmail(form.email),
    key: recaptchaSiteKey,
  });

  const { submitted, loading: mutateLoading } = useLeadFormMutation({
    token,
    nonce,
    mutation,
    onCompleted: (data = {}) => {
      const { defaultFormMutation = {} } = data;
      const { errorMessage, success } = defaultFormMutation;

      if (success) {
        setCompleted(true);
      } else {
        setMessage(errorMessage);
      }
    },
  });

  const loading = mutateLoading || loadingProp;

  const { Check, onChange, onError } = useForm({
    form,
    setForm,
    schema,
    submitted,
  });

  const GroupProps = {};

  if (groupClassName) {
    GroupProps.replaceClass = true;
  }

  return (
    <div {...{ className }}>
      <div className="cf">
        {completed && (
          <div className="success-message primary fw7 f6 mb3">
            {submitionMessage}
          </div>
        )}
        {message && (
          <div className="error-message red fw7 f6 mb3">{message}</div>
        )}
        <FormGroup
          className={groupClassName}
          placeholder="Your Name"
          id="yourName"
          value={form.yourName}
          onChange={(value) => onChange(value, "yourName")}
          help={onError("yourName")}
          {...GroupProps}
        >
          {children}
        </FormGroup>
        <div className="nl2 nr2">
          <FormGroup
            type="email"
            className={`${groupClassName || ""} w-50-l fl-l ph2`}
            placeholder="Your Email"
            id="email"
            value={form.email}
            onChange={(value) => onChange(value, "email")}
            help={onError("email")}
            {...GroupProps}
          >
            {children}
          </FormGroup>
          <FormGroup
            type="tel"
            className={`${groupClassName || ""} w-50-l fl-l ph2`}
            placeholder="Your Phone"
            id="phone"
            value={form.phone}
            onChange={(value) => onChange(value, "phone")}
            help={onError("phone")}
            {...GroupProps}
          >
            {children}
          </FormGroup>
        </div>
        <FormGroup
          className={groupClassName}
          placeholder="Message"
          type="textarea"
          id="message"
          value={form.message}
          onChange={(value) => onChange(value, "message")}
          help={onError("message")}
          {...GroupProps}
        >
          {children}
        </FormGroup>
      </div>
      <div
        className={`button-wrap tr ${groupClassName || ""}`}
        style={{ marginBottom: 0 }}
      >
        <Button
          {...{ loading }}
          className={buttonClassName}
          onClick={() => Check()}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};
