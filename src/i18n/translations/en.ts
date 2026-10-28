import type { Translation } from './az'

/** English interface text. The shape is checked against az.ts. */
export const en = {
  meta: {
    home: {
      title: 'NOIA — Handmade crochet',
      description:
        'NOIA makes handmade crochet in Azerbaijan: bags, hats, home textiles and soft toys. Every piece is worked by hand in small batches.',
    },
    shop: {
      title: 'Collection — NOIA handmade crochet',
      description:
        'The NOIA collection: hand-crocheted bags, hats, home textiles and gifts. Filter by category or search the catalogue.',
    },
    about: {
      title: 'About NOIA — handmade crochet',
      description:
        'NOIA is a small handmade crochet brand. How a piece is made, from choosing the yarn to the final stitch.',
    },
    customOrder: {
      title: 'Custom orders — NOIA',
      description:
        'Choose the size, colour and details. Send a custom crochet enquiry through WhatsApp or e-mail.',
    },
    contact: {
      title: 'Contact — NOIA',
      description: 'Get in touch with NOIA: Instagram, WhatsApp and e-mail.',
    },
    notFound: {
      title: 'Page not found — NOIA',
      description: 'The page you are looking for does not exist.',
    },
  },

  nav: {
    home: 'Home',
    shop: 'Collection',
    about: 'About',
    customOrder: 'Custom orders',
    contact: 'Contact',
  },

  common: {
    brandTagline: 'handmade crochet',
    mainNavigation: 'Main navigation',
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    switchLanguage: 'Change language',
    loading: 'Loading…',
    viewAll: 'View all',
    exploreCollection: 'Explore the collection',
    customOrder: 'Custom order',
    backToShop: 'Back to the collection',
    priceOnRequest: 'Price on request',
    copy: 'Copy',
    copied: 'Copied',
    copyError: 'Could not copy automatically. Please select the text manually.',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    notConfigured: 'Not configured yet',
    exampleBadge: 'Example',
    viewProduct: 'View {name}',
    close: 'Close',
  },

  demo: {
    text: 'Demo build: products, prices and contact details are placeholders, not real business information.',
  },

  footer: {
    about:
      'Handmade crochet in small batches: carefully chosen yarn, patient work and made-to-measure pieces.',
    siteTitle: 'Site',
    contactTitle: 'Contact',
    followTitle: 'Elsewhere',
    rights: '© {year} NOIA. All rights reserved.',
    madeIn: 'Handmade in Azerbaijan',
    imageNotice: 'Images on this site are illustrative placeholders.',
  },

  home: {
    eyebrow: 'Handmade crochet · Azerbaijan',
    titleLine: 'From simple yarn,',
    titleAccent: 'with patient hands.',
    intro:
      'NOIA makes crochet in small batches: bags, hats, home textiles and soft toys. Every piece is worked by hand, so no two are exactly alike.',
    primaryCta: 'Explore the collection',
    secondaryCta: 'Request a custom piece',
    fact1: 'Made by hand',
    fact2: 'Small batches',
    fact3: 'Made to measure',
    heroImageAlt: 'Illustrative crochet composition made for NOIA',
    heroNote: 'Illustrative artwork',
    featuredEyebrow: 'Selected pieces',
    featuredTitle: 'A few pieces from the collection',
    featuredIntro: 'Ready to order or made to measure. Prices are examples.',
    featuredCta: 'See the full collection',
    processEyebrow: 'Process',
    processTitle: 'The making of a piece',
    processIntro:
      'Crochet is not quick work. Every item passes through a few stages, and that is where its character comes from.',
    step1Title: 'Yarn and colour',
    step1Text:
      'First we settle the yarn, colour and size. For custom pieces, we choose these together.',
    step2Title: 'Working the stitches',
    step2Text:
      'The piece grows stitch by stitch, by hand. Even two versions of the same design will not be identical.',
    step3Title: 'Finishing',
    step3Text:
      'Yarn ends are woven in, the shape is set, and the piece is packed with its washing instructions.',
    customEyebrow: 'Custom orders',
    customTitle: 'Let’s work on the piece you have in mind.',
    customText:
      'Size, colour and details are your choice. Tell us what you are looking for; we will sort out the rest in conversation.',
    customCta: 'Send an enquiry',
    customNote:
      'Payment is not handled on this site. Terms are agreed in advance in the conversation.',
    instagramEyebrow: 'Instagram',
    instagramTitle: 'The process and new pieces',
    instagramText: 'New designs and process shots are shared on Instagram first.',
    instagramCta: 'Follow on Instagram',
    instagramUnconfigured: 'The Instagram account will be added soon.',
  },

  shop: {
    eyebrow: 'Collection',
    title: 'Pieces made by hand',
    intro:
      'The catalogue currently shows example products. Each design can be made to order in your colour and size.',
    searchLabel: 'Search products',
    searchPlaceholder: 'Search by name or description…',
    clearSearch: 'Clear search',
    filterLabel: 'Category',
    all: 'All',
    resultsLabel: 'Results: {count}',
    emptyTitle: 'Nothing found',
    emptyText: 'Try a different search term or reset the filter.',
    resetFilters: 'Reset filters',
    emptyCatalogTitle: 'The collection is being prepared',
    emptyCatalogText: 'New pieces will be added soon.',
    exampleNote: 'All products, prices and availability shown are examples.',
  },

  product: {
    back: 'Back to the collection',
    priceLabel: 'Price',
    optionsLabel: 'Options',
    aboutTitle: 'About this piece',
    handmadeTitle: 'About handmade pieces',
    handmadeText:
      'This piece is crocheted by hand. Small differences in size and colour are possible — that is the mark of real handwork.',
    materialsLabel: 'Material',
    careLabel: 'Care',
    orderTitle: 'Orders and questions',
    orderText:
      'Choose your options and send the message. Payment is not taken on this site; terms are agreed in the conversation.',
    inquiryWhatsApp: 'Order via WhatsApp',
    inquiryEmail: 'Write an e-mail',
    copyInquiry: 'Copy enquiry',
    customise: 'Customise this design',
    soldOutNote:
      'This piece is currently sold. A similar one can be made to order in your preferred colour.',
    galleryLabel: 'Product images',
    notFoundTitle: 'Product not found',
    notFoundText: 'This piece may have been removed from the collection.',
    relatedTitle: 'You may also like',
    noChannels:
      'No contact channel is configured yet. You can copy the enquiry and send it wherever you like.',
  },

  about: {
    eyebrow: 'About',
    title: 'A small workshop, close attention.',
    lead: 'NOIA is a small crochet brand. The work rests on a simple idea: few pieces, made with care.',
    body1:
      'Every item begins with the yarn. Once colour, texture and purpose are settled, the work starts; some pieces take a few days, others weeks.',
    body2:
      'We do not produce in bulk. That is why two versions of the same design can differ slightly — a sign that the piece was made by hand.',
    valuesTitle: 'What we pay attention to',
    value1Title: 'Material',
    value1Text: 'Yarn is chosen for its purpose: soft, durable and easy to care for.',
    value2Title: 'Details',
    value2Text: 'Edges, fastenings and ends are finished carefully so the piece keeps its shape.',
    value3Title: 'Clarity',
    value3Text: 'Price and making time are agreed up front. No surprise conditions.',
    quote: 'Handwork is not about perfection — it is a process that leaves a trace.',
    imageAlt: 'Illustrative composition with yarn balls and a crochet hook',
    placeholderNote:
      'The text on this page is a placeholder. Replace it with your own story and working principles.',
    ctaTitle: 'Let’s make something together',
    ctaText: 'Share your idea — we will choose the size, colour and material together.',
    cta: 'Go to custom orders',
  },

  customOrder: {
    eyebrow: 'Custom orders',
    title: 'Let’s plan the piece you want',
    intro:
      'Fill in the form and your message will open, ready to send, in WhatsApp or your e-mail app. This site does not store your details on a server.',
    stepsTitle: 'How it works',
    step1Title: 'Enquiry',
    step1Text: 'Fill in the form and send the message.',
    step2Title: 'Details',
    step2Text: 'We agree on size, yarn, colour and timing in the conversation.',
    step3Title: 'Making',
    step3Text: 'Once we agree, the work begins and the finished piece is sent to you.',
    formTitle: 'Enquiry form',
    formNote: 'Fields marked * are required.',
    name: 'Name',
    namePlaceholder: 'Your name',
    contactMethod: 'Preferred contact',
    methodWhatsApp: 'WhatsApp',
    methodEmail: 'E-mail',
    whatsappNumber: 'WhatsApp number',
    whatsappPlaceholder: '+994 50 000 00 00',
    emailAddress: 'E-mail address',
    emailPlaceholder: 'you@example.com',
    productType: 'Type of piece',
    productTypePlaceholder: 'Choose a type',
    productTypes: {
      bag: 'Bag',
      hat: 'Hat',
      scarf: 'Scarf',
      homeTextile: 'Home textile',
      toy: 'Toy / amigurumi',
      accessory: 'Accessory',
      other: 'Other',
    },
    colors: 'Preferred colours',
    colorsPlaceholder: 'For example: cream, soft blush',
    description: 'Description',
    descriptionHint: 'Mention size, intended use and anything important.',
    descriptionPlaceholder: 'Tell us what you would like made…',
    deadline: 'Deadline (optional)',
    deadlineHint: 'Leave empty if you do not have a fixed date.',
    referenceNote:
      'If you want to send a reference photo, add it in the chat after the message opens. The form does not accept files.',
    submit: 'Prepare enquiry',
    copyInstead: 'Copy the enquiry',
    previewTitle: 'Message preview',
    sentTitle: 'Your message is ready',
    sentWhatsApp: 'WhatsApp opened in a new window. Confirm the message there to send it.',
    sentEmail: 'Your e-mail app opened. Confirm the message there to send it.',
    sentCopy: 'The enquiry was copied. You can send it through any channel you prefer.',
    preparedHint: 'Choose a channel to send the message.',
    sendWhatsApp: 'Send via WhatsApp',
    sendEmail: 'Send via e-mail',
    noChannels:
      'No contact channel is configured on this site yet. You can copy the enquiry and send it directly.',
    formErrors: 'Please check the highlighted fields.',
    prefillNotice: 'The form has been pre-filled for the {product} design.',
    productPrefill: 'I would like to customise the {product} design.',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Write to us',
    intro: 'Send questions about orders, sizes or materials directly.',
    whatsappText: 'The most direct channel for short questions and orders.',
    emailText: 'For detailed enquiries and reference photos.',
    instagramText: 'New work, process shots and examples.',
    responseNote: 'Response time depends on workload. For urgent orders, write in advance.',
    unconfigured: 'This channel is not configured yet.',
    formTitle: 'Custom order form',
    formText: 'Use the form to describe sizes and colours in advance.',
    formCta: 'Open the form',
    directTitle: 'Direct contact',
  },

  notFound: {
    title: 'This page was not found',
    text: 'The link may be out of date, or the address may be mistyped.',
    cta: 'Back to home',
    secondary: 'Browse the collection',
  },

  availability: {
    inStock: 'Ready',
    madeToOrder: 'Made to order',
    soldOut: 'Sold',
  },

  categories: {
    accessories: 'Accessories',
    home: 'Home',
    gifts: 'Gifts',
  },

  inquiry: {
    greeting: 'Hello, NOIA!',
    customIntro: 'A custom order enquiry:',
    name: 'Name',
    contact: 'Contact',
    productType: 'Type of piece',
    colors: 'Colours',
    description: 'Description',
    deadline: 'Deadline',
    productIntro: 'I am interested in this piece:',
    option: 'Option',
    price: 'Price',
    link: 'Link',
    emailSubjectCustom: 'Custom order enquiry — NOIA',
    emailSubjectProduct: 'Product enquiry: {product}',
  },

  validation: {
    required: 'Please fill in this field.',
    tooShort: 'Please enter at least {min} characters.',
    tooLong: 'Please use no more than {max} characters.',
    invalidEmail: 'Enter a valid e-mail address.',
    invalidPhone: 'Include the country code, for example +994 50 123 45 67.',
    invalidDate: 'The date cannot be in the past.',
    invalidProduct: 'Choose a type of piece.',
  },
} satisfies Translation
