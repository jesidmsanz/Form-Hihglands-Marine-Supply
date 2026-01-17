import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import facebookIcon from './images/facebook.svg';
import xIcon from './images/x.svg';
import instagramIcon from './images/instagram.svg';
import linkedinIcon from './images/linkedin.svg';
import pinterestIcon from './images/pinterest.svg';
import youtubeIcon from './images/youtube.svg';
import yelpIcon from './images/yelp.svg';
import { formatPhoneText } from '@/utils/utilities/stringUtils';

const Footer = () => {
  return (
    <footer className="grid-area-footer bg-[#ccc] py-8 px-4">
      <div className="container">
        <div className="mb-4 lg:flex lg:justify-between lg:items-center lg:gap-4 lg:mb-10">
          <Link href="/" className="block">
            <img
              src="/images/logo.webp"
              alt={`${process.env.NEXT_PUBLIC_NAME_COMPANY} logo`}
              className="h-[50px] w-auto lg:h-[67px] mx-auto"
              loading="eager"
            />
          </Link>
          <div className="border-t border-main-color pt-2 pb-2 flex justify-between items-center lg:border-t-0 lg:pt-0 lg:pb-0 lg:justify-end lg:gap-8 lg:mb-1">
            <address className="text-[0.5rem] lg:text-[0.958125rem] xl:text-base xl:not-italic">
              <a
                href={process.env.NEXT_PUBLIC_GOOGLE_MAPS}
                target="_blank"
                rel="noreferrer"
                aria-label="Address opens in a new tab"
              >
                {process.env.NEXT_PUBLIC_ADDRESS_COMPANY} {process.env.NEXT_PUBLIC_CITY_COMPANY},{' '}
                {process.env.NEXT_PUBLIC_STATE_COMPANY} {process.env.NEXT_PUBLIC_ZIP_CODE_COMPANY}
              </a>
            </address>
            <a
              href={`tel:+1${process.env.NEXT_PUBLIC_PHONE_COMPANY}`}
              className="border border-main-color rounded-[1.3rem] block px-2 py-[0.45rem] text-[0.684375rem] flex justify-between items-center gap-1 lg:text-[1.05rem] lg:px-3 lg:py-2"
            >
              <PhoneIcon className="block h-3 w-3 lg:h-4 lg:w-4" aria-hidden="true" />
              {formatPhoneText(process.env.NEXT_PUBLIC_PHONE_COMPANY)}
            </a>
          </div>
        </div>
        <div className="grid mb-6 lg:flex lg:gap-4 lg:justify-center lg:items-center lg:border-b lg:border-white lg:pb-6 lg:mb-7 xl:gap-[0.89rem]">
          <Link
            href="/"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Home
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/dentist-simi-valley"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Dentist & Staff
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/dental-office-simi-valley"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Dental Practice
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/our-dental-services"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Dental Services
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/patient-information"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Patient Info
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/dental-articles-simi-valley"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Blog
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/contact-dentist"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Contact Us
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/sitemap"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Sitemap
          </Link>
          <span className="divider hidden lg:inline-block">|</span>
          <Link
            href="/web-accessibility"
            className="block border-b border-white text-center py-[0.9rem] lg:border-b-0 lg:text-[0.9rem] lg:py-0 xl:text-[1.1875rem]"
          >
            Web Accessibility
          </Link>
        </div>
        <div className="hidden lg:block leading-relaxed text-justify max-w-[1000px] mx-auto text-[0.95rem] mb-7 xl:max-w-[1190px]">
          Victor K. Muradian, DDS{' '}
          <Link href="/dentist-simi-valley" className="hover:underline">
            dentist in Simi Valley, CA
          </Link>
          . Quality dental care provided by{' '}
          <Link href="/dentist-simi-valley" className="hover:underline">
            dentist Victor Muradian
          </Link>{' '}
          and staff at our beautiful CA{' '}
          <Link href="/dental-office-simi-valley" className="hover:underline">
            Simi Valley dental office
          </Link>
          . Providing a wide array of dental procedures including{' '}
          <Link href="/esthetic-general-dentistry" className="hover:underline">
            Esthetic General Dentistry
          </Link>
          ,{' '}
          <Link href="/preventive-dentistry" className="hover:underline">
            Preventative Dentistry
          </Link>
          ,{' '}
          <Link href="/natural-fillings" className="hover:underline">
            Tooth Colored Fillings
          </Link>
          ,{' '}
          <Link href="/teeth-whitening-simi-valley" className="hover:underline">
            Teeth Whitening
          </Link>
          ,{' '}
          <Link href="/replacing-missing-teeth" className="hover:underline">
            Replacing Missing Teeth
          </Link>
          ,{' '}
          <Link href="/cosmetic-dentistry-simi-valley" className="hover:underline">
            Cosmetic Dentist
          </Link>
          ,{' '}
          <Link href="/teeth-whitening-simi-valley" className="hover:underline">
            Teeth Whitening
          </Link>
          ,{' '}
          <Link href="/porcelain-veneers-simi-valley" className="hover:underline">
            Veneers
          </Link>
          ,{' '}
          <Link href="/dental-implants-simi-valley" className="hover:underline">
            Dental Implants
          </Link>
          ,{' '}
          <Link href="/sedation-dentistry" className="hover:underline">
            Sedation Dentistry
          </Link>
          ,{' '}
          <Link href="/sedation-dentistry" className="hover:underline">
            Sleep Dentistry
          </Link>
          , Toothache and many other services. All of this available in our convenient
          <Link href="/dental-office-simi-valley" className="hover:underline">
            dentist office in Simi Valley
          </Link>
          , CA. Also Proudly Serving:{' '}
          <Link href="/simi-valley-dentist" className="hover:underline">
            Simi Valley
          </Link>
          ,{' '}
          <Link href="/dentist-moorpark" className="hover:underline">
            Moorpark
          </Link>
          ,{' '}
          <Link href="/dentist-porter-ranch" className="hover:underline">
            Porter Ranch
          </Link>
          ,{' '}
          <Link href="/dentist-chatsworth" className="hover:underline">
            Chatsworth
          </Link>
          ,{' '}
          <Link href="/dentist-granada-hills" className="hover:underline">
            Granada Hills
          </Link>{' '}
          93063, 93065, 93021
        </div>
        <div className="flex justify-center items-center pb-8 border-b border-[#444] mb-4">
          <a
            href="https://www.facebook.com/DrMuradianDDS"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook opens in a new tab"
            className="mx-1 lg:mx-2"
          >
            <img src={facebookIcon.src} alt="Facebook Victor Muradian" />
          </a>

          <a
            href="https://x.com/SimiDentistDDS"
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter) opens in a new tab"
            className="mx-1 lg:mx-2"
          >
            <img src={xIcon.src} alt="X Victor Muradian" />
          </a>

          <a
            href="https://www.instagram.com/victormuradiandds/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram opens in a new tab"
            className="mx-1 lg:mx-2"
          >
            <img src={instagramIcon.src} alt="Instagram Victor Muradian" />
          </a>

          <a
            href="https://www.linkedin.com/pub/victor-muradian/67/58a/1"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn opens in a new tab"
            className="mx-1 lg:mx-2"
          >
            <img src={linkedinIcon.src} alt="LinkedIn Victor Muradian" />
          </a>

          <a
            href="https://www.pinterest.com/victormuradian/"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest opens in a new tab"
            className="mx-1 lg:mx-2"
          >
            <img src={pinterestIcon.src} alt="Pinterest Victor Muradian" />
          </a>

          <a
            href="https://www.youtube.com/channel/UCDJyAg9qE3ATE8BxYVUbbYg"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube opens in a new tab"
            className="mx-1 lg:mx-2"
          >
            <img src={youtubeIcon.src} alt="YouTube Victor Muradian" />
          </a>

          <a
            href="https://www.yelp.com/biz/victor-k-muradian-dds-simi-valley"
            target="_blank"
            rel="noreferrer"
            aria-label="Yelp opens in a new tab"
            className="mx-1 lg:mx-2"
          >
            <img src={yelpIcon.src} alt="Yelp Victor Muradian" />
          </a>
        </div>
        <p className="text-center text-[0.8rem] text-[#aaa]">
          <a
            href="https://dental.it49.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="IT49 Multimedia opens in a new tab"
          >
            Dental Web Design by IT49 Multimedia
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
