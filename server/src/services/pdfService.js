import { PDFParse } from "pdf-parse";

export async function extractText(buffer) {
  const parser = new PDFParse({ data: buffer });  // initialize parser

  const result = await parser.getText();          // extract text

  await parser.destroy();                         // free memory

  return result.text;                             // return just text
}
