import React, {useState, useCallback} from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {
  Card,
  Page,
  Layout,
  Form,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  ChoiceList,
  TextField,
  Checkbox,
} from '@shopify/polaris';

function Settings({loading, updateSettingsMutation}) {
  const [autoPublish, setAutoPublish] = useState(false);
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selected, setSelected] = useState(['hidden']);
  const handleChange = useCallback((value) => setSelected(value), []);
  const handleEmailChange = useCallback((value) => setEmail(value), []);

  const handleFormSubmit = () => {
    // We prevent form submission when there is an error in the email field.
    if (emailError) {
      return;
    }

    // Otherwise, we use GraphQL to update the merchant's app settings.
    updateSettingsMutation({
      variables: {
        autoPublish,
        emailNotifications,
        email,
      },
    });
  };

  // While the data loads during our GraphQL request, we render skeleton content to signify to the merchant that page data is on its way.
  const loadingStateContent = loading ? (
    <Layout>
      <Layout.AnnotatedSection
        title="Auto publish"
        description="Automatically check new reviews for spam and then publish them."
      >
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Layout.AnnotatedSection>
      <Layout.AnnotatedSection
        title="Email settings"
        description="Choose if you want to receive email notifications for each review."
      >
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  ) : null;

  const settingsFormContent = !loading ? (
    <Layout>
      {/* Annotated sections are useful in settings pages to give more context about what the merchant will change with each setting. */}
      <Layout.AnnotatedSection
        title="Auto publish"
        description="Automatically check new reviews for spam and then publish them."
      >
        <Card sectioned>

          <ChoiceList
            title="Auto publish"
            choices={[
              {label: 'Enabled', value: 'optional', helpText: 'New reviews are checked for spam and then are automatically published.'},
              {label: 'Disabled', value: 'required', helpText: 'You must manually approve and publish new reviews.'},
            ]}
            selected={selected}
            onChange={handleChange}
          />
        </Card>
      </Layout.AnnotatedSection>
      <Layout.AnnotatedSection
        title="Email settings"
        description="Choose if you want to receive email notifications for each review."
      >
        <Card sectioned>
          <TextField
            value={email}
            onChange={handleEmailChange}
            label="Email"
            type="email"
          />
          <Checkbox
            label="Send me an email when a review is submitted."
          />
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  ) : null;

  // We wrap our page component in a form component that handles form submission for the whole page. We could also handle submittal with the onClick event of the save button. Either approach works fine.
  return (
    <Form onSubmit={handleFormSubmit}>
      <Page
        title="Settings"
        primaryAction={{content: 'Save'}}
        breadcrumbs={[{content: 'Product reviews', url: '/'}]}
      >
        {loadingStateContent}
        {settingsFormContent}
      </Page>
    </Form>
  );
}

export default compose(
  graphql(
    gql`
      query SettingsQuery {
        settings {
          autoPublish
          emailNotifications
          email
        }
      }
    `,
    {
      name: 'settingsQuery',
    },
  ),
  graphql(
    gql`
      mutation updateSettings(
        $autoPublish: Boolean
        $emailNotifications: Boolean
        $email: String
      ) {
        updateSettings(
          autoPublish: $autoPublish
          emailNotifications: $emailNotifications
          email: $email
        ) {
          autoPublish
          emailNotifications
          email
        }
      }
    `,
    {
      name: 'updateSettingsMutation',
    },
  ),
)(Settings);
