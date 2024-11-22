import { View } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import { ScrollView, VStack } from 'native-base';
import NavbarWrapper from '@/components/modules/NavbarWrapper';
import React from 'react';

function TermsAndConditionsScreen({ navigation }) {
  const { layout, gutters, fonts } = useTheme();

  return (
    <SafeScreen>
      <NavbarWrapper shouldShowBackButton />

      <ScrollView style={[layout.flex_1]}>
        <VStack px={2} space={6}>
          <View>
            <Text style={[gutters.marginB_20, fonts.size_24, fonts.semi]}>
              Terms and Conditions
            </Text>

            <Text style={[fonts.size_14, fonts.line_20]}>
              The following terms and conditions govern all use of the nutsales.co website and all
              content, services and products available at or through the website, including, but not
              limited to, the Nutsales Chrome and Safari extension, the Nutsales iOS app and the
              Nutsales Android app. The Website is offered subject to your acceptance without
              modification of all of the terms and conditions contained herein and all other
              operating rules, policies (including, without limitation, Nutsales's Privacy Policy)
              and procedures that may be published from time to time on this Site by Nutsales
              (collectively, the 'Agreement'). Please read this Agreement carefully before accessing
              or using the Website. By accessing or using any part of the website, you agree to
              become bound by the terms and conditions of this agreement. If you do not agree to all
              the terms and conditions of this agreement, then you may not access the Website or use
              any services. If these terms and conditions are considered an offer by Nutsales,
              acceptance is expressly limited to these terms. The Website is available only to
              individuals who are at least 13 years old.
            </Text>
          </View>

          <View>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              1. PROVISION OF SERVICES
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              We shall make the purchased Services available to You pursuant to this Agreement and
              the relevant Order Forms during a Subscription Term. You agree that Your purchases
              hereunder are neither contingent on the delivery of any future functionality or
              features nor dependent on any oral or written public comments made by Us regarding
              future functionality or features.
            </Text>
          </View>

          <View>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>2. SUBSCRIPTIONS</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              Unless otherwise specified in the applicable Order Form, (i) Services are purchased as
              Subscriptions, and where applicable, at the referenced Subscription Tier in the Order
              Form and may be accessed by no more than the specified number of Users specified in
              the Order Form, (ii) additional Subscriptions may be added during the applicable
              Subscription Term at the same pricing as that for the pre-existing Subscriptions
              thereunder, prorated for the remainder of the Subscription Term in effect at the time
              the additional Subscriptions are added, and (iii) the added Subscriptions shall
              terminate on the same date as the pre-existing Subscriptions. Unless otherwise
              specified in the applicable Order Form, Subscriptions are for designated Users only
              and cannot be shared or used by more than one User but may be reassigned to new Users
              replacing former Users who no longer require ongoing use of the Services.
            </Text>
          </View>

          <View>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              3. USE OF THE SERVICES
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              3.1. Our Responsibilities. We shall: (i) provide Our basic support for the purchased
              Services to You at no additional charge, and/or upgraded support if purchased
              separately, (ii) use commercially reasonable efforts to make the purchased Services
              available 24 hours a day, 7 days a week, except for: (a) planned downtime (of which We
              shall give at least 8 hours notice via the purchased Services and which We shall
              schedule to the extent practicable during the hours from 9:00 p.m. to 6:00 a.m.
              Eastern Time), or (b) any unavailability caused by circumstances beyond Our reasonable
              control, including without limitation, acts of God, acts of government, floods, fires,
              earthquakes, civil unrest, acts of terror, strikes or other labor problems (other than
              those involving Our employees), Internet service provider failures or delays, or
              denial of service attacks, and (iii) provide the purchased Services only in accordance
              with applicable laws and government regulations.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              3.2. Your Responsibilities. You shall: (i) be responsible for Users’ compliance with
              this Agreement, (ii) be responsible for the accuracy, quality and legality of Your
              Data and of the means by which You acquired Your Data, (iii) be responsible for
              ensuring that Your Systems meet the specifications set forth in the Documentation,
              (iv) be responsible for providing Us with the right to access and use Your Data and
              Your Systems, solely as necessary for Us to provide the Services in accordance with
              this Agreement, (v) use commercially reasonable efforts to prevent unauthorized access
              to or use of the Services, and notify Us promptly of any such unauthorized access or
              use, and (vi) use the Services only in accordance with the Documentation and
              applicable laws and government regulations. You shall not: (a) make the Services
              available to anyone other than Users, (b) sell, resell, rent or lease the Services,
              (c) use the Services to store or transmit infringing, libelous, or otherwise unlawful
              or tortious material, or to store or transmit material in violation of third-party
              privacy rights, (d) use the Services to store or transmit Malicious Code, (e)
              interfere with or disrupt the integrity or performance of the Services or third-party
              data contained therein, or (f) attempt to gain unauthorized access to the Services or
              their related systems or networks.
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              3.3. Usage Limitations. Services may be subject to other limitations, such as, for
              example, limits on disk storage space, API usage and other limitations as specified in
              the Documentation.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20, { fontWeight: '700' }]}>Cookies</Text>
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

          <View>
            <Text style={[fonts.size_14, fonts.line_20, { fontWeight: '700' }]}>
              Cookie Opt-out
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              You can set your browser or device to refuse all cookies or to indicate when a cookie
              is being sent. If you delete your cookies, if you opt-out from cookies, or if you set
              your browser or device to decline these technologies, some Services may not function
              properly. Our Services do not currently change the way they operate upon detection of
              a Do Not Track or similar signal.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20, { fontWeight: '700' }]}>
              Online Analytics
            </Text>
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

          <View>
            <Text style={[fonts.size_14, fonts.line_20, { fontWeight: '700' }]}>
              Social Media Integration
            </Text>
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

          <View>
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
          </View>

          <View>
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

          <View>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>4. DATA PROTECTION</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              4.1. Our Protection of Your Data. We shall design, engineer and maintain appropriate
              administrative, physical, and technical safeguards, in accordance with industry
              practice, for protection of the security, confidentiality and integrity of Your Data.
              We shall not: (a) modify Your Data, (b) disclose Your Data except as compelled by law
              in accordance with Section 6.3 (Compelled Disclosure) or as expressly permitted in
              writing by You, or (c) access Your Data except to provide the Services and prevent or
              address service or technical problems, or at Your request in connection with customer
              support matters.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              4.2. Our Limited Rights to Your Data and Systems. Subject to the limited rights
              granted by You hereunder, We acquire no right, title or interest from You or Your
              licensors under this Agreement in or to Your Data or Your Systems, including any
              intellectual property rights therein.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              4.3. Processing subject to EU General Data Protection Regulation Notwithstanding the
              aforementioned, if you as a data controller are subject to the EU General Data
              Protection Regulation, Regulation (EU) 2016/679, Parties have agreed to enter into a
              data processor agreement prior to any processing of Your Data. The data processor
              agreement is attached to this Agreement (Exhibit A) and together with its annexes,
              forms an integral part of this Agreement.
            </Text>
          </View>

          <View>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>5. CONFIDENTIALITY</Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              5.1. Definition of Confidential Information. As used herein, “Confidential
              Information” means all confidential information disclosed by a party (“Disclosing
              Party”) to the other party (“Receiving Party”), whether orally or in writing, that is
              designated as confidential or that reasonably should be understood to be confidential
              given the nature of the information and the circumstances of disclosure. Your
              Confidential Information shall include Your Data and Your Systems; Our Confidential
              Information shall include the Services; and Confidential Information of each party
              shall include the terms and conditions of this Agreement and all Order Forms, as well
              as business and marketing plans, technology and technical information, product plans
              and designs, and business processes disclosed by such party. However, Confidential
              Information (other than Your Data and Your Systems) shall not include any information
              that: (i) is or becomes generally known to the public without breach of any obligation
              owed to the Disclosing Party, (ii) was known to the Receiving Party prior to its
              disclosure by the Disclosing Party without breach of any obligation owed to the
              Disclosing Party, (iii) is received from a third party without breach of any
              obligation owed to the Disclosing Party, or (iv) was independently developed by the
              Receiving Party. For the avoidance of doubt, the non-disclosure obligations set forth
              in this “Confidentiality” section apply to Confidential Information exchanged between
              the parties in connection with Your evaluation of additional services offered by Us
              from time to time.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              5.2. Protection of Confidential Information. The Receiving Party shall use the same
              degree of care that it uses to protect the confidentiality of its own confidential
              information of like kind (but in no event less than reasonable care) (i) not to use
              any Confidential Information of the Disclosing Party for any purpose outside the scope
              of this Agreement, and (ii) except as otherwise authorized by the Disclosing Party in
              writing, to limit access to Confidential Information of the Disclosing Party to those
              of its and its Affiliates’ employees, contractors and agents who need such access for
              purposes consistent with this Agreement and who have signed confidentiality agreements
              with the Receiving Party containing protections no less stringent than those herein.
              Neither party shall disclose the terms of this Agreement or any Order Form to any
              third party other than its Affiliates and their legal counsel and accountants without
              the other party’s prior written consent.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              5.3. Compelled Disclosure. The Receiving Party may disclose Confidential Information
              of the Disclosing Party if it is compelled by law to do so, provided the Receiving
              Party gives the Disclosing Party prior notice of such compelled disclosure (to the
              extent legally permitted) and reasonable assistance, at the Disclosing Party’s cost,
              if the Disclosing Party wishes to contest the disclosure. If the Receiving Party is
              compelled by law to disclose the Disclosing Party’s Confidential Information as part
              of a civil proceeding to which the Disclosing Party is a party, and the Disclosing
              Party is not contesting the disclosure, the Disclosing Party will reimburse the
              Receiving Party for its reasonable cost of compiling and providing secure access to
              such Confidential Information.
            </Text>
          </View>

          <View>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              7. THIRD-PARTY APPLICATIONS
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              The Services may contain features designed to interoperate with Third-Party
              Applications (e.g., Salesforce, Google, LinkedIn or Twitter applications). To use such
              features, You may be required to obtain access to such Third-Party Applications from
              their providers. If the provider of any such Third-Party Application ceases to make
              the Third-Party Application available for interoperation with the corresponding
              Service features on reasonable terms, We may cease providing such Service features
              without entitling You to any refund, credit, or other compensation.
            </Text>
          </View>

          <View>
            <Text style={[gutters.marginB_14, fonts.size_20, fonts.semi]}>
              8. FEES AND PAYMENT FOR PURCHASED SERVICES
            </Text>
            <Text style={[fonts.size_14, fonts.line_20]}>
              8.1. Fees. Applicable fees are due upon your acceptance of the Order Form and in
              accordance with the billing frequency stated in the applicable Order Form. Except as
              otherwise specified herein or in an Order Form, (i) payment obligations are
              non-cancelable and fees paid are non-refundable, and (ii) the number of Subscriptions
              purchased cannot be decreased during the relevant Subscription Term stated on the
              Order Form. Unless specified otherwise in the applicable Order Form, Subscriptions
              require a three month minimum commitment and Subscription fees are based on annual
              periods that begin on the Subscription start date and each anniversary thereof. Except
              as provided in this Section 8.1 below, Subscriptions added in the middle of a monthly
              period, will be charged for that full monthly period and the monthly periods remaining
              in the Subscription Term. If You exceed the usage of such Subscription Tier for three
              (3) consecutive months, You hereby agree that We may increase Your Subscription fees
              for such Subscription to the applicable Subscription Tier for the remainder of the
              Subscription Term.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              8.2. Invoicing and Payment. If You provide credit card information to Us, You
              authorize Us to charge such credit card for all Subscriptions listed in the Order Form
              for the initial Subscription Term and any renewal Subscription Term(s) as set forth in
              Section 13.2 (Term of Purchased Subscriptions). Such charges shall be made in advance
              of any Subscription Term, either annually or in accordance with any different billing
              frequency stated in the applicable Order Form. If the Order Form specifies that
              payment will be by a method other than a credit card, We will invoice You in advance
              and otherwise in accordance with the relevant Order Form. You are responsible for
              providing complete and accurate billing and contact information to Us and notifying Us
              of any changes to such information.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              8.3. Overdue Charges & Suspension of Service. If any charges are not received from You
              by the due date, then at Our discretion, (a) such charges may accrue late interest at
              the rate of 1.5% of the outstanding balance per month, or the maximum rate permitted
              by law, whichever is lower, from the date such payment was due until the date paid,
              and/or (b) we may suspend Our services to You until such charges are paid in full. We
              will give You at least 5 days’ prior notice that Your account is overdue, in
              accordance with Section 14.1 (Manner of Giving Notice), before suspending services to
              You.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              8.4. Payment Disputes. We shall not exercise Our rights under Section 8.3 (Overdue
              Charges & Suspension of Service) if You are disputing the applicable charges
              reasonably and in good faith and are cooperating diligently to resolve the dispute.
            </Text>
          </View>

          <View>
            <Text style={[fonts.size_14, fonts.line_20]}>
              8.5. Taxes. Unless otherwise stated, Our fees do not include any taxes, levies, duties
              or similar governmental assessments of any nature, including but not limited to
              value-added, sales, use or withholding taxes, assessable by any local, state,
              provincial, federal or foreign jurisdiction (collectively, “Taxes”). You are
              responsible for paying all Taxes associated with Your purchases hereunder. If We have
              the legal obligation to pay or collect Taxes for which You are responsible under this
              paragraph, the appropriate amount shall be invoiced to and paid by You, unless You
              provide Us with a valid tax exemption certificate authorized by the appropriate taxing
              authority. For clarity, We are solely responsible for taxes assessable against Us
              based on Our income, property and employees.
            </Text>
          </View>
        </VStack>
      </ScrollView>
    </SafeScreen>
  );
}

export default TermsAndConditionsScreen;
