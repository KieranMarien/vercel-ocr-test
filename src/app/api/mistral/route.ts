import { createMistral } from '@ai-sdk/mistral';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { readFileSync } from 'fs';
import { join } from 'path';



export async function POST() {
    try {

        const mistral = createMistral({
            apiKey: process.env.MISTRAL_API_KEY,
        });
        // Read the PDF file from the project root
        const pdfPath = join(process.cwd(), 'Dealer Quotation SO228644.pdf');

        const pdfBase64 = readFileSync(pdfPath, 'base64');

        const result = await generateText({
            model: mistral('mistral-ocr-2505'),
            
            messages: [
              {
                role: 'user',
                content: [
                                     {
                     type: 'text',
                     text: `
Extract structured bicycle product data from this invoice/receipt. Look for:
- Shop/dealer name
- Bicycle brand (Trek, Specialized, Giant, Cannondale, etc.)
- Model name
- Frame type (Lowstep, Highstep, Mountain, Road, etc.)
- Frame size (S, M, L, XL, or measurements like 54cm)
- Color
- Catalogue/original price in euros

Return the data in JSON format.
`,
                   },
                   {
                     type: 'file',
                     data: `data:application/pdf;base64,${pdfBase64}`,
                     mimeType: 'application/pdf',
                   },
                ],
              },
            ],
            // optional settings:
            providerOptions: {
              mistral: {
                documentImageLimit: 8,
                documentPageLimit: 64,
              },
            },
          });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
    }
}