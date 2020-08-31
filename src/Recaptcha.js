import { useEffect, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";

/**
 * GraphQL query should return the Recaptcha site key as string
 **/
const CHECK_RECAPTCHA = gql`
  query Recaptcha {
    formData {
      id
      recatchaSiteKey
    }
  }
`;

const RECAPTCHA_SCRIPT_URL = "https://recaptcha.net/recaptcha/api.js";
const RECAPTCHA_SCRIPT_REGEX = /(http|https):\/\/(www)?.+\/recaptcha/;

const Recaptcha = ({ callback = () => {} }) => {
  const { data } = useQuery(CHECK_RECAPTCHA);

  const key = data?.formData?.recatchaSiteKey;

  // grecaptcha callback.
  const onLoad = useCallback(() => {
    const { grecaptcha } = window;

    const _ready = () => {
      grecaptcha
        .execute(key, { action: "homepage" })
        .then((token) => callback(token))
        .catch((e) => {
          console.error("Recaptcha error", e);
        });
    };

    grecaptcha.ready(_ready);
  }, [key, callback]);

  // Loads the script in the browser.
  const loadScript = useCallback(() => {
    window._recaptchaLoadingCB = onLoad;

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `${RECAPTCHA_SCRIPT_URL}?onload=_recaptchaLoadingCB&render=${key}`;
    document.body.appendChild(script);
  }, [key, onLoad]);

  // Checks to see if recaptcha has loaded.
  const scriptLoaded = useCallback(() => {
    return Array.from(document.scripts).reduce((_, script) => {
      return RECAPTCHA_SCRIPT_REGEX.test(script.src);
    }, false);
  }, []);

  // Load scripts.
  useEffect(() => {
    if (key) {
      if (!scriptLoaded()) {
        loadScript();
      }
    }
  }, [key, scriptLoaded, loadScript]);

  return null;
};

export default Recaptcha;
