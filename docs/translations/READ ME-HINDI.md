# ज़ीबे मॉडलर

[![Build Status](https://travis-ci.com/zeebe-io/zeebe-modeler.svg?branch=develop)](https://travis-ci.com/zeebe-io/zeebe-modeler)

[Been.io] (http://bpmn.io) पर आधारित [Zeebe] (https://zeebe.io/) के लिए विज़ुअल वर्कफ़्लो संपादक।

![Zeebe Modeler](docs/screenshot.png)


## स्थापना

#### सभी प्लेटफार्मों

[डाउनलोड] (https://github.com/zeebe-io/zeebe-modeler/releases), एप्लिकेशन निकालें और निष्पादित करें।

#### मैक ओएस एक्स

[Homebrew] (https://brew.sh/index_de.html) और [पीपा] (https://caskroom.github.io) की आवश्यकता है:

```sh
brew cask install zeebe-modeler
```

#### विंडोज (स्कूप का उपयोग करके)

[स्कूप] (https://github.com/lukesampson/scoop) और [स्कूप-एक्सट्रैस] (https://github.com/lukesampson/scoop-extras) बाल्टी की आवश्यकता है:

```
scoop install zeebe-modeler
```

## साधन

* [बदलाव का](./CHANGELOG.md)
* [डाउनलोड] (https://github.com/zeebe-io/zeebe-modeler/releases) (यह भी देखें [रात का निर्माण] .com /))
* (प्रतिक्रिया दें] (https://forum.zeebe.io/)
* [एक बग की रिपोर्ट] (https://github.com/zeebe-io/zeebe-modeler/issues/new/choose)


## अनुप्रयोग का निर्माण

```sh
# checkout a tag
git checkout v1.1.0

# निर्भरता स्थापित करें
npm install

# सभी जांच निष्पादित करें (लिंट, परीक्षण और निर्माण)
npm run all

# ./dist पर एप्लिकेशन बनाएं
npm run build
```


### विकास सेटअप

विकास के लिए आवेदन स्पिन करें, सभी तार जुड़े हुए हैं:

```sh
npm run dev
```


## आचार संहिता


यह परियोजना योगदानकर्ता वाचा [संहिता] का पालन करती है
आचार] (/ CODE_OF_CONDUCT.md)। भाग लेने से, आपको बनाए रखने की उम्मीद है
यह कोड। कृपया अस्वीकार्य व्यवहार की रिपोर्ट करें
code-of-conduct@zeebe.io

## लाइसेंस

एमआईटी

इसमें [bpmn.io लाइसेंस] (http://bpmn.io/license) के तहत जारी किए गए भाग ([bpmn-js] (https://github.com/bpmn-io/bpmn-js) शामिल हैं।
