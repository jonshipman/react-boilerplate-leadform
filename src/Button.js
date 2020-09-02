import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

import DefaultLoading from "./Loading";

export const defaultClassName =
  "pointer link bg-animate hover-bg-secondary br2 ph4 pv2 white bg-primary bn";

const ButtonRender = ({
  children,
  className = "",
  type,
  form = false,
  to,
  href,
  forwardedRef,
  ...props
}) => {
  let classNames = className;

  if (
    !classNames.includes("db") &&
    !classNames.includes("dib") &&
    !classNames.includes("inline-flex") &&
    !classNames.includes("flex")
  ) {
    classNames += " dib";
  }

  if (props.disabled) {
    props.onClick = () => {};
  }

  if (href) {
    return (
      <a ref={forwardedRef} href={href} className={classNames} {...props}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link ref={forwardedRef} to={to} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  if (form) {
    return (
      <button
        ref={forwardedRef}
        className={classNames}
        type="submit"
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <div ref={forwardedRef} className={classNames} {...props}>
      {children}
    </div>
  );
};

const Button = (
  {
    loading,
    disabled,
    style = {},
    className = defaultClassName,
    Loading = DefaultLoading,
    ...props
  },
  ref,
) => {
  if (loading) {
    return (
      <div
        className={`${
          className?.includes("db") ? "flex" : "inline-flex"
        } justify-between items-center`}
      >
        <ButtonRender
          forwardedRef={ref}
          disabled
          style={{ ...style, flexGrow: 1 }}
          className={className}
          {...props}
        />
        <Loading className="ml3" />
      </div>
    );
  }

  return (
    <ButtonRender
      forwardedRef={ref}
      disabled={disabled}
      style={style}
      className={className}
      {...props}
    />
  );
};

export default forwardRef(Button);
