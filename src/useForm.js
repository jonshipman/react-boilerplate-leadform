import React, { useEffect, useState, useCallback } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

import FormError from "./FormError";

const QUERY = gql`
  query LeadForm {
    formData {
      id
      wpNonce {
        id
        form
        wpNonce
      }
      recatchaSiteKey
    }
  }
`;

const DefaultMutation = gql`
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
`;

export const useFormData = (formName) => {
  const [nonce, setNonce] = useState("");
  const { data = {}, loading, error } = useQuery(QUERY, {
    errorPolicy: "all",
    ssr: false,
  });
  const { formData = {} } = data;
  const { wpNonce = [], recatchaSiteKey = "" } = formData;

  useEffect(() => {
    if (formName) {
      wpNonce.forEach((n) => {
        if (n.form === formName) {
          setNonce(n.wpNonce);
        }
      });
    }
  }, [wpNonce, formName, setNonce]);

  return { nonce, recaptchaSiteKey: recatchaSiteKey, loading, error };
};

export const useForm = ({
  schema = {},
  form,
  setForm,
  submitted = () => {},
}) => {
  const [errors, setErrors] = useState({});

  const Check = () => {
    const newForm = {};

    Object.keys(schema).forEach((key) => {
      if (form[key] === undefined) {
        newForm[key] = "";
      }
    });

    if (Object.keys(newForm).length > 0) {
      setForm((existing) => ({ ...existing, ...newForm }));
    }

    // Loop over the check + newForm for errors
    const _form = { ...form, ...newForm };
    const _errors = {};
    Object.keys(_form).forEach((key) => {
      if (!schema[key].valid(_form[key])) {
        _errors[key] = schema[key].text;
      }
    });

    if (Object.keys(_errors).length > 0) {
      setErrors((previous) => ({ ...previous, ..._errors }));
    } else {
      submitted({
        form,
      });
    }
  };

  const onChange = (value, field) => {
    if (!schema[field].valid(value) && value !== undefined) {
      setErrors((previous) => ({ ...previous, [field]: schema[field].text }));
    } else {
      setErrors((previous) => {
        if (previous[field]) {
          delete previous[field];
        }

        return previous;
      });
    }

    setForm((existing) => ({ ...existing, [field]: value }));
  };

  const onError = (field) => {
    if (errors[field]) {
      return <FormError>{schema[field].text}</FormError>;
    }
  };

  return { Check, onChange, onError };
};

export const useLeadFormMutation = ({
  token,
  nonce,
  mutation = DefaultMutation,
  onCompleted,
}) => {
  const [mutate, { error, loading }] = useMutation(mutation, {
    onCompleted,
    errorPolicy: "all",
  });

  const submitted = useCallback(
    ({ form }) => {
      const clientMutationId =
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36);
      mutate({
        variables: {
          clientMutationId,
          gToken: token,
          wpNonce: nonce,
          ...form,
        },
      });
    },
    [mutate, token, nonce],
  );

  return {
    loading,
    error,
    submitted,
  };
};
