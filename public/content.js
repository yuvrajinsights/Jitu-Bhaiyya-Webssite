const contentPages = {
  'political-journey': {
    title: 'राजकीय प्रवास',
    image: '/assets/demo-meeting.svg',
    lead: '{{nameMr}} यांचा नमुना राजकीय प्रवास — खालील पूर्वीच्या जबाबदाऱ्या काल्पनिक डेमो नोंदी आहेत, वास्तविक पदे नाहीत.',
    blocks: [
      { heading: 'सध्याची जबाबदारी', text: 'सभापती, समाज कल्याण विभाग, पुणे जिल्हा परिषद — पदनाम वापरकर्त्याने दिले आहे; कार्यकाळाचा तपशील पडताळणीअंतर्गत आहे.' },
      { heading: '२०२३–२०२४ · नमुना जबाबदारी', text: 'समुदाय संपर्क उपक्रम समन्वयक — काल्पनिक डेमो पद, वास्तविक राजकीय नोंद नाही.' },
      { heading: '२०२४–२०२५ · नमुना जबाबदारी', text: 'स्थानिक सामाजिक संवाद मंच सदस्य — काल्पनिक डेमो पद, वास्तविक राजकीय नोंद नाही.' }
    ]
  },
  'party-work': {
    title: 'राष्ट्रवादी काँग्रेस पक्षाचे कार्य',
    image: '/assets/demo-community.svg',
    lead: '{{nameMr}} यांच्या पक्षीय सहभागाची मांडणी दाखवणारे हे काल्पनिक डेमो उदाहरण आहे; वास्तविक पक्ष कार्यक्रम नाही.',
    blocks: [
      { heading: '१० ऑगस्ट २०२५ · कार्यकर्ता संवाद मेळावा', text: 'स्थानिक विषयांवर संवाद आणि सूचना नोंदवण्याचा काल्पनिक डेमो कार्यक्रम.' },
      { heading: '२८ ऑगस्ट २०२५ · संघटनात्मक बैठक', text: 'कार्यक्रम नियोजन व कार्यकर्त्यांशी संवाद — काल्पनिक नमुना, वास्तविक पक्ष नोंद नाही.' },
      { heading: 'डेमो चिन्ह', text: 'पृष्ठावरील सजावटीचे चिन्ह नमुना आहे; ते राष्ट्रवादी काँग्रेस पक्षाचे अधिकृत चिन्ह नाही.' }
    ]
  },
  'social-work': {
    title: 'सामाजिक कार्य व जनसेवा',
    image: '/assets/demo-inclusion.svg',
    lead: '{{nameMr}} यांच्या सामाजिक कार्याची माहिती कशी दिसेल यासाठी खाली नमुना कार्डे दिली आहेत. ती काल्पनिक आहेत.',
    blocks: [
      { heading: '१५ जुलै २०२५ · विद्यार्थी मार्गदर्शन', text: 'शैक्षणिक दिशा व शिष्यवृत्ती अर्ज प्रक्रियेवर नमुना माहिती सत्र; वास्तविक कार्यक्रम नाही.' },
      { heading: '२१ ऑगस्ट २०२५ · सुलभता संवाद', text: 'सार्वजनिक ठिकाणे अधिक सुलभ करण्यावरील काल्पनिक डेमो चर्चा.' },
      { heading: '०५ सप्टेंबर २०२५ · समुदाय मदत केंद्र', text: 'नागरिकांना अर्ज प्रक्रियेची माहिती देणारा डेमो उपक्रम; लाभार्थी किंवा परिणामांचे आकडे नाहीत.' }
    ]
  },
  'department': {
    title: 'समाज कल्याण विभागाशी संबंधित माहिती',
    image: '/assets/demo-education.svg',
    lead: 'समाज कल्याण विभागाशी संबंधित उपक्रमांचे उदाहरण म्हणून काल्पनिक डेमो नोंदी दाखवल्या आहेत. हे अधिकृत विभागीय अभिलेख नाहीत.',
    blocks: [
      { heading: 'वसतिगृह सुविधा पाहणी · नमुना', text: 'विद्यार्थी निवास, स्वच्छता आणि अभ्यास सुविधांवर आधारित काल्पनिक डेमो नोंद.' },
      { heading: 'विभागीय आढावा · नमुना', text: 'प्रलंबित विषय आणि सेवा वेळापत्रकाचा आढावा — डेमो मजकूर, वास्तविक निर्णय नाही.' },
      { heading: 'अधिकृत माहिती', text: 'योजना किंवा अर्जासाठी संबंधित सरकारी संकेतस्थळावरील अद्ययावत माहिती तपासा. हे वैयक्तिक संकेतस्थळ आहे.' }
    ]
  },
  schemes: {
    title: 'शासकीय योजना नागरिकांसाठी',
    image: '/assets/demo-education.svg',
    lead: 'ही योजना माहिती पृष्ठाची डेमो रचना आहे. खालील उदाहरण काल्पनिक आहे आणि कोणतीही वास्तविक शासकीय योजना नाही.',
    blocks: [
      { heading: 'नमुना योजना · विद्यार्थी सहाय्य माहिती केंद्र', text: 'फक्त कार्ड कसे दिसेल हे दाखवण्यासाठीचे नाव; वास्तविक सरकारी योजना नाही.' },
      { heading: 'पात्रता व कागदपत्रे', text: 'डेमो मजकूर — वास्तविक पात्रता, लाभरक्कम किंवा कागदपत्रांची यादी नाही.' },
      { heading: 'अर्ज प्रक्रिया', text: 'डेमो मजकूर — अर्ज लिंक उपलब्ध नाही. कोणताही अर्ज येथे करू नका.' }
    ]
  },
  activities: {
    title: 'कार्यक्रम व दौरे',
    image: '/assets/demo-community.svg',
    lead: '{{nameMr}} यांच्या कार्यक्रमांची नमुना यादी. सर्व दिनांक व ठिकाणे काल्पनिक डेमो तपशील आहेत.',
    blocks: [
      { heading: '१५ जुलै २०२५ · विद्यार्थी संवाद', text: 'नमुना स्थळ · पुणे — काल्पनिक डेमो कार्यक्रम.' },
      { heading: '०६ ऑगस्ट २०२५ · विभागीय बैठक', text: 'नमुना स्थळ · पुणे जिल्हा — काल्पनिक डेमो कार्यक्रम.' },
      { heading: '२१ ऑगस्ट २०२५ · नागरिक भेट', text: 'नमुना स्थळ · बारामती परिसर — काल्पनिक डेमो कार्यक्रम; वास्तविक दौरा नाही.' }
    ]
  },
  news: {
    title: 'बातम्या व माध्यमे',
    image: '/assets/demo-meeting.svg',
    lead: '{{nameMr}} यांच्याविषयी बातमी विभागाची डेमो मांडणी. खालील शीर्षके काल्पनिक आहेत; ती वृत्तपत्रांमध्ये प्रकाशित झालेली नाहीत.',
    blocks: [
      { heading: '१२ ऑगस्ट २०२५ · नागरिक संवाद कार्यक्रमाचा नमुना वृत्तांत', text: 'नमुना प्रकाशन — डेमो मजकूर, वास्तविक बातमी किंवा प्रसिद्धिपत्रक नाही.' },
      { heading: '२९ ऑगस्ट २०२५ · विद्यार्थी मार्गदर्शन सत्र', text: 'काल्पनिक डेमो शीर्षक; कोणत्याही वृत्तमाध्यमाचा अहवाल नाही.' }
    ]
  },
  gallery: {
    title: 'फोटो गॅलरी',
    lead: 'खालील सर्व चित्रे सामान्य डेमो चित्रे आहेत. ती जितेंद्र बाळासाहेब बडेकर किंवा कोणत्याही वास्तविक व्यक्तीचे अथवा कार्यक्रमाचे छायाचित्र नाहीत.',
    images: [
      { src: '/assets/demo-community.svg', title: 'समुदाय संवाद', alt: 'समुदाय संवादाचे सामान्य डेमோ चित्र; वास्तविक व्यक्ती किंवा कार्यक्रम नाही.' },
      { src: '/assets/demo-education.svg', title: 'शैक्षणिक मार्गदर्शन', alt: 'शैक्षणिक मार्गदर्शनाचे सामान्य डेमो चित्र; वास्तविक संस्था किंवा कार्यक्रम नाही.' },
      { src: '/assets/demo-meeting.svg', title: 'बैठक व आढावा', alt: 'बैठक व आढाव्याचे सामान्य डेमो चित्र; वास्तविक बैठक नाही.' },
      { src: '/assets/demo-inclusion.svg', title: 'समावेशक सेवा', alt: 'समावेशक सेवांचे सामान्य डेमो चित्र; वास्तविक कार्यक्रम नाही.' }
    ]
  },
  reports: {
    title: 'अहवाल व दस्तऐवज',
    image: '/assets/demo-meeting.svg',
    lead: 'अहवाल विभागाचे कार्ड उदाहरण. खालील दस्तऐवज नावे आणि कालखंड काल्पनिक डेमो आहेत; डाउनलोड फाइल नाही.',
    blocks: [
      { heading: 'मासिक कार्यआढावा · ऑगस्ट २०२५', text: 'नमुना अहवाल कार्ड — वास्तविक विभागीय अहवाल नाही.' },
      { heading: 'नागरिक सूचना सारांश · डेमो', text: 'काल्पनिक दस्तऐवज नोंद; कोणतीही नागरिक माहिती समाविष्ट नाही.' }
    ]
  },
  contact: {
    title: 'जनसंपर्क',
    image: '/assets/demo-community.svg',
    lead: '{{nameMr}} यांच्या जनसंपर्क पृष्ठाचा नमुना. खालील संपर्क तपशील आरक्षित उदाहरण डोमेनचा वापर करतात; प्रत्यक्ष संपर्कासाठी नाहीत.',
    blocks: [
      { heading: 'ई-मेल · डेमो', text: 'contact@example.test — काल्पनिक नमुना; ई-मेल पाठवू नका.' },
      { heading: 'दूरध्वनी · डेमो', text: '+91 00000 00000 — काल्पनिक प्लेसहोल्डर; कार्यरत क्रमांक नाही.' },
      { heading: 'नागरिक सूचना', text: 'या डेमोमध्ये संदेश फॉर्म जोडलेला नाही. हे सरकारी तक्रार नोंदवण्याचे माध्यम नाही.' }
    ]
  },
  'privacy-policy': {
    title: 'गोपनीयता धोरण',
    lead: 'या संकेतस्थळावर उपलब्ध वैशिष्ट्यांनुसार माहितीचा वापर कसा होतो याचे संक्षिप्त वर्णन.',
    blocks: [
      { heading: 'सार्वजनिक पृष्ठे', text: 'सार्वजनिक पृष्ठे पाहण्यासाठी नागरिकांकडून वैयक्तिक माहिती मागितली जात नाही. संपर्क फॉर्म सध्या उपलब्ध नाही.' },
      { heading: 'प्रशासक प्रवेश', text: 'प्रशासक लॉगिनसाठी session cookie वापरली जाते. ती HttpOnly आणि SameSite गुणधर्मांसह सेट होते; उत्पादन वापरात HTTPS सक्षम असणे आवश्यक आहे.' },
      { heading: 'प्रोफाइल माहिती', text: 'प्रशासकाने जतन केलेले सार्वजनिक प्रोफाइल तपशील सर्व अभ्यागतांना दिसतात. खाजगी नागरिक माहिती येथे जतन करू नका.' }
    ]
  },
  accessibility: {
    title: 'सुलभता निवेदन',
    lead: 'सर्व अभ्यागतांना संकेतस्थळ सहज वापरता यावे यासाठी स्पष्ट मजकूर, कीबोर्ड नेव्हिगेशन आणि प्रतिसादक्षम मांडणी वापरली आहे.',
    blocks: [
      { heading: 'कीबोर्ड वापर', text: 'मुख्य दुवे, मेनू आणि प्रशासक फॉर्म कीबोर्डने वापरता येतात. फोकसची स्पष्ट खूण दिली आहे.' },
      { heading: 'मोबाइल व हालचाल', text: 'पृष्ठे लहान पडद्यांसाठी अनुकूल आहेत. कमी हालचालीची पसंती असल्यास संक्रमण कमी केले जाते.' },
      { heading: 'मदत व अभिप्राय', text: 'सुलभतेसंबंधी संपर्क तपशील उपलब्ध झाल्यावर येथे जोडले जातील.' }
    ]
  }
};

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

async function renderContentPage() {
  const host = document.getElementById('dynamic-content');
  const slug = document.body.dataset.pageSlug;
  const page = contentPages[slug];
  if (!host || !page) return;

  let profileName = window.PUBLIC_PROFILE?.fullNameMr || 'जितेंद्र बाळासाहेब बडेकर';
  if (!window.PUBLIC_PROFILE) {
    try {
      const response = await fetch(window.siteUrl ? window.siteUrl('/api/profile') : '/api/profile', { headers: { Accept: 'application/json' } });
      if (response.ok) profileName = (await response.json()).fullNameMr || profileName;
    } catch {}
  }

  appendTextElement(host, 'span', 'section-index', 'सार्वजनिक माहिती');
  appendTextElement(host, 'h2', 'content-page-title', page.title);
  appendTextElement(host, 'p', 'content-page-lead', page.lead.replaceAll('{{nameMr}}', profileName));
  if (page.image) {
    const figure = document.createElement('figure');
    figure.className = 'content-hero-media';
    const image = document.createElement('img');
    image.src = window.siteUrl ? window.siteUrl(page.image) : page.image;
    image.alt = 'काल्पनिक डेमो चित्र; वास्तविक व्यक्ती किंवा कार्यक्रमाचे छायाचित्र नाही.';
    image.loading = 'lazy';
    figure.append(image);
    const caption = document.createElement('figcaption');
    caption.textContent = 'डेमो चित्र · वास्तविक व्यक्ती किंवा कार्यक्रम नाही';
    figure.append(caption);
    host.append(figure);
  }
  if (page.images) {
    const gallery = document.createElement('div');
    gallery.className = 'content-gallery-grid';
    for (const item of page.images) {
      const figure = document.createElement('figure');
      figure.className = 'content-gallery-card';
      const image = document.createElement('img');
      image.src = window.siteUrl ? window.siteUrl(item.src) : item.src;
      image.alt = item.alt;
      image.loading = 'lazy';
      figure.append(image);
      const caption = document.createElement('figcaption');
      appendTextElement(caption, 'strong', '', item.title);
      appendTextElement(caption, 'small', '', 'डेमो चित्र · वास्तविक कार्यक्रम नाही');
      figure.append(caption);
      gallery.append(figure);
    }
    host.append(gallery);
  } else {
    const blocks = document.createElement('div');
    blocks.className = 'content-block-grid';
    for (const block of page.blocks) {
      const article = document.createElement('article');
      article.className = 'content-info-block';
      appendTextElement(article, 'h3', '', block.heading);
      appendTextElement(article, 'p', '', block.text.replaceAll('{{nameMr}}', profileName));
      blocks.append(article);
    }
    host.append(blocks);
  }
  document.querySelector('[data-page-breadcrumb]').textContent = page.title;
  document.title = `${profileName} | ${page.title}`;
}

renderContentPage();
