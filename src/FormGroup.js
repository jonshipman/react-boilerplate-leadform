import React, { forwardRef } from "react";

const defaultFormGroupClasses = {
  group: "form-group overflow-hidden w-100 mb4",
  field: "w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2",
  label: "fw7 ttu db w-100 mb2 pl2",
  cbLabelPrime: "main",
  cbLabelInner: "dib pointer mr3 mb2",
  cbField: "dib ml2",
  cbGroup: "flex-l",
  cbGroupLabel: "w-50-l",
  cbGroupField: "w-50-l",
};

const keyGeneration = ({ loading = false }) => {
  return loading ? `loading` : `loaded`;
};

const Checkbox = ({
  id,
  type = "checkbox",
  label = "Checkbox",
  onChange = () => {},
  value = "",
  className = "",
  children,
  loading,
  options = [{ value: "1", label: "" }],
  forwardedRef,
  classes = {},
  ...props
}) => {
  const {
    cbLabelPrime,
    cbLabelInner,
    cbField,
    cbGroup,
    cbGroupLabel,
    cbGroupField,
  } = classes;

  return (
    <div className={className} ref={forwardedRef}>
      <div className={cbGroup}>
        <div className={cbGroupLabel}>
          <label htmlFor={id} className={`${cbLabelPrime} ${classes.label}`}>
            {label}:{" "}
          </label>
        </div>

        <div className={cbGroupField}>
          {options.map(({ value: oValue, label: oLabel }) => (
            <label
              htmlFor={`${id}-${oValue}`}
              className={cbLabelInner}
              key={`${id}-${oValue}`}
            >
              <input
                id={`${id}-${oValue}`}
                type={type}
                value={oValue}
                checked={value === oValue}
                className={cbField}
                onChange={(e) => onChange(e.currentTarget.value)}
                key={keyGeneration({ loading })}
                {...props}
              />
              {` ${oLabel}`}
            </label>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
};

const Input = ({
  id,
  label,
  type = "text",
  onChange = () => {},
  onEnter = () => {},
  value = "",
  className = "",
  children,
  loading,
  forwardedRef,
  classes,
  ...props
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className={classes.label}>
        {label}:{" "}
      </label>
    )}
    <input
      ref={forwardedRef}
      onKeyDown={(e) => "Enter" === e.key && onEnter()}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      type={type}
      value={value}
      className={classes.field}
      style={{ flexGrow: 1 }}
      key={keyGeneration({ loading })}
      {...props}
    />
    {children}
  </div>
);

const Select = ({
  id,
  label,
  onChange = () => {},
  options = {},
  value = "",
  className = "",
  children,
  placeholder,
  loading,
  forwardedRef,
  classes,
  ...props
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className={classes.label}>
        {label}:{" "}
      </label>
    )}
    <select
      ref={forwardedRef}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      value={value}
      className={classes.field}
      style={{ flexGrow: 1 }}
      key={keyGeneration({ loading })}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {children}
  </div>
);

const Textarea = ({
  id,
  label,
  onChange = () => {},
  onEnter = () => {},
  value = "",
  className = "",
  children,
  loading,
  forwardedRef,
  classes,
  ...props
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className={classes.label}>
        {label}:{" "}
      </label>
    )}
    <textarea
      ref={forwardedRef}
      onKeyDown={(e) => "Enter" === e.key && onEnter()}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      value={value}
      className={classes.field}
      style={{ flexGrow: 1 }}
      key={keyGeneration({ loading })}
      {...props}
    />
    {children}
  </div>
);

const FormGroup = (
  {
    type = "text",
    className = "",
    children,
    classes = defaultFormGroupClasses,
    ...props
  },
  ref,
) => {
  if (!classes) classes = {};
  Object.keys(defaultFormGroupClasses).forEach((key) => {
    if (!classes[key]) classes[key] = defaultFormGroupClasses[key];
  });

  const mergedClassName = `${classes.group} ${className}`;

  if ("textarea" === type) {
    return (
      <Textarea
        forwardedRef={ref}
        className={mergedClassName}
        classes={classes}
        {...props}
      >
        {children}
      </Textarea>
    );
  }

  if ("select" === type) {
    return (
      <Select
        forwardedRef={ref}
        className={mergedClassName}
        classes={classes}
        {...props}
      >
        {children}
      </Select>
    );
  }

  if ("checkbox" === type || "radio" === type) {
    return (
      <Checkbox
        forwardedRef={ref}
        type={type}
        className={mergedClassName}
        classes={classes}
        {...props}
      >
        {children}
      </Checkbox>
    );
  }

  return (
    <Input
      forwardedRef={ref}
      type={type}
      className={mergedClassName}
      classes={classes}
      {...props}
    >
      {children}
    </Input>
  );
};

export default forwardRef(FormGroup);
