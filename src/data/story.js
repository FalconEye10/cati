/**
 * story.js - Conținutul narativ al experienței "Secret Vault"
 * Poveștile, datele istorice, gândurile secrete și textul scrisorii.
 */

export const storyData = {
  vault: {
    badge: "Capsula timpului ⏳",
    title: "Ceva pentru Cati",
    subtitle: "Povestea noastră, închisă într-un seif. Nu e cine știe ce secret, dar e al nostru.",
    openButtonText: "Deschide seiful 🔓",
    hint: "Apasă pe buton și lasă amintirile să iasă la joacă.",
    instruction3D: "Apasă sau trage de volan ca să deschizi seiful"
  },

  chapters: [
    {
      id: "suceava",
      stageIndex: 1,
      number: "01",
      badge: "Unde a început totul",
      location: "Hotel Continental, Suceava • 28 martie 2026",
      event: "Olimpiada Națională de Germană (și, surprinzător, nu pentru germană am ținut minte)",
      title: "Privirea din lobby",
      story: "Hol plin de ecusoane, oameni random, agitație. Și deodată: ea. Restul lumii a dat mute.",
      card: {
        frontTitle: "Privirea din lobby",
        frontSubtitle: "Olimpiada de Germană, Suceava 2026",
        image: "/photos/olimpiada-suceava.jpg",
        frontNote: "Atinge poza ca să afli ce gândeam 🤭",
        secretThought: "Când te-am văzut, ai stârnit o sclipire și ai dat o scânteie în ochii mei",
        author: "Ștefan"
      },
      preFlipPrompt: "Întoarce poza, are ceva scris pe spate 👀",
      postUnlockPrompt: "Prima filă e deschisă. Hai spre capitolul următor, e unul cu mulți kilometri.",
      nextButtonText: "Hai mai departe ➜"
    },

    {
      id: "distance-bridge",
      stageIndex: 2,
      number: "02",
      badge: "Distanța, dar cu stil",
      period: "Primăvara și vara 2026",
      title: "Ne vedem la Oradea?",
      story: "El din Piatra Neamț, ea din Târgu Mureș. Matematic, la mijloc. Practic, Oradea, la CDTO 2026.",
      originCity: "Piatra Neamț (Ștefan)",
      destinationCity: "Târgu Mureș (Cati)",
      commonMeetingPoint: "Oradea • loc de întâlnire",
      totalDistanceKm: 220,
      sliderGuide: "Glisează și adu-ne mai aproape: Oradea 📍",
      connectedTitle: "Ne-am luat în brațe la Oradea 🥹",
      connectedSubtitle: "CDTO 2026 • 1–4 septembrie • 0 kilometri",
      connectedDescription: "Sute de kilometri, mii de „bună dimineața” pe telefon, și în sfârșit… la 0 km.",
      heartbeatButtonText: "Trimite o bătaie de inimă spre Oradea 💌",
      heartbeatUnpressed: "Apasă ca să trimiți un puls din ambele orașe",
      heartbeatPressed: "Inimile noastre s-au întâlnit la Oradea ❤️",
      activeAdvancePrompt: "Inimile s-au adunat! Hai spre Oradea.",
      blockedAdvancePrompt: "Trage sliderul la 0 km și trimite o bătaie de inimă, altfel nu pornim 😌",
      nextButtonText: "Hai la Oradea ➜"
    },

    {
      id: "reunion",
      stageIndex: 3,
      number: "03",
      badge: "În sfârșit, pe bune",
      period: "1–4 septembrie 2026 • Oradea • CDTO 2026",
      location: "Oradea • CDTO 2026",
      title: "Ne-am văzut, pe bune, fără ecran",
      story: "După luni de vorbit prin poze pe insta, am lăsat telefonul jos și am ieșit la primul date adevărat.",
      dates: [
        { day: "1 septembrie", note: "Când am ajuns aveam numai gândul că ne vom vedea și eram super entuziasmat" },
        { day: "3 septembrie", note: "Primul nostru „date” (deși habar n-aveam pe atunci că e date sau că vom fi împreună)" },
        { day: "4 septembrie (03:00–09:00)", note: "O dimineață de neuitat, începutul a tot ce a urmat" }
      ],
      clockTitle: "4 septembrie • 03:00 → 09:00",
      clockStates: {
        3: "Ora 3: oamenii normali dorm. Noi, deloc.",
        5: "Se face lumină la Oradea și nici nu ne pasă.",
        7: "Dimineața e aici, noi suntem încă în bula noastră.",
        9: "Ora 9: cea mai recentă vedere, nu ultima, promit."
      },
      clockProgressMessage: "Orele trec spre 09:00… dar nu te supăra, urmează mai bine.",
      cardFinalBadge: "Ora 09:00 • Cea mai recentă, nu ultima",
      cardFinalSubtitle: "Nu e un adio, e un „pe curând” 🫶",
      photoLabel: "4 septembrie • Oradea",
      intimateQuote: "De la 3 dimineața la 9, am trăit clipe pe care nu le uit. Nu a fost ultima dată, doar cea mai recentă.",
      signature: "— 4 septembrie 2026, ora 09:00 • Oradea",
      nextPrompt: "Și s-a întâmplat ceva și mai frumos. Hai să vezi.",
      nextButtonText: "Hai să vezi ➜"
    },

    {
      id: "official-us",
      stageIndex: 4,
      number: "04",
      badge: "Level up 🎉",
      date: "4 septembrie → 19 septembrie 2026",
      title: "Oficial «Noi»",
      words: {
        first: "tu",
        second: "eu",
        united: "noi"
      },
      message: "Ziua în care ne-am zis tot ce simțeam. Fără cod secret.",
      facetimeMemory: {
        tag: "Nopțile noastre la FaceTime 🌙",
        calls: [
          {
            id: "record",
            date: "13 Septembrie 2026",
            duration: "5 ore și 19 minute • record all-time 🏆",
            durationHuman: "5 ore și 19 minute",
            image: "/photos/facetime-real-2.jpg",
            category: "Record all-time 🏆",
            title: "Recordul nostru",
            highlight: "Somnul a pierdut, noi am câștigat",
            description: "Am râs, am povestit, am adormit cu căștile în urechi. Somnul a pierdut, noi am câștigat."
          },
          {
            id: "relationship",
            date: "19 Septembrie 2026",
            duration: "1 oră și 53 de minute",
            durationHuman: "1 oră și 53 de minute",
            image: "/photos/facetime-real-1.jpg",
            category: "Cel mai bine folosit timp 🥹",
            title: "Apelul în care am devenit oficial 🥹",
            highlight: "Momentul când am devenit iubit și iubită",
            description: "În 1h53 ne-am spus ce simțeam și am devenit iubit și iubită. Cel mai bine folosit timp."
          }
        ]
      },
      portrait: {
        title: "Cati & Ștefan • 19 septembrie 2026 • Împreună, dincolo de kilometri",
        badge: "Momentul în care povestea a devenit a noastră"
      },
      finalPrompt: {
        badge: "Ultimul secret 💌",
        message: "A rămas o scrisoare închisă în ceară roșie. Apasă pe pecete, e pentru tine."
      }
    }
  ],

  letter: {
    recipientTag: "Pentru Cati",
    sealInitials: "C & Ș",
    waxPrompt: "Apasă pe sigiliu ca să rupi ceara. Atenție, e scrisoare cu sentimente 🫣",
    date: "2 octombrie 2026",
    content: [
      "Dragă Cati,",
      "Dacă mi-ar fi spus cineva în primăvară că în holul de la Hotel Continental din Suceava, printre ecusoane de olimpiadă, o să cunosc persoana cu care vreau să fiu, i-aș fi zis „sure, sigur”. Dar uite că s-a întâmplat.",
      "I gotta admit, când te-am văzut nu m-am mai gândit la nimic altceva. Apoi au urmat kilometrii, tu la Târgu Mureș, eu la Piatra Neamț, mesaje pe Insta (vara mai puțin, ce-i drept) și seri pe FaceTime în care mi-ai dat ragebait fără nicio remușcare. Dacă m-ai întreba dacă a meritat, ți-aș spune că da, chiar și așa.",
      "La Oradea, la CDTO 2026, ne-am văzut în sfârșit. Dimineața de 4 septembrie a fost amazing, wild și fulfilling, o experiență nouă pentru mine, care ne-a apropiat mai mult ca niciodată. La 9:00, când a trebuit să plec, ne-am îmbrățișat și ne-am sărutat, iar tu mi-ai dat ca amintire ecusonul tău de la CDTO. Eu ți-am dat „beteala Michael Jackson” de la ultimul party. Nu sunt lucruri mari, dar contează pentru mine, și mă gândesc la tine de fiecare dată când le văd.",
      "Pe 19 septembrie am zis „noi” și am simțit că e ceva real. Distanța nu dispăruse, dar nu mai conta atât de mult.",
      "Azi facem o lună. Mă bucur că vorbim aproape în fiecare zi, chiar dacă de multe ori doar printr-un ecran. Vreau să fiu omul cu care poți vorbi, râde și face mișto de orice, mai ales în zilele când distanța se simte mai tare.",
      "Dragul tău iubit, Ștefan"
    ]
  }
};

