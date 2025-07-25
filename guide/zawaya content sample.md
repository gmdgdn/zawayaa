### **Structure Key for LLM Understanding**

* **\[PAGE: PAGE\_NAME\]**: Designates the beginning of a page's content.  
* **\[SECTION: SECTION\_NAME\]**: Denotes a specific content block within a page.  
* **\[CONTENT\_ITEM\]**: Wraps a single piece of content (article, podcast, etc.).  
  * The metadata block within each item (key: value) provides all necessary data for rendering components like cards, headers, and players.  
  * \[FULL\_TEXT\_AR\] contains the full article content for detail pages.  
  * \[EPISODE\_DETAILS\_AR\] contains the description for audio/video episodes.  
* 

---

### **\[PAGE: HOMEPAGE\]**

This page aggregates the latest and most important content from across the site.

## **\[SECTION: HERO\_FEATURED\_ARTICLE\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "sa-001",  
  "content\_type": "article",  
  "category\_ar": "تقدير موقف",  
  "title\_ar": "الخلافة الرقمية أم استئناف العقل؟ الذكاء الاصطناعي على مفترق طرق الحضارة العربية",  
  "author": "د. أمين رشدي",  
  "published\_date": "2025-07-25",  
  "image\_url": "/images/hero/ai\_crossroads\_hero.png",  
  "summary\_ar": "يقف العالم العربي اليوم أمام الذكاء الاصطناعي كما وقفت بغداد يومًا أمام حكمة الإغريق والفرس. فهل سيكون هذا الطوفان التكنولوجي أداة لفرض 'خلافة رقمية' من السيطرة والمراقبة، أم فرصة تاريخية لاستئناف مشروع العقل النقدي وبناء 'بيت حكمة' جديد؟",  
  "audio\_url": "/audio/sa-001.mp3"  
}  
   

**\[/CONTENT\_ITEM\]**

## **\[SECTION: LATEST\_PODCASTS\_AND\_PROGRAMS\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "ns-002",  
  "content\_type": "podcast\_episode\_video",  
  "program\_ar": "شمال جنوب",  
  "title\_ar": "إفريقيا: كيف أصبحت ساحة التنافس الجديدة للقوى الإقليمية؟",  
  "guest\_ar": "د. فاطمة عبد السلام",  
  "host\_ar": "خالد المصري",  
  "published\_date": "2025-07-24",  
  "image\_url": "/images/podcasts/north\_south\_ep2.png",  
  "summary\_ar": "تحليل معمّق لكيفية تحول إفريقيا من قارة على الهامش إلى مركز التنافس الجيوسياسي بين قوى الشرق الأوسط، الصين، وأوروبا. حوار حول الاستثمار في البنية التحتية، الأمن، والتأثير الثقافي.",  
  "video\_url": "/video/podcasts/ns-002.mp4",  
  "audio\_url": "/audio/podcasts/ns-002.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[/CONTENT\_ITEM\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "hm-001",  
  "content\_type": "podcast\_episode\_audio",  
  "program\_ar": "حدث ومعنى",  
  "title\_ar": "أزمة السويس 1956: الحدث الذي أنهى إمبراطورية ورسم خريطة الشرق الأوسط الحديث",  
  "published\_date": "2025-07-22",  
  "image\_url": "/images/podcasts/event\_meaning\_ep1.png",  
  "summary\_ar": "نستعرض وقائع العدوان الثلاثي كما وردت في الأرشيفات، ثم نحلل كيف كانت هذه الأزمة نقطة تحول أنهت النفوذ البريطاني-الفرنسي، ورسخت صعود عبد الناصر وبداية الحرب الباردة في المنطقة.",  
  "audio\_url": "/audio/podcasts/hm-001.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[/CONTENT\_ITEM\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "tr-001",  
  "content\_type": "video\_program\_episode",  
  "program\_ar": "ترانزستور",  
  "title\_ar": "ليس مجرد كود: كيف يعيد الذكاء الاصطناعي تعريف الحرب السيبرانية؟",  
  "presenter\_ar": "علي شهاب",  
  "published\_date": "2025-07-21",  
  "image\_url": "/images/programs/transistor\_ep1.png",  
  "summary\_ar": "شرح مبسط لكيفية استخدام الذكاء الاصطناعي في تطوير هجمات سيبرانية متقدمة، ونشر حملات تضليل معقدة، وكيف يمكن للدول والمجتمعات بناء دفاعات رقمية في مواجهة هذا التهديد الجديد.",  
  "video\_url": "/video/programs/tr-001.mp4"  
}\`\`\`  
\*\*\[/CONTENT\_ITEM\]\*\*

\*\*\[SECTION: OPINIONS\_AND\_ASSESSMENTS\_GRID\]\*\*  
\---  
\*\*\[CONTENT\_ITEM\]\*\*  
\`\`\`json  
{  
  "id": "po-001",  
  "content\_type": "article",  
  "category\_ar": "آراء سياسية",  
  "title\_ar": "ما بعد الريع: هل تكفي المشاريع العملاقة لبناء عقد اجتماعي جديد؟",  
  "author": "سارة بلقاسمي",  
  "published\_date": "2025-07-24",  
  "image\_url": "/images/articles/post\_rentier.png",  
  "summary\_ar": "من 'نيوم' إلى 'العاصمة الإدارية'، تتسابق دول المنطقة في بناء مستقبل ما بعد النفط. لكن التحول الحقيقي ليس في الحجر، بل في البشر. مقال يحلل تحديات الانتقال من دولة الرفاه الريعي إلى دولة الإنتاجية والمواطنة.",  
  "audio\_url": "/audio/po-001.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[/CONTENT\_ITEM\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "sa-002",  
  "content\_type": "article",  
  "category\_ar": "تقدير موقف",  
  "title\_ar": "جيوبوليتيك المياه: حروب الغد الصامتة على ضفاف النيل والفرات",  
  "author": "د. أيمن الصباغ",  
  "published\_date": "2025-07-23",  
  "image\_url": "/images/articles/water\_geopolitics.png",  
  "summary\_ar": "في منطقة يحددها الجفاف، لم يعد الصراع على المياه مجرد قضية بيئية، بل أصبح محورًا للسياسة الخارجية والأمن القومي. تحليل استراتيجي لمستقبل العلاقات بين دول المنبع والمصب.",  
  "audio\_url": "/audio/sa-002.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[/CONTENT\_ITEM\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "po-002",  
  "content\_type": "article",  
  "category\_ar": "آراء سياسية",  
  "title\_ar": "دبلوماسية المتاحف والملاعب: كيف تصنع 'القوة الناعمة' واقعًا سياسيًا جديدًا؟",  
  "author": "نور حداد",  
  "published\_date": "2025-07-22",  
  "image\_url": "/images/articles/soft\_power.png",  
  "summary\_ar": "لم تعد السياسة حكرًا على السفارات ووزارات الخارجية. استضافة الفعاليات الرياضية العالمية وبناء المتاحف الكبرى أصبحا أدوات فعالة لإعادة رسم الصورة النمطية وتمرير رسائل سياسية لا يمكن قولها في المحافل الرسمية.",  
  "audio\_url": "/audio/po-002.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[/CONTENT\_ITEM\]**

## **\[SECTION: DIVERSE\_ARTICLES\_GRID\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "art-001",  
  "content\_type": "article",  
  "category\_ar": "مقالات",  
  "subcategory\_ar": "فن",  
  "title\_ar": "ذاكرة على تذكرة سفر: جدل استعادة آثار الشرق من متاحف الغرب",  
  "author": "د. ريم الخوري",  
  "published\_date": "2025-07-20",  
  "image\_url": "/images/articles/restitution.png",  
  "summary\_ar": "من حجر رشيد إلى منحوتات تدمر، تستضيف متاحف الغرب ذاكرة الشرق. هل هذه حماية للتراث الإنساني أم استمرار لسطوة استعمارية؟ مقال يغوص في الأبعاد القانونية والأخلاقية والثقافية لأكبر جدل فني في عصرنا.",  
  "audio\_url": "/audio/art-001.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[/CONTENT\_ITEM\]**

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "hist-001",  
  "content\_type": "article",  
  "category\_ar": "مقالات",  
  "subcategory\_ar": "تاريخ",  
  "title\_ar": "ما وراء السيف والصليب: قراءة في التجارة والأفكار المنسية زمن الحروب الصليبية",  
  "author": "حسن الإدريسي",  
  "published\_date": "2025-07-19",  
  "image\_url": "/images/articles/crusades\_trade.png",  
  "summary\_ar": "بعيدًا عن سردية الصراع الحضاري، يكشف هذا المقال عن شبكات التجارة والتبادل المعرفي التي ازدهرت بين الشرق والغرب في خضم الحروب الصليبية، وكيف شكلت هذه التفاعلات المنسية جزءًا من تاريخ المنطقتين.",  
  "audio\_url": "/audio/hist-001.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[/CONTENT\_ITEM\]**

---

### **\[PAGE: ARTICLE\_DETAIL\_PAGE\]**

This is a template page. The content below is the full text for sa-002.

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "sa-002",  
  "content\_type": "article",  
  "category\_ar": "تقدير موقف",  
  "title\_ar": "جيوبوليتيك المياه: حروب الغد الصامتة على ضفاف النيل والفرات",  
  "author": "د. أيمن الصباغ",  
  "published\_date": "2025-07-23",  
  "image\_url": "/images/articles/water\_geopolitics.png",  
  "tags\_ar": \["جيوبوليتيك", "الأمن المائي", "تركيا", "مصر", "إثيوبيا", "العراق"\],  
  "audio\_url": "/audio/sa-002.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[FULL\_TEXT\_AR\]**

**مقدمة: الذهب الأزرق**  
في القرن العشرين، دارت صراعات الشرق الأوسط حول "الذهب الأسود". لكن في القرن الحادي والعشرين، وفي ظل التغير المناخي والنمو السكاني المتسارع، ينتقل مركز الثقل الاستراتيجي بصمت نحو "الذهب الأزرق": المياه. لم يعد الأمن المائي قضية بيئية أو تنموية فحسب، بل تحول إلى حجر زاوية في الأمن القومي، وعامل حاسم في رسم خرائط التحالفات والعداوات المستقبلية.

**مسرح الصراع الأول: حوض النيل**  
يُعد سد النهضة الإثيوبي التجسيد الأوضح لهذا التحول. فمن منظور إثيوبيا، هو مشروع تنموي سيادي ضروري لانتشال الملايين من الفقر. ومن منظور مصر والسودان (دول المصب)، هو تهديد وجودي يمس شريان الحياة الذي قامت عليه حضارتهما لآلاف السنين. الصراع هنا يتجاوز مجرد أمتار مكعبة من المياه؛ إنه صراع على حق التنمية مقابل حق البقاء، وهو يعيد تعريف موازين القوى في القرن الإفريقي وحوض النيل. إن فشل الدبلوماسية في التوصل لاتفاق ملزم قد لا يؤدي إلى حرب تقليدية بالضرورة، بل إلى "حرب باردة" طويلة الأمد من الضغوط السياسية والاقتصادية والحروب بالوكالة.

**مسرح الصراع الثاني: نهرا دجلة والفرات**  
في حوض دجلة والفرات، الوضع لا يقل تعقيدًا. تتحكم تركيا، دولة المنبع، في منابع النهرين عبر سلسلة من السدود العملاقة ضمن مشروع جنوب شرق الأناضول (GAP). هذا يمنحها ورقة ضغط هائلة على سوريا والعراق، دولتي المصب، اللتين تعانيان بالفعل من الجفاف والتصحر. يؤثر التحكم في تدفق المياه بشكل مباشر على الزراعة في العراق، ويفاقم من التوترات الاجتماعية والسياسية الداخلية، ويمنح تركيا أداة جيوسياسية فعالة يمكن استخدامها في مفاوضاتها حول قضايا أخرى، مثل محاربة حزب العمال الكردستاني.

**خاتمة: نحو دبلوماسية المياه**  
إن إدارة هذه الصراعات المائية لا يمكن أن تتم بعقلية "المباراة الصفرية" التي سادت في القرن العشرين. الحلول المستدامة تكمن في الانتقال من منطق تقاسم الموارد إلى منطق تقاسم المنافع. يتطلب ذلك دبلوماسية معقدة ترتكز على الاستثمارات المشتركة في تكنولوجيا تحلية المياه، وتطوير الزراعة الذكية، وإنشاء شبكات كهرباء إقليمية تربط مشاريع السدود بمصالح دول المصب. قبل أن تتحول حروب الغد الصامتة إلى مواجهات صاخبة، يجب أن يصبح الحوار حول "الذهب الأزرق" أولوية استراتيجية قصوى.

**\[/FULL\_TEXT\_AR\]**  
**\[/CONTENT\_ITEM\]**

---

### **\[PAGE: PODCAST\_DETAIL\_PAGE\]**

This is a template page for the "شمال جنوب" podcast, showing its list of episodes.

**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "prog-ns-01",  
  "content\_type": "podcast\_program",  
  "program\_ar": "شمال جنوب",  
  "description\_ar": "مساحة حوارية شهرية تستضيف شخصيات بحثية وسياسية من مختلف أنحاء العالم، لقراءة السياسات الخارجية للدول الكبرى والإقليمية، وتحليل تأثيراتها المتبادلة بين شمال العالم وجنوبه. يناقش البودكاست التحولات الجيوسياسية والاقتصادية والفكرية في النظام الدولي، ويربطها بما يجري في العالم العربي ومحيطه الشرقي.",  
  "cover\_image\_url": "/images/podcasts/north\_south\_cover.png"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

## **\[SECTION: EPISODE\_LIST\]**

**(Episode 2\)**  
**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "ns-002",  
  "content\_type": "podcast\_episode\_video",  
  "title\_ar": "إفريقيا: كيف أصبحت ساحة التنافس الجديدة للقوى الإقليمية؟",  
  "published\_date": "2025-07-24",  
  "duration": "45:15",  
  "video\_url": "/video/podcasts/ns-002.mp4",  
  "audio\_url": "/audio/podcasts/ns-002.mp3"  
}  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END

**\[EPISODE\_DETAILS\_AR\]**  
ضيف الحلقة: د. فاطمة عبد السلام، خبيرة في العلاقات الإفريقية-الشرق أوسطية.  
نتناول في هذا الحوار كيف تحولت إفريقيا من قارة على الهامش إلى مركز التنافس الجيوسياسي. نناقش الاستثمارات الخليجية والتركية في الموانئ والمناطق الحرة، ودور المساعدات التنموية في كسب النفوذ، والمنافسة الأمنية في منطقة الساحل والصحراء، وكيف يتقاطع كل ذلك مع مبادرة الحزام والطريق الصينية والمصالح الأوروبية التقليدية.  
**\[/EPISODE\_DETAILS\_AR\]**  
**\[/CONTENT\_ITEM\]**

**(Episode 1\)**  
**\[CONTENT\_ITEM\]**

Generated json  
     {  
  "id": "ns-001",  
  "content\_type": "podcast\_episode\_video",  
  "title\_ar": "إعادة التموضع في عالم متعدد الأقطاب \- الخليج بين بكين وواشنطن",  
  "published\_date": "2025-06-22",  
  "duration": "52:30",  
  "video\_url": "/video/podcasts/ns-001.mp4",  
  "audio\_url": "/audio/podcasts/ns-001.mp3"  
}\`\`\`  
\*\*\[EPISODE\_DETAILS\_AR\]\*\*  
ضيف الحلقة: Dr. Alistair Finch, Chatham House.  
حوار معمق حول مفهوم "الاستقلالية الاستراتيجية" الذي تتبناه القوى الإقليمية في الشرق الأوسط. كيف توازن دول الخليج علاقاتها بين شريك أمني تاريخي (واشنطن) وعملاق اقتصادي صاعد (بكين)؟ وماذا يعني هذا التحول لمستقبل أمن الطاقة، والتحالفات العسكرية، والنظام العالمي؟  
\*\*\[/EPISODE\_DETAILS\_AR\]\*\*  
\*\*\[/CONTENT\_ITEM\]\*\*  
     
IGNORE\_WHEN\_COPYING\_START  
content\_copy download  
Use code [with caution](https://support.google.com/legal/answer/13505487). Json  
IGNORE\_WHEN\_COPYING\_END  
