// Runs the script tests against a mock of the Script API.
//   node tools/test/run.mjs
// The addon script is one bundled file, so the tests load a copy of it with the
// Minecraft imports pointed at the mock and the needed names exported.
import { readFileSync, writeFileSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const mock = (name) => JSON.stringify(pathToFileURL(join(here, "mock", name)).href);
const EXPORTS =
    "woaRbd, woaRbdFrames, woaRbdLog, woaRbdRuns, woaRbdHeld, woaRbdProbe, woaRbdBorn, woaRbdDead, woaRbdCd, woaRbdSafe, " +
    "woaRbdPending, woaRbdCan, woaRbdTarget, woaRbdLine, woaRbdCdOf, woaRbdStart, woaHelmDo, woaHelmIs, " +
    "ee, R, Dt, Ot, Yt, kc, hs, Q, _r, be, Ce, Kt, woaSealed";

let src = readFileSync(join(root, "Wheel of Adaptation BP", "scripts", "main.js"), "utf8");
src = src.replaceAll('from "@minecraft/server-ui"', `from ${mock("server-ui.mjs")}`).replaceAll('from "@minecraft/server"', `from ${mock("server.mjs")}`);
const out = join(mkdtempSync(join(tmpdir(), "woa-test-")), "main.test.mjs");
writeFileSync(out, `${src}\nexport { ${EXPORTS} };\n`);

let failed = 0;
for (const file of readdirSync(here).filter((f) => f.endsWith(".test.mjs"))) {
    console.log(`\n== ${file}`);
    const r = spawnSync(process.execPath, [join(here, file)], { stdio: "inherit", env: { ...process.env, WOA_MAIN: pathToFileURL(out).href } });
    if (r.status !== 0) failed++;
}
process.exit(failed ? 1 : 0);
