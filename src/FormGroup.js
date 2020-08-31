import React, { forwardRef } from "react";

const defaultClasses = {
  group: "form-group overflow-hidden w-100 mb4",
  field: "w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2",
  label: "fw7 ttu db w-100 mb2 pl2",
  checkbox: {
    labelPrime: "main",
    labelInner: "dib pointer mr3 mb2",
    field: "dib ml2",
    group: "flex-l",
    groupLabel: "w-50-l",
    groupField: "w-50-l",
  },
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
  ...props
}) => {
  const cbClasses = (prop) => {
    let ret = classes[prop];

    if (!ret) {
      ret = defaultClasses[prop];
    }

    return ret;
  };

  return (
    <div className={className} ref={forwardedRef}>
      <div className={cbClasses("group")}>
        <div className={cbClasses("groupLabel")}>
          <label
            htmlFor={id}
            className={`${cbClasses("labelPrime")} ${classes.label}`}
          >
            {label}:{" "}
          </label>
        </div>

        <div className={cbClasses("groupField")}>
          {options.map(({ value: oValue, label: oLabel }) => (
            <label
              htmlFor={`${id}-${oValue}`}
              className={cbClasses("labelInner")}
              key={`${id}-${oValue}`}
            >
              <input
                id={`${id}-${oValue}`}
                type={type}
                value={oValue}
                checked={value === oValue}
                className={cbClasses("field")}
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
      className={label.field}
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
      className={label.field}
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
      className={label.field}
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
    classes = defaultClasses,
    ...props
  },
  ref,
) => {
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
