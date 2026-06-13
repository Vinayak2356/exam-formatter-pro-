import HTMLtoDOCX from "html-to-docx";
import fs from "fs/promises";

async function test() {
  const html = "<h1>Hello World</h1><p>This is a test.</p>";
  const buffer = await HTMLtoDOCX(html);
  await fs.writeFile("test.docx", buffer);
  console.log("Written test.docx");
}

test().catch(console.error);
