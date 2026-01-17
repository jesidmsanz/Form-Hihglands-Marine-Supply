import { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Script from 'next/script';
import customMessage from '@/utils/message';
import { createContactActionWithObject } from '@/app/actions/contacts';
import { updateToken, PUBLIC_KEY } from '@/utils/recaptcha';
import { createBodyEmail, sendEmail } from '@/utils/apiEmails';

const FormContact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [clickedSubmit, setClickedSubmit] = useState(false);

  const [captcha, setCaptcha] = useState(true);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const formRef = useRef();

  //Custom Validations
  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'First Name is required';
    }
    if (!values.lastName) {
      errors.lastName = 'Last Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid Email';
    }
    if (!values.phone) {
      errors.phone = 'Phone is required';
    } else {
      if (!/^(?=.*?[1-9])[0-9() +-]+$/gm.test(values.phone)) {
        errors.phone = 'Invalid Phone Number';
      }
    }
    if (!values.message) {
      errors.message = 'Message is required';
    }
    if (!values.sendInformation) {
      errors.sendInformation = 'You must respond if you want to receive notifications';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      sendInformation: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        const token = await updateToken(PUBLIC_KEY, 'submit');
        if (!token) {
          setCaptcha(false);
          return;
        }
        setSubmitting(true);

        // Usar Server Action en lugar de API Route
        const result = await createContactActionWithObject({
          fullName: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phone: values.phone,
          message: values.message,
          sendInformation: values.sendInformation === 'Yes' ? true : false,
          token,
        });

        if (result.success) {
          try {
            const subject = `${process.env.NEXT_PUBLIC_NAME_COMPANY} - Contact Form - ${values.firstName} ${values.lastName}`;
            const body = createBodyEmail(
              `${values.firstName} ${values.lastName}`,
              values.email,
              values.phone,
              values.message,
              values.sendInformation
            );

            await sendEmail(
              `${values.firstName} ${values.lastName}`,
              process.env.NEXT_PUBLIC_EMAIL_CONTACT,
              values.email,
              subject,
              body
            );
          } catch (error) {
            console.log('error', error);
          }
          customMessage.success('Your form has been successfully submitted.');
        } else {
          customMessage.error(result.error || 'There was an error.');
        }
        formik.resetForm();
        setSubmitting(false);
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        setCaptcha(false);
        setSubmitting(false);
        customMessage.error('reCAPTCHA verification failed. Please try again.');
      }
    },
  });

  // Cargar reCAPTCHA cuando el formulario esté visible (lazy loading)
  useEffect(() => {
    if (recaptchaReady) return;

    const observerForm = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // El Script de Next.js ya carga el script, solo verificamos que esté listo
            if (typeof window !== 'undefined' && window.grecaptcha) {
              setRecaptchaReady(true);
            }
            observerForm.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.2 }
    );

    if (formRef.current) {
      observerForm.observe(formRef.current);
    }

    return () => {
      observerForm.disconnect();
    };
  }, [recaptchaReady]);

  return (
    <>
      {/* Usando next/script (nativo de Next.js) para cargar reCAPTCHA de forma optimizada */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${PUBLIC_KEY}`}
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.grecaptcha) {
            setRecaptchaReady(true);
          }
        }}
        onError={() => {
          console.error('Failed to load reCAPTCHA');
          setCaptcha(false);
        }}
      />
      <form
        onSubmit={formik.handleSubmit}
        ref={formRef}
        className={submitting ? 'form-submitting' : ''}
      >
        <label className="sr-only" htmlFor="g-recaptcha-response-100000">
          Captcha Google
        </label>
        <div className="row">
          <div className="form-group">
            <label className="form-label" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              maxLength={50}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName || ''}
            />
            {formik.errors.firstName && formik.touched.firstName && (
              <div className="invalid-feedback">{formik.errors.firstName}</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              maxLength={50}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName || ''}
            />
            {formik.errors.lastName && formik.touched.lastName && (
              <div className="invalid-feedback">{formik.errors.lastName}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              maxLength={50}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email || ''}
            />
            {formik.errors.email && formik.touched.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              maxLength={20}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone || ''}
            />
            {formik.errors.phone && formik.touched.phone && (
              <div className="invalid-feedback">{formik.errors.phone}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea
            className="form-control"
            id="message"
            style={{ height: 150 + 'px' }}
            maxLength={500}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message || ''}
          ></textarea>
          {formik.errors.message && formik.touched.message && (
            <div className="invalid-feedback">{formik.errors.message}</div>
          )}
        </div>

        <fieldset className="form-group">
          <legend className="form-label">
            Do you want to receive email notifications, news and special offers from us?
          </legend>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sendInformation"
              id="sendInformationSi"
              onChange={formik.handleChange}
              value="Yes"
              checked={formik.values.sendInformation === 'Yes' ? true : false}
            />
            <label className="form-label" htmlFor="sendInformationSi">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sendInformation"
              id="sendInformationNo"
              onChange={formik.handleChange}
              value="No"
              checked={formik.values.sendInformation === 'No' ? true : false}
            />
            <label className="form-label" htmlFor="sendInformationNo">
              No
            </label>
          </div>
          {formik.errors.sendInformation && formik.touched.sendInformation && (
            <div className="invalid-feedback">{formik.errors.sendInformation}</div>
          )}
        </fieldset>
        <div className="text-center">
          <button
            className="btn btn-outline-main"
            type="submit"
            onClick={() => setClickedSubmit(true)}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        {clickedSubmit &&
          Object.values(formik.errors).map((error, i) => (
            <div className="invalid-feedback text-center" key={i}>
              {error}
            </div>
          ))}
        <br />
      </form>
    </>
  );
};

export default FormContact;
