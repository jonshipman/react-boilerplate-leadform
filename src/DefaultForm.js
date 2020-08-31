import React from "react";
import { gql } from "@apollo/client";

import { isPhone, isEmail } from "./functions";
import Base, { TemplateField } from "./Base";

class Form extends Base {
  name = "default";

  form = {
    recaptchaFieldTrigger: "email",
    button: "Contact",
    mutation: gql`
      mutation DefaultForm(
        $clientMutationId: String!
        $wpNonce: String!
        $gToken: String
        $yourName: String
        $email: String!
        $phone: String!
        $message: String
      ) {
        defaultFormMutation(
          input: {
            clientMutationId: $clientMutationId
            wpNonce: $wpNonce
            gToken: $gToken
            yourName: $yourName
            email: $email
            phone: $phone
            message: $message
          }
        ) {
          clientMutationId
          success
          errorMessage
        }
      }
    `,
    fields: {
      yourName: {
        component: (props) => {
          return <TemplateField name="yourName" label="Your Name" {...props} />;
        },
        validity: (v) => {
          return v && v.length > 0;
        },
        errorMessage: "Required.",
      },
      email: {
        component: (props) => {
          return (
            <TemplateField
              className="w-50-l fl-l pr2"
              name="email"
              type="email"
              label="Your Email"
              {...props}
            />
          );
        },
        validity: (v) => {
          return isEmail(v);
        },
        errorMessage: "Invalid email address.",
      },
      phone: {
        component: (props) => {
          return (
            <TemplateField
              className="w-50-l fl-l pl2"
              name="phone"
              type="tel"
              label="Your Phone"
              {...props}
            />
          );
        },
        validity: (v) => {
          return isPhone(v);
        },
        errorMessage: "Invalid phone number.",
      },
      message: {
        component: (props) => {
          return (
            <TemplateField name="message" label="Your Message" {...props} />
          );
        },
        validity: () => {
          return true;
        },
      },
    },
  };

  getMutationData = (data) => {
    const { defaultFormMutation } = data;
    return defaultFormMutation;
  };
}

export default new Form();
