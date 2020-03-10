(function() {
  let inputArea = document.getElementById("text-area");
  let text = `This copywriting app highlights lengthy, complex sentences; if you see a yellow sentence, shorten or split it. If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic - try editing this sentence to remove the red.
Generally, you can utilize a shorter word in place of a purple one. Mouse over purple words for hints.
Adverbs and weakening phrases are helpfully shown in blue. Get rid of them and pick words with force, perhaps.
Phrases in green have been marked to show the passive voice.
Paste in something you're working on and edit away.`;

  inputArea.value = text;

  let data = {
    paragraphs: 0,
    sentences: 0,
    words: 0,
    hardSentences: 0,
    veryHardSentences: 0,
    adverbs: 0,
    passiveVoice: 0,
    complex: 0,
    you: 0,
    we: 0,
    exclaim: 0
  };

  function format() {
    data = {
      paragraphs: 0,
      sentences: 0,
      words: 0,
      hardSentences: 0,
      veryHardSentences: 0,
      adverbs: 0,
      passiveVoice: 0,
      complex: 0,
      you: 0,
      we: 0,
      exclaim: 0
    };
    ("use strict");
    let inputArea = document.getElementById("text-area");
    let text = inputArea.value;
    let paragraphs = text.split("\n");
    let outputArea = document.getElementById("output");
    let hardSentences = paragraphs.map(p => getDifficultSentences(p));
    let inP = hardSentences.map(para => `<p>${para}</p>`);
    data.paragraphs = paragraphs.length;
    console.log(data);
    counters();
    outputArea.innerHTML = inP.join(" ");
  }
  window.format = format;
  format();
  
  function pluralize(word, number) {
    return (number == 1) ? word : word + "s";
  }

  function getAdverbText() {
    if (data.adverbs == 0) {
      return `You've used no adverbs, which is superb. Nice work`;
    } else if (data.adverbs <= Math.round(data.paragraphs / 3)) {
      return `You've used ${
        data.adverbs
      } ${pluralize("adverb", data.adverbs)}, which is about right for this length of text.`;
    } else {
      return `You've used ${
        data.adverbs  
      } ${pluralize("adverb", data.adverbs)}. Try to use ${Math.round(  
        data.paragraphs / 3 
      )} or fewer in text of this length`;
    };
  }

  function getPassiveText() {
    if (data.passiveVoice == 0) {
      return "You've used no passive voice phrases, which is excellent. Nice work.";
    } else if (data.passiveVoice <= Math.round(data.sentences / 5)) {
      return `You've used passive voice ${data.passiveVoice} ${pluralize("time", data.passiveVoice)},
        which is about right for this length of text.`;
    } else {
      return `You've used passive voice ${
        data.passiveVoice
      } ${pluralize("time", data.passiveVoice)}. Try to use ${Math.round(data.sentences / 5)}
        or fewer in text of this length.`
    };
  }

  function getComplexText() {
    return `${data.complex} ${pluralize("phrase", data.complex)} could be simplified`;
  }

  function getHardSentenceText() {
    return `${
      data.hardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } hard to read`;
  }

  function getVeryHardSentenceText() {
    return `${
      data.veryHardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } very hard to read`;
  }

  function getYouText() {
    let preamble = `Words like you and your reference the donor, and add power.
      Try to have as many as possible, and more than you have words like I, we, etc.`
    return preamble + `You have used ${
      data.you
    } instances of you words. Try to use ${Math.round(
      data.sentences / 2
    )} or more`;
  }

  function getWeText() {
    let preamble = `Words like I and we reference your organisation, and make you
      seem introverted. Talk instead about the impact of the donor's gift, and what
      they are creating at your organisation.`
    return preamble + `You have used ${
      data.we
    } instances of I and we words. Try to use ${Math.round(
      data.sentences / 5
    )} or fewer`;
  }

  function getExclaimText() {
    if (data.exclaim > 1) {
      return `You have used ${
        data.exclaim
      } exclamation marks. You should be ashamed of yourself. Exclamation marks suck.`;
    } else if (data.exclaim == 1) {
      return "You only have 1 exclamation mark, which isn't bad. Still, can you try removing it?";
    } else {
      return "Well done, your words speak for themselves and you've used none of those dreadful exclamation marks.";
    }
  }

  function calculateScore() {
    return Math.max(0, (100 - data.veryHardSentences * 10 -
      data.hardSentences * 5 -
      data.adverbs * 3 -
      data.passiveVoice * 3 -
      data.complex * 3 -
      data.exclaim * 5 -
      (data.we >= data.you ? 25 : 0)));
  }

  function getScoreText() {
    let score = calculateScore();
    if (score <= 50) {
      return `You have scored ${score}/100. Keep working on it.`;
    } else if (score <= 75) {
      return `You have scored ${score}/100. Nearly there.`;
    } else if (score < 90) {
      return `You have scored ${score}/100. Pretty good. Can you make it to 90?`;
    } else {
      return `You have scored ${score}/100. Go raise your money now.`
    }
  }

  function counters() {
    document.querySelector("#adverb").innerHTML = getAdverbText();
    document.querySelector("#passive").innerHTML = getPassiveText();
    document.querySelector("#complex").innerHTML = getComplexText();
    document.querySelector("#hardSentence").innerHTML = getHardSentenceText();
    document.querySelector("#veryHardSentence").innerHTML = getVeryHardSentenceText();
    document.querySelector("#you").innerHTML = getYouText();
    document.querySelector("#we").innerHTML = getWeText();
    document.querySelector("#exclaim").innerHTML = getExclaimText();
    document.querySelector("#score").innerHTML = getScoreText();
  }

  function getDifficultSentences(p) {
    let sentences = getSentenceFromParagraph(p + " ");
    data.sentences += sentences.length;
    let hardOrNot = sentences.map(sent => {
      let cleanSentence = sent.replace(/[^a-z0-9. ]/gi, "") + ".";
      let words = cleanSentence.split(" ").length;
      let letters = cleanSentence.split(" ").join("").length;
      data.words += words;
      sent = getAdverbs(sent);
      sent = getComplex(sent);
      sent = getPassive(sent);
      sent = getQualifier(sent);
      sent = getYou(sent);
      sent = getWe(sent);
      sent = getExclaim(sent);
      let level = calculateLevel(letters, words, 1);
      if (words < 14) {
        return sent;
      } else if (level >= 10 && level < 14) {
        data.hardSentences += 1;
        return `<span class="hardSentence">${sent}</span>`;
      } else if (level >= 14) {
        data.veryHardSentences += 1;
        return `<span class="veryHardSentence">${sent}</span>`;
      } else {
        return sent;
      }
    });

    return hardOrNot.join(" ");
  }

  function getPassive(sent) {
    let originalWords = sent.split(" ");
    let words = sent
      .replace(/[^a-z0-9. ]/gi, "")
      .toLowerCase()
      .split(" ");
    let ed = words.filter(word => word.match(/ed$/));
    if (ed.length > 0) {
      ed.forEach(match => {
        originalWords = checkPrewords(words, originalWords, match);
      });
    }
    return originalWords.join(" ");
  }

  function checkPrewords(words, originalWords, match) {
    let preWords = ["is", "are", "was", "were", "be", "been", "being"];
    let index = words.indexOf(match);
    if (preWords.indexOf(words[index - 1]) >= 0) {
      data.passiveVoice += 1;
      originalWords[index - 1] =
        '<span class="passive">' + originalWords[index - 1];
      originalWords[index] = originalWords[index] + "</span>";
      let next = checkPrewords(
        words.slice(index + 1),
        originalWords.slice(index + 1),
        match
      );
      return [...originalWords.slice(0, index + 1), ...next];
    } else {
      return originalWords;
    }
  }

  function getSentenceFromParagraph(p) {
    let sentences = p
      .split(". ")
      .filter(s => s.length > 0)
      .map(s => s + ".");
    return sentences;
  }

  function calculateLevel(letters, words, sentences) {
    if (words === 0 || sentences === 0) {
      return 0;
    }
    let level = Math.round(
      4.71 * (letters / words) + 0.5 * words / sentences - 21.43
    );
    return level <= 0 ? 0 : level;
  }

  function getAdverbs(sentence) {
    let lyWords = getLyWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          word.replace(/[^a-z0-9. ]/gi, "").match(/ly$/) &&
          lyWords[word.replace(/[^a-z0-9. ]/gi, "").toLowerCase()] === undefined
        ) {
          data.adverbs += 1;
          return `<span class="adverb">${word}</span>`;
        } else {
          return word;
        }
      })
      .join(" ");
  }
  
  function getYou(sentence) {
    let youWords = getYouWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          youWords[word.toLowerCase()] !== undefined
        ) {
          data.you += 1;
          return `<span class="you">${word}</span>`;
        } else {
          return word;
        }
    })
    .join(" ");
  }
  
  function getExclaim(sentence) {
    return sentence
      .split(" ")
      .map(word => {
        if (
          word.endsWith("!")
        ) {
          data.exclaim += 1;
          return `<span class="exclaim">${word}</span>`;
        } else {
          return word;
        }
    })
    .join(" ");
  }

  function getWe(sentence) {
    let weWords = getWeWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          weWords[word.toLowerCase()] !== undefined
        ) {
          data.we += 1;
          return `<span class="we">${word}</span>`;
        } else {
          return word;
        }
    })
    .join(" ");
  }

  function getComplex(sentence) {
    let words = getComplexWords();
    let wordList = Object.keys(words);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "complex", words[key]);
    });
    return sentence;
  }

  function findAndSpan(sentence, string, type, replacement) {
    let index = sentence.toLowerCase().indexOf(string);
    let a = { complex: "complex", qualifier: "adverbs" };
    if (index >= 0) {
      data[a[type]] += 1;
      sentence =
        sentence.slice(0, index) +
        `<span class="${type}">` +
        (type == "complex" ? `<span class="tooltiptext">` + replacement + `</span>` : ``) +
        sentence.slice(index, index + string.length) +
        "</span>" +
        findAndSpan(sentence.slice(index + string.length), string, type, replacement);
    }
    return sentence;
  }

  function getQualifier(sentence) {
    let qualifiers = getQualifyingWords();
    let wordList = Object.keys(qualifiers);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "qualifier", "");
    });
    return sentence;
  }

  function getQualifyingWords() {
    return {
      "i believe": 1,
      "i consider": 1,
      "i don't believe": 1,
      "i don't consider": 1,
      "i don't feel": 1,
      "i don't suggest": 1,
      "i don't think": 1,
      "i feel": 1,
      "i hope to": 1,
      "i might": 1,
      "i suggest": 1,
      "i think": 1,
      "i was wondering": 1,
      "i will try": 1,
      "i wonder": 1,
      "in my opinion": 1,
      "is kind of": 1,
      "is sort of": 1,
      just: 1,
      maybe: 1,
      perhaps: 1,
      possibly: 1,
      "we believe": 1,
      "we consider": 1,
      "we don't believe": 1,
      "we don't consider": 1,
      "we don't feel": 1,
      "we don't suggest": 1,
      "we don't think": 1,
      "we feel": 1,
      "we hope to": 1,
      "we might": 1,
      "we suggest": 1,
      "we think": 1,
      "we were wondering": 1,
      "we will try": 1,
      "we wonder": 1
    };
  }
  
  function getYouWords() {
    return {
      you: 1,
      your: 1,
      "you're": 1
    };
  }

  function getWeWords() {
    return {
      i: 1,
      we: 1,
      our: 1,
      "i'm": 1,
      "i've": 1,
      "i'll": 1,
      "we're": 1,
      "we've": 1,
      "we'll": 1
    };
  }

  function getLyWords() {
    return {
      actually: 1,
      additionally: 1,
      allegedly: 1,
      ally: 1,
      alternatively: 1,
      anomaly: 1,
      apply: 1,
      approximately: 1,
      ashely: 1,
      ashly: 1,
      assembly: 1,
      awfully: 1,
      baily: 1,
      belly: 1,
      bely: 1,
      billy: 1,
      bradly: 1,
      bristly: 1,
      bubbly: 1,
      bully: 1,
      burly: 1,
      butterfly: 1,
      carly: 1,
      charly: 1,
      chilly: 1,
      comely: 1,
      completely: 1,
      comply: 1,
      consequently: 1,
      costly: 1,
      courtly: 1,
      crinkly: 1,
      crumbly: 1,
      cuddly: 1,
      curly: 1,
      currently: 1,
      daily: 1,
      dastardly: 1,
      deadly: 1,
      deathly: 1,
      definitely: 1,
      dilly: 1,
      disorderly: 1,
      doily: 1,
      dolly: 1,
      dragonfly: 1,
      early: 1,
      elderly: 1,
      elly: 1,
      emily: 1,
      especially: 1,
      exactly: 1,
      exclusively: 1,
      family: 1,
      finally: 1,
      firefly: 1,
      folly: 1,
      friendly: 1,
      frilly: 1,
      gadfly: 1,
      gangly: 1,
      generally: 1,
      ghastly: 1,
      giggly: 1,
      globally: 1,
      goodly: 1,
      gravelly: 1,
      grisly: 1,
      gully: 1,
      haily: 1,
      hally: 1,
      harly: 1,
      hardly: 1,
      heavenly: 1,
      hillbilly: 1,
      hilly: 1,
      holly: 1,
      holy: 1,
      homely: 1,
      homily: 1,
      horsefly: 1,
      hourly: 1,
      immediately: 1,
      instinctively: 1,
      imply: 1,
      italy: 1,
      jelly: 1,
      jiggly: 1,
      jilly: 1,
      jolly: 1,
      july: 1,
      karly: 1,
      kelly: 1,
      kindly: 1,
      lately: 1,
      likely: 1,
      lilly: 1,
      lily: 1,
      lively: 1,
      lolly: 1,
      lonely: 1,
      lovely: 1,
      lowly: 1,
      luckily: 1,
      mealy: 1,
      measly: 1,
      melancholy: 1,
      mentally: 1,
      molly: 1,
      monopoly: 1,
      monthly: 1,
      multiply: 1,
      nightly: 1,
      oily: 1,
      only: 1,
      orderly: 1,
      panoply: 1,
      particularly: 1,
      partly: 1,
      paully: 1,
      pearly: 1,
      pebbly: 1,
      polly: 1,
      potbelly: 1,
      presumably: 1,
      previously: 1,
      pualy: 1,
      quarterly: 1,
      rally: 1,
      rarely: 1,
      recently: 1,
      rely: 1,
      reply: 1,
      reportedly: 1,
      roughly: 1,
      sally: 1,
      scaly: 1,
      shapely: 1,
      shelly: 1,
      shirly: 1,
      shortly: 1,
      sickly: 1,
      silly: 1,
      sly: 1,
      smelly: 1,
      sparkly: 1,
      spindly: 1,
      spritely: 1,
      squiggly: 1,
      stately: 1,
      steely: 1,
      supply: 1,
      surly: 1,
      tally: 1,
      timely: 1,
      trolly: 1,
      ugly: 1,
      underbelly: 1,
      unfortunately: 1,
      unholy: 1,
      unlikely: 1,
      usually: 1,
      waverly: 1,
      weekly: 1,
      wholly: 1,
      willy: 1,
      wily: 1,
      wobbly: 1,
      wooly: 1,
      worldly: 1,
      wrinkly: 1,
      yearly: 1
    };
  }

  function getComplexWords() {
    return {
      "a number of": ["many", "some"],
      abundance: ["enough", "plenty"],
      "accede to": ["allow", "agree to"],
      accelerate: ["speed up"],
      accentuate: ["stress"],
      accompany: ["go with", "with"],
      accomplish: ["do"],
      accorded: ["given"],
      accrue: ["add", "gain"],
      acquiesce: ["agree"],
      acquire: ["get"],
      additional: ["more", "extra"],
      "adjacent to": ["next to"],
      adjustment: ["change"],
      admissible: ["allowed", "accepted"],
      advantageous: ["helpful"],
      "adversely impact": ["hurt"],
      advise: ["tell"],
      aforementioned: ["remove"],
      aggregate: ["total", "add"],
      aircraft: ["plane"],
      "all of": ["all"],
      alleviate: ["ease", "reduce"],
      allocate: ["divide"],
      "along the lines of": ["like", "as in"],
      "already existing": ["existing"],
      alternatively: ["or"],
      ameliorate: ["improve", "help"],
      anticipate: ["expect"],
      apparent: ["clear", "plain"],
      appreciable: ["many"],
      "as a means of": ["to"],
      "as of yet": ["yet"],
      "as to": ["on", "about"],
      "as yet": ["yet"],
      ascertain: ["find out", "learn"],
      assistance: ["help"],
      "at this time": ["now"],
      attain: ["meet"],
      "attributable to": ["because"],
      authorize: ["allow", "let"],
      "because of the fact that": ["because"],
      belated: ["late"],
      "benefit from": ["enjoy"],
      bestow: ["give", "award"],
      "by virtue of": ["by", "under"],
      cease: ["stop"],
      "close proximity": ["near"],
      commence: ["begin or start"],
      "comply with": ["follow"],
      concerning: ["about", "on"],
      consequently: ["so"],
      consolidate: ["join", "merge"],
      constitutes: ["is", "forms", "makes up"],
      demonstrate: ["prove", "show"],
      depart: ["leave", "go"],
      designate: ["choose", "name"],
      discontinue: ["drop", "stop"],
      "due to the fact that": ["because", "since"],
      "each and every": ["each"],
      economical: ["cheap"],
      eliminate: ["cut", "drop", "end"],
      elucidate: ["explain"],
      employ: ["use"],
      endeavor: ["try"],
      enumerate: ["count"],
      equitable: ["fair"],
      equivalent: ["equal"],
      evaluate: ["test", "check"],
      evidenced: ["showed"],
      exclusively: ["only"],
      expedite: ["hurry"],
      expend: ["spend"],
      expiration: ["end"],
      facilitate: ["ease", "help"],
      "factual evidence": ["facts", "evidence"],
      feasible: ["workable"],
      finalize: ["complete", "finish"],
      "first and foremost": ["first"],
      "for the purpose of": ["to"],
      forfeit: ["lose", "give up"],
      formulate: ["plan"],
      "honest truth": ["truth"],
      however: ["but", "yet"],
      "if and when": ["if", "when"],
      impacted: ["affected", "harmed", "changed"],
      implement: ["install", "put in place", "tool"],
      "in a timely manner": ["on time"],
      "in accordance with": ["by", "under"],
      "in addition": ["also", "besides", "too"],
      "in all likelihood": ["probably"],
      "in an effort to": ["to"],
      "in between": ["between"],
      "in excess of": ["more than"],
      "in lieu of": ["instead"],
      "in light of the fact that": ["because"],
      "in many cases": ["often"],
      "in order to": ["to"],
      "in regard to": ["about", "concerning", "on"],
      "in some instances ": ["sometimes"],
      "in terms of": ["omit"],
      "in the near future": ["soon"],
      "in the process of": ["omit"],
      inception: ["start"],
      "incumbent upon": ["must"],
      indicate: ["say", "state", "or show"],
      indication: ["sign"],
      initiate: ["start"],
      "is applicable to": ["applies to"],
      "is authorized to": ["may"],
      "is responsible for": ["handles"],
      "it is essential": ["must", "need to"],
      literally: ["omit"],
      magnitude: ["size"],
      maximum: ["greatest", "largest", "most"],
      methodology: ["method"],
      minimize: ["cut"],
      minimum: ["least", "smallest", "small"],
      modify: ["change"],
      monitor: ["check", "watch", "track"],
      multiple: ["many"],
      necessitate: ["cause", "need"],
      nevertheless: ["still", "besides", "even so"],
      "not certain": ["uncertain"],
      "not many": ["few"],
      "not often": ["rarely"],
      "not unless": ["only if"],
      "not unlike": ["similar", "alike"],
      notwithstanding: ["in spite of", "still"],
      "null and void": ["use either null or void"],
      numerous: ["many"],
      objective: ["aim", "goal"],
      obligate: ["bind", "compel"],
      obtain: ["get"],
      "on the contrary": ["but", "so"],
      "on the other hand": ["omit", "but", "so"],
      "one particular": ["one"],
      optimum: ["best", "greatest", "most"],
      overall: ["omit"],
      "owing to the fact that": ["because", "since"],
      participate: ["take part"],
      particulars: ["details"],
      "pass away": ["die"],
      "pertaining to": ["about", "of", "on"],
      "point in time": ["time", "point", "moment", "now"],
      portion: ["part"],
      possess: ["have", "own"],
      preclude: ["prevent"],
      previously: ["before"],
      "prior to": ["before"],
      prioritize: ["rank", "focus on"],
      procure: ["buy", "get"],
      proficiency: ["skill"],
      "provided that": ["if"],
      purchase: ["buy", "sale"],
      "put simply": ["omit"],
      "readily apparent": ["clear"],
      "refer back": ["refer"],
      regarding: ["about", "of", "on"],
      relocate: ["move"],
      remainder: ["rest"],
      remuneration: ["payment"],
      require: ["must", "need"],
      requirement: ["need", "rule"],
      reside: ["live"],
      residence: ["house"],
      retain: ["keep"],
      satisfy: ["meet", "please"],
      shall: ["must", "will"],
      "should you wish": ["if you want"],
      "similar to": ["like"],
      solicit: ["ask for", "request"],
      "span across": ["span", "cross"],
      strategize: ["plan"],
      subsequent: ["later", "next", "after", "then"],
      substantial: ["large", "much"],
      "successfully complete": ["complete", "pass"],
      sufficient: ["enough"],
      terminate: ["end", "stop"],
      "the month of": ["omit"],
      therefore: ["thus", "so"],
      "this day and age": ["today"],
      "time period": ["time", "period"],
      "took advantage of": ["preyed on"],
      transmit: ["send"],
      transpire: ["happen"],
      "until such time as": ["until"],
      utilization: ["use"],
      utilize: ["use"],
      validate: ["confirm"],
      "various different": ["various", "different"],
      "whether or not": ["whether"],
      "with respect to": ["on", "about"],
      "with the exception of": ["except for"],
      witnessed: ["saw", "seen"]
    };
  }

})();
