import { Linking, View } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import { ScrollView, VStack } from 'native-base';
import React from 'react';
import NavbarWrapper from '@/components/modules/NavbarWrapper';

function PrivacyPolicyScreen({ navigation }) {
  const { layout, gutters, fonts } = useTheme();

  return (
    <SafeScreen>
      <NavbarWrapper shouldShowBackButton />

      <ScrollView style={[layout.flex_1]}>
        <VStack px={2} space={6}>
          <View style={[gutters.marginB_20]}>
            <Text style={[gutters.marginB_20, fonts.size_24, fonts.semi]}>Privacy Policy</Text>

            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              1. Types of information we collect?
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Contact Information. Name, mailing address, email address, phone number, company
              name, and other contact information.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Device Information. IP address, browser type and version, browser plug-in types and
              versions, operating system and platform, device type and device identifiers.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Billing Information. Credit and debit card numbers and other financial information
              necessary to receive payment for Services purchased, including the number of
              individuals within the organization that will be using the Services.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Account Information. If you create an account, we may store and use your username,
              password, hints, and other personal information you may provide to authenticate your
              account. You can modify some of the personal information associated with your account.
              If you believe that someone has created an unauthorized account, you can request its
              removal.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Google account: We need to access your profile when you log-in with a google account
              and your mailbox when you set your workspace email. You can manage our access request
              by allowing or canceling when we ask you we want to access your google account.
              {'\n'}(
              <Text
                style={{ color: 'blue' }}
                onPress={() =>
                  Linking.openURL('https://support.google.com/accounts/answer/10130420?hl=en')
                }
              >
                How Google helps users share their data safely?
              </Text>
              )
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              2. What do we use your information for?
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              Nutsales is a software-as-a-service (SaaS) company that supports our customers to
              enhance their customer relationship management functionality.
              {'\n'}We will use user's data from Gmail that users allow us to read, compose, and
              send emails for the following:
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - First: Matching and routing pipeline-mailbox based on customize rule.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Second: Ensuring every email is assigned to the right person who can increase
              customer relationships. Using Round Robin so that team's members can take turns
              handling work.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Third: Create communication hub between members of company
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Last: Generative AI for quick responses, sentiment analysis
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              As a Web application so all external customers can easily access Nutsales app at{' '}
              <Text
                style={{ color: 'blue' }}
                onPress={() => Linking.openURL('https://app.nutsales.co')}
              >
                https://app.nutsales.co
              </Text>
              . Our product wants to support our clients so that they can respond to their customers
              in golden time and improve productivity, without losing any lead or profit.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              3. Do we disclose any information to outside parties?
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We do not sell, trade, or otherwise transfer your personal information except in
              accordance with this policy. This does not include trusted third parties who assist us
              in operating our website, conducting our business, or servicing you, so long as those
              parties agree to keep this information confidential. We may also release your
              information when we believe release is appropriate to comply with the law, enforce our
              site policies, or protect ours or others' rights, property, or safety.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              4. Information You Provide to Us
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We collect a variety of information that you provide directly to us. For example, we
              collect information from you through:
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - The Services you use and your registration to use the Services
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Requests or questions you submit to us via online forms, email, or otherwise
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>- Uploads or posts to the Services</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Requests for customer support and technical assistance
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              The types of data we may collect directly from you includes:
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>- Email address</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>- Mailing address</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>- Business titles and roles</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>- First and last name</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Payment information, collected by our third-party payment processors (e.g., Stripe)
              on our behalf
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Information about how the Services are implemented and used
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Information about your support and customer success interactions with us
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Information provided in responses to surveys we conduct
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - Any other information you choose to directly provide to us in connection with your
              use of the Services
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              When you interact with our Services, we also collect a variety of metadata regarding
              your use of the Services such as: email addresses and names of participants; email
              headers; and information about the number of times and times emails are sent, timing
              and participants in calls and meetings, text notes, and similar information generated
              through your use of the Services.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[fonts.size_14, { fontWeight: '700' }]}>Cookies</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              Like many websites and apps, we use “cookies”, which are small text files that are
              stored on your computer or equipment when you visit certain online pages that record
              your preferences and actions, including how you use the website. We use this
              information for analytics purposes which allows us to improve your browsing
              experience. The information we collect through these technologies will also be used to
              manage your session. Out of these cookies, the cookies that are categorised as
              “necessary” are stored on your browser as they are essential for the working of basic
              functionalities of the website. These necessary cookies cannot be disabled.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[fonts.size_14, { fontWeight: '700' }]}>Cookie Opt-out</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              You can set your browser or device to refuse all cookies or to indicate when a cookie
              is being sent. If you delete your cookies, if you opt-out from cookies, or if you set
              your browser or device to decline these technologies, some Services may not function
              properly. Our Services do not currently change the way they operate upon detection of
              a Do Not Track or similar signal.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[fonts.size_14, { fontWeight: '700' }]}>Online Analytics</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We also use various types of online analytics including Google Analytics, a web
              analytics service provided by Google, Inc. (“Google”), on our website. Google
              Analytics uses cookies or other tracking technologies to help us analyze how users
              interact with and use the website, compile reports on the related activities, and
              provide other services related to website and app activity and usage. The technologies
              used by Google may collect information such as your IP address, time of visit, whether
              you are a return visitor, and any referring website or app. The information generated
              by Google Analytics will be transmitted to and stored by Google and will be subject to
              Google’s privacy policies. To learn more about Google’s partner services and to learn
              how to opt-out of tracking of analytics by Google click here. Offline Interactions and
              Other Sources We also may collect personal information from other sources, such as our
              partners or third party service providers, or from our offline interactions with you
              for the purposes listed in the How We Use Personal Information section below,
              including to enable us to verify or update information contained in our records and to
              better customize the Services for you.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[fonts.size_14, { fontWeight: '700' }]}>Social Media Integration</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              Our Services may, from time to time, contain links to and from social media platforms.
              You may choose to connect to us through a social media platform, such as Facebook,
              LinkedIn or Twitter, and when you do, we may collect additional information from you,
              including the information listed in the Types of Information We Collect section above.
              Please be advised that social media platforms may also collect information from you.
              When you click on a social plug-in, such as Facebook’s “Like” button or Twitter’s
              “Tweet” button, that particular social network’s plugin will be activated and your
              browser will directly connect to that provider’s servers. We encourage you to review
              the social media platforms’ usage and disclosure policies and practices, including the
              data security practices, before using them.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              5. How we share personal information
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We may share personal information with our third party service providers, suppliers,
              vendors, professional advisors and business partners, which may include IT service
              providers, financial institutions and payment providers, customer relationship
              management vendors, other cloud-based solutions providers, lawyers, accountants,
              auditors and other professional advisors. We contract with such vendors and advisers
              to ensure that they only process your personal information under our instructions and
              ensure the security and confidentiality of your personal information. We share
              personal information with these third parties to help us:
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - with the uses described in the How We Use Information section above;
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - in the operation, management, improvement, research and analysis of our Services;
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - with our marketing and promotional projects, such as sending you information about
              products and services you may like and other promotions (provided you have not
              unsubscribed from receiving such marketing and promotional information from us); and
              comply with your directions or any consent you have provided us.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We may share personal information with law enforcement and regulatory authorities or
              other third parties as required or permitted by law for the purpose of:
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - responding to a subpoena, court order, or other legal processes;
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - defending, protecting, or enforcing our rights;
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              - assisting in the event of an emergency; and
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>- complying with applicable law.</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              In accordance with applicable law, we may also transfer or assign personal information
              to third parties as a result of, or in connection with, a sale, merger, consolidation,
              change in control, transfer of assets, bankruptcy, reorganization, or liquidation. If
              we are involved in defending a legal claim, we may disclose personal information about
              you that is relevant to the claim to third parties as a result of, or in connection
              with, the associated legal proceedings.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We share non-personal information with third parties as reasonably necessary to meet
              our business needs.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              Artificial Intelligence (AI) has surged to prominence in the tech industry, showcasing
              its remarkable capacity to learn and adapt to intricate tasks. With its transformative
              potential, AI stands poised to reshape the landscape of business operations. By
              harnessing the formidable capabilities of AI, we can elevate our products, infuse them
              with intelligence and efficiency, and cultivate superior user experiences.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              Recognizing the pivotal role that AI will play in Nutsales' product strategy, we are
              committed to integrating it seamlessly. One key application is sentiment analysis, a
              process that involves scrutinizing digital text to gauge its emotional tone, whether
              it leans positive, negative, or remains neutral. Our customers leverage these insights
              to enhance their customer service and fortify their brand reputation.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              To enable sentiment analysis within our services, it may be necessary for us to share
              the information you provide with our AI models. Rest assured, any data shared will be
              anonymized and processed in discreet portions by our AI models solely for contextual
              analysis of the messages. We maintain a steadfast commitment to safeguarding your
              information, never transmitting it in its entirety to any third-party tools or
              entities.
            </Text>
          </View>

          <View style={[gutters.marginB_20]}>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              6. How we protect personal information
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We are dedicated to ensuring the security of your personal information. We use
              physical, electronic, and administrative security measures appropriate to the risks
              and sensitivity of the personal information we collect. We aim to provide secure
              transmission of your personal information from your devices to our servers. We have
              processes to store personal information that we have collected in secure operating
              environments. Our security procedures mean that we may occasionally request proof of
              identity before we disclose your personal information to you. We try our best to
              safeguard personal information once we receive it, but please understand that no
              transmission of data over the Internet or any other public network can be guaranteed
              to be 100% secure. If you suspect an unauthorized use or security breach of your
              personal information, please contact us immediately.
            </Text>
          </View>
        </VStack>
      </ScrollView>
    </SafeScreen>
  );
}

export default PrivacyPolicyScreen;
