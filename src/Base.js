import React, { useCallback } from "react";

import FormError from "./FormError";
import { FormGroup } from "./FormGroup";

export const TemplateField = ({
  errorMessage,
  hasError,
  key,
  name,
  groupClassName,
  className,
  ...props
}) => {
  const moreProps = {};

  if (groupClassName) {
    moreProps.className = `${groupClassName} ${className}`;
    moreProps.replaceClass = true;
  } else {
    moreProps.className = className;
  }

  return (
    <FormGroup
      id={name}
      onError={hasError && <FormError>{errorMessage}</FormError>}
      {...moreProps}
      {...props}
    />
  );
};

const FieldComponentWrapper = ({
  field,
  render: FieldComponent,
  updateState,
  ...props
}) => {
  props.onChange = useCallback(
    (v) => {
      updateState(field, v);
    },
    [updateState, field],
  );
  return <FieldComponent {...props} />;
};

const BaseFormComponent = ({
  name,
  fields,
  updateState,
  errors = {},
  values,
  children,
  groupClassName,
}) => {
  return (
    <React.Fragment>
      {Object.entries(fields).map(([field, { component }]) => {
        return (
          <FieldComponentWrapper
            {...{ groupClassName, children, updateState, field }}
            render={component}
            value={values[field]}
            key={`${name}-${field}`}
            errorMessage={fields[field]?.errorMessage}
            hasError={errors[field]}
          />
        );
      })}
    </React.Fragment>
  );
};

export class Base {
  getButton = () => {
    return this.form.button || "Submit";
  };

  getMutation = () => {
    return this.form.mutation;
  };

  isValid = (key, value) => {
    if (!this.form.fields[key]) {
      console.error(`Key does not exist: ${key}`);
    }
    return this.form.fields[key].validity(value);
  };

  getField = (key) => {
    return this.form[key] ? this.form[key] : null;
  };

  buildState = () => {
    const { fields } = this.form;
    const emptyFormValues = {};

    Object.entries(fields).map(([key]) => {
      emptyFormValues[key] = "";

      return null;
    });

    return emptyFormValues;
  };

  component = BaseFormComponent;
}
