import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server.js";
import App from "./App.jsx";
import Seo from "./components/Seo/Seo.jsx";
import { getMarkdownContent } from "./lib/markdown.js";
import { getSiteRoute } from "./lib/seo.js";

export async function render(pathname) {
  const route = getSiteRoute(pathname);
  const markdown = {};
  if (route?.record?.markdown) {
    const path = route.record.markdown;
    const content = await getMarkdownContent(path);
    if (!content) throw new Error(`Missing article for ${pathname}: ${path}`);
    markdown[path] = content;
  }
  const context = {};
  const html = await new Promise((resolve, reject) => {
    const output = new PassThrough();
    let result = "";
    output.setEncoding("utf8");
    output.on("data", (chunk) => {
      result += chunk;
    });
    output.on("end", () => resolve(result));
    output.on("error", reject);
    const stream = renderToPipeableStream(
      <HelmetProvider context={context}>
        <StaticRouter location={pathname}>
          {route?.redirect ? (
            <>
              <Seo />
              <main>
                <h1>Page moved</h1>
                <a href={route.redirect}>Continue to the new page</a>
              </main>
            </>
          ) : (
            <App />
          )}
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          stream.pipe(output);
        },
        onError(error) {
          reject(error);
          stream.abort();
        },
      }
    );
  });
  const { helmet } = context;
  return {
    html,
    head: [helmet.title, helmet.meta, helmet.link, helmet.script]
      .map((entry) => entry.toString())
      .join("\n"),
    markdown,
  };
}
