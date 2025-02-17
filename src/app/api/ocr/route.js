import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";
import DocumentIntelligence from "@azure-rest/ai-document-intelligence";
import { getLongRunningPoller, isUnexpected } from "@azure-rest/ai-document-intelligence";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;
const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;

export async function POST(req) {
  try {
    // Parse the uploaded file
    const form = new IncomingForm();
    const { files } = await new Promise((resolve, reject) => {
      form.uploadDir = "/tmp"; // Temporary directory
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    if (!files.file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read file and convert to Base64
    const filePath = files.file[0].filepath;
    const fileData = await fs.readFile(filePath);

    // Initialize Azure Document Intelligence
    const client = DocumentIntelligence(endpoint, { key });

    // Send file to Azure for OCR analysis
    const initialResponse = await client.path("/documentModels/prebuilt-idDocument:analyze").post({
      contentType: "application/octet-stream",
      body: fileData,
    });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    // Wait for Azure to process the document
    const poller = getLongRunningPoller(client, initialResponse);
    const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

    return NextResponse.json({ result: analyzeResult });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
