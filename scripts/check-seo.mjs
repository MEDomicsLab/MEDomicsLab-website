import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { preview } from "vite";
import { indexableRoutes } from "../src/lib/seo.js";

const server = await preview({ preview: { host: "127.0.0.1", port: 0, open: false } });
const { port } = server.httpServer.address();
const sample = indexableRoutes.filter((route) => !route.record);
for (const type of new Set(indexableRoutes.map((route) => route.type).filter(Boolean))) {
  sample.push(indexableRoutes.find((route) => route.type === type));
}

async function lighthouse(command, args = []) {
  await new Promise((done, reject) => {
    const child = spawn(
      process.execPath,
      [
        resolve("node_modules/@lhci/cli/src/cli.js"),
        command,
        "--config=scripts/lighthouse-seo.json",
        ...args,
      ],
      { stdio: "inherit" }
    );
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) done();
      else
        reject(
          new Error(`Lighthouse ${command} failed (exit ${code}). See .lighthouseci/ for reports.`)
        );
    });
  });
}

try {
  await lighthouse("collect", [
    `--chromePath=${chromium.executablePath()}`,
    ...sample.map(({ path }) => `--url=http://127.0.0.1:${port}${path}`),
  ]);
  await lighthouse("assert");
  console.log(
    `Lighthouse SEO: 100/100 on ${sample.length} representative pages. Reports stay in .lighthouseci/.`
  );
} finally {
  await new Promise((done, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : done()))
  );
}
