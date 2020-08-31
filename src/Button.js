import React from "react";
import { Link } from "react-router-dom";

import DefaultLoading from "./Loading";

const defaultClasses = {
  buttonType1:
    "pointer link bg-animate hover-bg-secondary br2 ph4 pv2 white bg-primary bn",
  buttonType2: "pointer link dim br2 ph4 pv2 white ba b--white",
  buttonType3: "pointer link dim br2 ph4 pv2 primary ba b--primary",
  loadingFlex: "justify-between items-center",
  loading: "ml3",
};

const ButtonRender = ({
  children,
  className = "",
  classes,
  altClasses,
  type,
  form = false,
  to,
  href,
  ...props
}) => {
  let classNames = classes.buttonType1;

  if (2 === type) {
    classNames = classes.buttonType2;
  }

  if (3 === type) {
    classNames = classes.buttonType3;
  }

  if (altClasses) {
    classNames = altClasses;
  }

  classNames += ` ${className}`;

  if (
    !classNames.includes("db") &&
    !classNames.includes("dib") &&
    !classNames.includes("inline-flex") &&
    !classNames.includes("flex")
  ) {
    classNames += " dib";
  }

  if (props.disabled) {
    props.onClick = () => true;
  }

  if (href) {
    return (
      <a href={href} className={classNames} {...props}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  if (form) {
    return (
      <button className={classNames} type="submit" {...props}>
        {children}
      </button>
    );
  }

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

const Button = ({
  loading,
  disabled,
  style = {},
  classes = defaultClasses,
  components = { Loading = DefaultLoading },
  ...props
}) => {
  if (!classes) classes = {};
  Object.keys(defaultClasses).forEach(key => {
    if (!classes[key]) classes[key] = defaultClasses[key];
  });

  if (loading) {
    return (
      <div
        className={`${
          props?.className?.includes("db") ? "flex" : "inline-flex"
        } ${classes.loadingFlex}`}
      >
        <ButtonRender
          disabled={true}
          style={{ ...style, flexGrow: 1 }}
          classes={classes}
          {...props}
        />
        <components.Loading className={classes.loading} />
      </div>
    );
  }

  return (
    <ButtonRender
      disabled={disabled}
      style={style}
      classes={classes}
      {...props}
    />
  );
};

export default Button;
