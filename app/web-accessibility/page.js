import Layout from '@/components/Layout';
import { formatPhoneText } from '@/utils/utilities/stringUtils';

export const metadata = {
  title: `Web Accessibility - ${process.env.NEXT_PUBLIC_NAME_COMPANY}`,
  description: `Read the web accessibility statement for ${process.env.NEXT_PUBLIC_NAME_COMPANY} Our commitment and approach to maintaining an accessible website.`,
};

export default function WebAccessibilityPage() {
  return (
    <Layout>
      <main id="content" className="bypass-block-target main-content content-alice" tabIndex="-1">
        <div className="container">
            <h1 className='font-xl'>Web Accessibility Statement</h1>
            <h2 className="font-lg">Our commitment and approach to maintaining an accessible website</h2>
          <p>{process.env.NEXT_PUBLIC_NAME_COMPANY} is 100% committed to:</p>
          <ul className='list-gap'>
          <li>
              Maintaining a diverse, inclusive and accessible website. {process.env.NEXT_PUBLIC_NAME_COMPANY} is
              constantly improving and solving usability issues in order to deliver new solutions to
              further improve the accessibility of our site.
          </li>
          <li>
              Ensuring that this website achieves, ensures, and complies with the best practices and
              standards defined by Section 508 of the U.S. Rehabilitation Act and the Web Content
              Accessibility Guidelines of the World Wide Web Consortium.
          </li>
          <li>
              Making sure that all new information on the website will achieve &ldquo;Level AA&rdquo; conformance
              to the Web Content Accessibility Guidelines (WCAG) 2.0.
          </li>
          <li>
              Including accessibility functions when we procure 3rd-party systems/apps or upgrades to
              our existing systems.
          </li>
          </ul>
          <br />
          <h3 className="font-lg">Our Current Accessibility Features include:</h3>
          <ol className='list-gap'>
          <li>
              Title tags and meta descriptions to provide information on what the page is about.
          </li>
          <li>Alternate text - an attribute added to an image to describe it.</li>
          <li>Style sheets and JavaScript to enhance functionality and appearance.</li>
          <li>Structural markups that allow the correct visualization of all content.</li>
          <li>The interrelation between forms and labels.</li>
          <li>Interconnection of data cells within data tables, along with their headers.</li>
          </ol>

          <p>
          More accessibility efforts are currently on the way. Every time we improve our website, we
          will update the changes here within our accessibility statement. This way, you will be
          able to learn about the advancements we&apos;re making.
          </p>
          <br />
          <h3 className="font-lg">How to send feedback regarding this website&apos;s accessibility</h3>
          <p>We welcome feedback on the accessibility of {process.env.NEXT_PUBLIC_NAME_COMPANY}&apos;s website.</p>
          <p>
              Phone us on <a href={`tel:+1${process.env.NEXT_PUBLIC_PHONE_COMPANY}`}>{formatPhoneText(process.env.NEXT_PUBLIC_PHONE_COMPANY)}</a>
          </p>
          <address className='mb-8'>Visit us at <a href={process.env.NEXT_PUBLIC_GOOGLE_MAPS} target="_blank" rel="noreferrer noopener" aria-label='Opens in new tab'>{process.env.NEXT_PUBLIC_ADDRESS_COMPANY}, {process.env.NEXT_PUBLIC_CITY_COMPANY}, {process.env.NEXT_PUBLIC_STATE_COMPANY} {process.env.NEXT_PUBLIC_ZIP_CODE_COMPANY}</a></address>
          <p>Email us at <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_COMPANY}`} className="break-email">{process.env.NEXT_PUBLIC_EMAIL_COMPANY}</a></p>
        </div>
      </main>
    </Layout>
  );
}

