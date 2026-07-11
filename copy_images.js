const fs = require('fs');
const path = require('path');

const files = [
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\tugatrades_mockup_1783760179518.png',
    dest: path.join(__dirname, 'public', 'tugatrades.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\equuschain_mockup_1783760202297.png',
    dest: path.join(__dirname, 'public', 'equuschain.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\nzlmobile_mockup_1783760218540.png',
    dest: path.join(__dirname, 'public', 'nzlmobile.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\crconidigital_mockup_1783760231850.png',
    dest: path.join(__dirname, 'public', 'crconidigital.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\neurokaizen_mockup_1783760246514.png',
    dest: path.join(__dirname, 'public', 'neurokaizen.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\freshartclub_mockup_1783760261561.png',
    dest: path.join(__dirname, 'public', 'freshartclub.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\art_gallery_mockup_1783760908096.png',
    dest: path.join(__dirname, 'public', 'art_gallery_mockup.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\corporate_web_mockup_1783760926863.png',
    dest: path.join(__dirname, 'public', 'corporate_web_mockup.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\mobile_app_mockup_1783760944172.png',
    dest: path.join(__dirname, 'public', 'mobile_app_mockup.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\food_delivery_mockup_1783760964246.png',
    dest: path.join(__dirname, 'public', 'food_delivery_mockup.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\dating_app_mockup_1783760981244.png',
    dest: path.join(__dirname, 'public', 'dating_app_mockup.png')
  },
  {
    src: 'C:\\Users\\asus s\\.gemini\\antigravity-ide\\brain\\d8c8f44f-f35c-4af9-b0dc-543784052c80\\betting_tips_mockup_1783761000551.png',
    dest: path.join(__dirname, 'public', 'betting_tips_mockup.png')
  }
];

files.forEach(f => {
  try {
    if (fs.existsSync(f.src)) {
      fs.copyFileSync(f.src, f.dest);
      console.log(`Successfully copied image to: ${path.relative(__dirname, f.dest)}`);
    } else {
      console.error(`Source file not found: ${f.src}`);
    }
  } catch (err) {
    console.error(`Error copying ${path.basename(f.dest)}:`, err.message);
  }
});
