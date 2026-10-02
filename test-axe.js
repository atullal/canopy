
const { JSDOM } = require("jsdom");
const axe = require("axe-core");
const fs = require("fs");

async function runAxe() {
  const html = fs.readFileSync(".next/server/app/fake-friend-request.html", "utf8");
  const dom = new JSDOM(html);
  
  // axe requires some polyfills for jsdom
  global.window = dom.window;
  global.document = dom.window.document;
  global.Node = dom.window.Node;
  global.Element = dom.window.Element;
  global.HTMLElement = dom.window.HTMLElement;
  global.getComputedStyle = dom.window.getComputedStyle;

  try {
    const results = await axe.run(dom.window.document.documentElement);
    console.log(JSON.stringify(results.violations, null, 2));
  } catch(e) {
    console.error(e);
  }
}
runAxe();

