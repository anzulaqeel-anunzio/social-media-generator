#!/usr/bin/env node
// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

/*
 * Developed for Anunzio International by Anzul Aqeel
 * Contact +971545822608 or +971585515742
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');
const chalk = require('chalk');
const { program } = require('commander');

program
    .version('1.0.0')
    .option('-i, --input <file>', 'Input Markdown file', 'README.md')
    .option('-o, --output <file>', 'Output image file', 'og-image.png')
    .option('-c, --color <hex>', 'Accent color', '#0969da')
    .action((options) => {
        run(options);
    });

program.parse(process.argv);

async function run(options) {
    const fullPath = path.resolve(process.cwd(), options.input);
    const outputPath = path.resolve(process.cwd(), options.output);

    if (!fs.existsSync(fullPath)) {
        console.error(chalk.red(`File not found: ${fullPath}`));
        process.exit(1);
    }

    console.log(chalk.blue(`Reading ${options.input}...`));
    const markdown = fs.readFileSync(fullPath, 'utf8');

    // Simple extraction of Title (H1) and Description (first paragraph after H1)
    const tokens = marked.lexer(markdown);
    let title = 'Awesome List';
    let description = '';

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'heading' && tokens[i].depth === 1) {
            title = tokens[i].text;
            // Look for next paragraph
            for (let j = i + 1; j < tokens.length; j++) {
                if (tokens[j].type === 'paragraph') {
                    description = tokens[j].text;
                    break;
                }
            }
            break;
        }
    }

    console.log(chalk.blue(`Generating image for: ${title}`));
    console.log(chalk.gray(`Description: ${description.substring(0, 50)}...`));

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                margin: 0; 
                width: 1200px; 
                height: 630px; 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                text-align: center;
                border: 20px solid ${options.color};
                box-sizing: border-box;
            }
            h1 { 
                font-size: 80px; 
                margin: 0; 
                color: #24292f; 
                line-height: 1.2;
                max-width: 900px;
            }
            p { 
                font-size: 40px; 
                color: #57606a; 
                margin-top: 30px; 
                max-width: 900px; 
                line-height: 1.4;
            }
            .badge {
                margin-top: 50px;
                font-size: 24px;
                background: ${options.color};
                color: white;
                padding: 10px 30px;
                border-radius: 50px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .footer {
                position: absolute;
                bottom: 30px;
                color: #8c959f;
                font-size: 24px;
            }
        </style>
    </head>
    <body>
        <h1>${title}</h1>
        <p>${description}</p>
        <div class="badge">Awesome List</div>
        <div class="footer">Anunzio International</div>
    </body>
    </html>
    `;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 630 });
        await page.setContent(html);
        await page.screenshot({ path: outputPath });
        await browser.close();

        console.log(chalk.green(`Image generated successfully: ${outputPath}`));
    } catch (error) {
        console.error(chalk.red('Error generating image:'), error);
        process.exit(1);
    }
}

// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel
