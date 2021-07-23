/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import omit from 'lodash.omit';
import classnames from 'classnames';
import update from '@madappgang/update-by-path';
import Input from '~/components/shared/Input';
import Field from '~/components/shared/Field';
import Toggle from '~/components/shared/Toggle';
import Button from '~/components/shared/Button';
import LoadingIcon from '~/components/icons/LoadingIcon';
import SaveIcon from '~/components/icons/SaveIcon';
import WarningIcon from '~/components/icons/WarningIcon.svg';
import MultipleInput from '~/components/shared/MultipleInput';

const extractValue = fn => e => fn(e.target.value);

const FederatedLoginSettingsForm = (props) => {
  const { loading, onSubmit, onCancel } = props;
  const application = props.application || {};

  // TODO: replace from server
  const providers = { apple: { Name: 'Apple' }, facebook: { Name: 'Facebook', default_scopes: ['email'] }, google: { Name: 'Google' } };

  const [federatedLoginSettings, setFederatedLoginSettings] = useState({});

  // const { notifyFailure } = useNotifications();

  useEffect(() => {
    setFederatedLoginSettings(application.federated_login_settings || {});
  }, [props.application]);

  const handleInput = (provider, field, value) => {
    setFederatedLoginSettings({
      ...federatedLoginSettings,
      [provider]: {
        ...federatedLoginSettings[provider],
        params: {
          ...federatedLoginSettings[provider].params,
          [field]: value,
        },
      },
    });
  };

  const toggleProvider = (value) => {
    if (federatedLoginSettings[value]) {
      setFederatedLoginSettings(omit(federatedLoginSettings, value));
      return;
    }

    const scopes = providers[value].default_scopes || [];
    setFederatedLoginSettings({ ...federatedLoginSettings, [value]: { params: {}, scopes } });
  };

  // const checkIsEmptyFields = (field) => {
  //   return (!field.secret || !field.key) || (!field.secret.length || !field.key.length);
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    // const settings = Object.values(federatedLoginSettings);
    // const isEmptyFields = !!settings.length && !!settings.find(s => checkIsEmptyFields(s));

    // if (isEmptyFields) {
    //   notifyFailure({
    //     title: 'Something went wrong',
    //     text: 'Client key and client secret arguments must be provided!',
    //   });
    // }

    // if (!isEmptyFields) {
    onSubmit(update(application, {
      federated_login_settings: federatedLoginSettings,
    }));
    // }
  };

  return (
    <form className="iap-apps-form" onSubmit={handleSubmit}>
      <div className="iap-apps-form__note">
        <WarningIcon className="iap-apps-form__note-icon" />
        <p>
          Note that these settings take effect only when federated login is enabled in
          <Link className="iap-apps-form__note-link" to="/management/settings">
            Login Types
          </Link>
          settings.
        </p>
      </div>

      {Object.entries(providers).map((provider) => {
        const isActive = provider[0] in federatedLoginSettings;

        const providerClassName = classnames({
          'iap-apps-form__provider': true,
          'iap-apps-form__provider--open': isActive,
        });

        return (
          <div key={provider[0]} className={providerClassName}>
            <Toggle
              label={provider[1].Name}
              value={isActive}
              onChange={() => toggleProvider(provider[0])}
            />
            {isActive && (
              <>
                <Field label="Client Key">
                  <Input
                    value={federatedLoginSettings[provider[0]].params.ClientId}
                    autoComplete="off"
                    placeholder="Enter Client Id"
                    onChange={extractValue(v => handleInput(provider[0], 'ClientId', v))}
                  />
                </Field>

                <Field label="Client Secret">
                  <Input
                    value={federatedLoginSettings[provider[0]].params.Secret}
                    autoComplete="off"
                    placeholder="Enter Client Secret"
                    onChange={extractValue(v => handleInput(provider[0], 'Secret', v))}
                  />
                </Field>
                <Field label="PKCS8PrivateKey">
                  <textarea
                    value={federatedLoginSettings[provider[0]].params.PKCS8PrivateKey}
                    onChange={extractValue(v => handleInput(provider[0], 'PKCS8PrivateKey', v))}
                  />
                </Field>
                <Field label="TeamId">
                  <Input
                    value={federatedLoginSettings[provider[0]].params.TeamId}
                    autoComplete="off"
                    placeholder="Enter TeamId"
                    onChange={extractValue(v => handleInput(provider[0], 'TeamId', v))}
                  />
                </Field>
                <Field label="KeyId">
                  <Input
                    value={federatedLoginSettings[provider[0]].params.KeyId}
                    autoComplete="off"
                    placeholder="Enter KeyId"
                    onChange={extractValue(v => handleInput(provider[0], 'KeyId', v))}
                  />
                </Field>

                <Field label="Scopes">
                  <MultipleInput
                    values={federatedLoginSettings[provider[0]].scopes}
                    placeholder="Hit Enter to add scope"
                    onChange={v => handleInput(provider[0], 'scopes', v)}
                  />
                </Field>

                <p className="iap-apps-form__text">
                  Don&#39;t forget to add redirect URI
                  {` ${window.location.origin}/web/login?appId=${application.id}&provider=${provider[0]} `}
                  to auth provider settings.
                </p>
              </>
            )}
          </div>
        );
      })}

      <footer className="iap-apps-form__footer">
        <Button
          type="submit"
          disabled={loading}
          Icon={loading ? LoadingIcon : SaveIcon}
        >
          Save Changes
        </Button>
        <Button transparent disabled={loading} onClick={onCancel}>
          Cancel
        </Button>
      </footer>
    </form>
  );
};

export default FederatedLoginSettingsForm;
