import { useCallback, useEffect, useState, useMemo } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import DefaultForm from "./DefaultForm";

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

const useForm = ({ form = DefaultForm }) => {
  const {
    name: formName,
    component: FormRender,
    form: { fields, recaptchaFieldTrigger },
    isValid,
    getMutation,
    buildState,
    getButton,
    getMutationData,
  } = form;

  const { data = {}, loading, error } = useQuery(QUERY, { errorPolicy: "all" });

  const initialState = useMemo(() => {
    return buildState();
  }, [buildState]);

  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [token, setToken] = useState();
  const [nonce, setNonce] = useState();
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const { formData = {} } = data;
  const { wpNonce = [], recatchaSiteKey = "" } = formData;

  useEffect(() => {
    wpNonce.forEach((n) => {
      if (n.form === formName) {
        setNonce(n.wpNonce);
      }
    });
  }, [wpNonce, formName]);

  const [
    mutation,
    { loading: mutationLoading, data: mutationData },
  ] = useMutation(getMutation());

  const onFormValueChange = useCallback(
    (field, value) => {
      setFormValues((prev) => ({ ...prev, [field]: value }));
      setFormErrors((prev) => ({
        ...prev,
        [field]: !isValid(field, value),
      }));

      setShowRecaptcha((prev) => {
        // Trigger the recaptcha loading.
        if (recaptchaFieldTrigger === field && isValid(field, value)) {
          return true;
        } else if (!recaptchaFieldTrigger) {
          return true;
        }

        return prev;
      });
    },
    [
      isValid,
      setFormValues,
      setFormErrors,
      setShowRecaptcha,
      recaptchaFieldTrigger,
    ],
  );

  const checkAllFields = useCallback(() => {
    let pass = true;

    Object.entries(fields).map(([key, { isValid }]) => {
      if (!isValid(formValues[key])) {
        pass = false;
      }
    });

    return pass;
  }, [fields, formValues]);

  let messageSuccess = "";
  let messageError = error?.message || "";

  if (mutationData) {
    const { success, messageError: eMsg } = getMutationData(mutationData);

    if (success) {
      messageSuccess = "Form submitted. Thank you for your submission.";
    }

    if (eMsg) {
      messageError = eMsg;
    }
  }

  return {
    checkAllFields,
    error,
    fields,
    formErrors,
    formName,
    FormRender,
    formValues,
    getButton,
    loading,
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
  };
};

export default useForm;
