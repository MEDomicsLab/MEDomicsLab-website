import PageLink from "../../../components/PageLink/PageLink.jsx";
import vision from "../../../data/vision.json";
import "./SelectedPublications.css";

export default function SelectedPublications() {
  return (
    <section id="selected-publications" className="vision-section vision-pubs">
      <h2>Selected publications</h2>
      {[
        ["JA", "Journal articles"],
        ["CP", "Conference papers"],
      ].map(([prefix, label]) => (
        <div className="vision-bibliography" key={prefix}>
          <h3>{label}</h3>
          <ul>
            {Object.entries(vision.publications)
              .filter(([id]) => id.startsWith(prefix))
              .map(([id, p]) => (
                <li key={id} id={`paper-${id}`}>
                  <PageLink href={p.url} arrowSize="sm">
                    <span className="vision-kicker">{id}</span>
                    <span>{p.title}</span>
                  </PageLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
