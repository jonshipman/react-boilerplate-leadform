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

const useForm = ({
  form = DefaultForm,
  modifyValuesOnSubmit = () => {},
  onCompleted = () => {},
}) => {
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
  const [submissionError, setSubmissionError] = useState("");

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
  }, [wpNonce, formName, setNonce]);

  const [
    mutation,
    { loading: mutationLoading, data: mutationData },
  ] = useMutation(getMutation(), { onCompleted });

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
    const requiredFields = [];

    Object.keys(fields).forEach((key) => {
      if (!isValid(key, formValues[key])) {
        pass = false;
        requiredFields.push(key);
      }
    });

    return [pass, requiredFields];
  }, [fields, formValues, isValid]);

  const submit = useCallback(() => {
    let pass = !Object.values(formErrors).includes(true);
    let fields = [];

    if (pass) {
      [pass, fields] = checkAllFields();
    }

    if (pass) {
      const clientMutationId =
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36);

      const variables = {
        ...formValues,
        clientMutationId,
        wpNonce: nonce,
        gToken: token,
      };

      modifyValuesOnSubmit(variables);

      mutation({ variables });
    } else {
      setSubmissionError("Not all required fields were filled.");
      console.error("Required Fields:", fields);
    }
  }, [
    formErrors,
    checkAllFields,
    mutation,
    formValues,
    nonce,
    token,
    modifyValuesOnSubmit,
    setSubmissionError,
  ]);

  let messageSuccess = "";
  let messageError = error?.message || submissionError;

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
    submit,
    token,
  };
};

export default useForm;
