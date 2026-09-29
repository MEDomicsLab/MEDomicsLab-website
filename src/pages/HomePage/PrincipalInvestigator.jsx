import PageLink from "../../components/PageLink/PageLink.jsx";
import { lazy, Suspense } from "react";
import homeData from "../../data/home.json";
import { imageVariant } from "../../lib/images";
import { investigatorName, principalInvestigator as pi } from "./homepageContent";
import SocialIcons from "../../components/SocialIcons/SocialIcons.jsx";
import PartnerLogos from "./PartnerLogos.jsx";
const LabPostcard = lazy(() => import("./LabPostcard.jsx"));

function UniversityLogo({ href, logo, university }) {
  return (
    <a className="neue-university-logo" href={href} target="_blank" rel="noreferrer">
      <img src={logo} alt={university} />
    </a>
  );
}

function Appointment({ start, end, title, department, university, href, logo }) {
  return (
    <p>
      <span>
        <time dateTime={start}>{start}</time> to{" "}
        {end ? <time dateTime={end}>{end}</time> : "present"}
      </span>
      {title},<br />
      {department},<br />
      {university}.
      <UniversityLogo href={href} logo={logo} university={university} />
    </p>
  );
}

export default function PrincipalInvestigator({ paused }) {
  return (
    <section id="lab" className="neue-lab" aria-labelledby="lab-heading">
      <div className="neue-profile">
        <div className="neue-profile-top">
          <div className="neue-profile-portrait">
            <img
              className="neue-profile-photo"
              src={imageVariant(pi.image, 256, "avif")}
              alt={pi.name}
              loading="lazy"
            />
            <div className="neue-profile-universities">
              {pi.appointments?.map((appointment) => (
                <UniversityLogo key={appointment.start} {...appointment} />
              ))}
            </div>
          </div>
          <div className="neue-appointments">
            {pi.appointments?.map((appointment) => (
              <Appointment key={appointment.start} {...appointment} />
            ))}
          </div>
        </div>
        <div className="neue-profile-name">
          <p>Principal Investigator</p>
          <h2 id="lab-heading">
            {investigatorName.firstName}
            <br />
            {investigatorName.rest}
            {pi.degreeSuffix && <span>, {pi.degreeSuffix}</span>}
          </h2>
        </div>
        <div className="neue-profile-bottom">
          <div className="neue-profile-connections">
            <SocialIcons
              member={pi}
              keys={["cv", "email", "scholar", "linkedin"]}
              iconClassName="h-7 w-7"
            />
            <PartnerLogos institutes={pi.institutes} />
          </div>
          <div className="neue-profile-links">
            <PageLink to={`/team/${pi.slug}`}>
              Explore {investigatorName.firstName}’s profile
            </PageLink>
            <PageLink to="/team">Meet our team</PageLink>
          </div>
        </div>
      </div>
      <div className="neue-postcard-column">
        <Suspense fallback={<div className="neue-postcard" />}>
          <LabPostcard paused={paused} mission={homeData.mission.text} />
        </Suspense>
      </div>
    </section>
  );
}
