/**
 * story.js - Conținutul narativ al experienței "Secret Vault"
 * Poveștile, datele istorice, gândurile secrete și textul scrisorii.
 */

export const storyData = {
  vault: {
    badge: "Pentru tine 🔐",
    title: "Ceva pentru Cati",
    subtitle: "Am adunat aici amintirile noastre. Deschide-l să vezi.",
    openButtonText: "Deschide seiful 🔓",
    hint: "Apasă pe buton și hai să începem.",
    instruction3D: "Trage de rotiță sau apasă pe ea ca să-l deschizi"
  },

  chapters: [
    {
      id: "suceava",
      stageIndex: 1,
      number: "01",
      badge: "Unde a început totul",
      location: "Hotel Continental, Suceava • 28 martie 2026",
      event: "Olimpiada de Germană (și sincer, nu germana a contat)",
      title: "Privirea din lobby",
      story: "Holul plin de ecusoane, multă agitație... și dintr-o dată te-am văzut pe tine. În secunda aia nu m-am mai gândit la nimic altceva.",
      card: {
        frontTitle: "Privirea din lobby",
        frontSubtitle: "Suceava 2026",
        image: "/photos/olimpiada-suceava.jpg",
        frontNote: "Apasă pe poză să vezi ce-mi trecea prin cap 🤭",
        secretThought: "Când te-am văzut prima dată, sincer, mi-a sărit inima din piept și nu m-am mai gândit la nimic altceva.",
        author: "Ștefan"
      },
      preFlipPrompt: "Apasă pe poză, are ceva scris pe spate 👀",
      postUnlockPrompt: "Hai mai departe, că au urmat mulți kilometri între noi.",
      nextButtonText: "Hai mai departe ➜"
    },

    {
      id: "distance-bridge",
      stageIndex: 2,
      number: "02",
      badge: "Kilometri mulți, dar nu ne-a păsat",
      period: "Primăvara și vara 2026",
      title: "Ne vedem la Oradea?",
      story: "Eu la Piatra Neamț, tu la Târgu Mureș. Ne despărțeau ore bune de drum, dar aveam în cap doar un singur lucru: să ne vedem la Oradea.",
      originCity: "Piatra Neamț (Ștefan)",
      destinationCity: "Târgu Mureș (Cati)",
      commonMeetingPoint: "Oradea • unde ne-am văzut",
      totalDistanceKm: 220,
      sliderGuide: "Trage de cerc și adu-ne mai aproape la Oradea 📍",
      connectedTitle: "Ne-am luat în brațe la Oradea 🥹",
      connectedSubtitle: "CDTO 2026 • 1–4 septembrie • 0 kilometri",
      connectedDescription: "Sute de kilometri, mii de poze pe Insta și mesaje, și în sfârșit… am fost la 0 kilometri unul de altul.",
      heartbeatButtonText: "Trimite o bătaie de inimă spre Oradea 💌",
      heartbeatUnpressed: "Apasă ca să trimiți un puls din ambele orașe",
      heartbeatPressed: "Ne-am sincronizat inimile la Oradea ❤️",
      activeAdvancePrompt: "Gata, suntem la 0 km! Hai să vezi cum a fost la Oradea.",
      blockedAdvancePrompt: "Trage sliderul până la capăt și trimite o inimioară, altfel nu pornim 😌",
      nextButtonText: "Hai la Oradea ➜"
    },

    {
      id: "reunion",
      stageIndex: 3,
      number: "03",
      badge: "În sfârșit, pe bune",
      period: "1–4 septembrie 2026 • Oradea • CDTO 2026",
      location: "Oradea • CDTO 2026",
      title: "Ne-am văzut pe bune, nu prin ecran",
      story: "După luni de vorbit prin poze pe insta, am lăsat telefonul jos și am ieșit la primul date adevărat.",
      dates: [
        { day: "1 septembrie", note: "Când am ajuns aveam gânduri că ne vom vedea și eram entuziasmat" },
        { day: "3 septembrie", note: "Primul nostru „date” (că nu aveam să știm că era date sau că aveam să fim împreună)" },
        { day: "4 septembrie (03:00–09:00)", note: "Dimineața aia genială, când am stat amândoi de vorbă până la 9 dimineața" }
      ],
      clockTitle: "4 septembrie • de la 03:00 la 09:00",
      clockStates: {
        3: "Ora 3: normal lumea dormea. Noi povesteam și râdeam.",
        5: "Ora 5: se lumina afară la Oradea și nici nu ne păsa de somn.",
        7: "Ora 7: a venit dimineața și noi tot împreună eram.",
        9: "Ora 9: a trebuit să plec, dar a fost cea mai tare dimineață."
      },
      clockProgressMessage: "Orele trec spre 09:00… stai să vezi poza de dimineață 👀",
      cardFinalBadge: "Ora 09:00 • Dimineața de 4 septembrie",
      cardFinalSubtitle: "Momentul în care ne-am dat amintirile 🫶",
      photoLabel: "4 septembrie • Oradea",
      intimateQuote: "De la 3 dimineața până la 9, au fost orele care ne-au apropiat cel mai mult. Ți-am dat beteala, mi-ai dat ecusonul, și am știut că e ceva special.",
      signature: "— 4 septembrie 2026, ora 09:00 • Oradea",
      nextPrompt: "Și de aici încolo lucrurile au devenit și mai faine. Hai să vezi.",
      nextButtonText: "Hai să vezi ➜"
    },

    {
      id: "official-us",
      stageIndex: 4,
      number: "04",
      badge: "Pasul cel mare 🎉",
      date: "4 septembrie → 19 septembrie 2026",
      title: "Oficial «Noi»",
      words: {
        first: "tu",
        second: "eu",
        united: "noi"
      },
      message: "Ziua în care ne-am zis pe bune ce simțim și am devenit un cuplu.",
      facetimeMemory: {
        tag: "Serile și nopțile noastre la telefon 🌙",
        calls: [
          {
            id: "record",
            date: "13 Septembrie 2026",
            duration: "5 ore și 19 minute • record all-time 🏆",
            durationHuman: "5 ore și 19 minute",
            image: "/photos/facetime-real-2.jpg",
            category: "Record all-time 🏆",
            title: "Recordul nostru de vorbit",
            highlight: "5 ore și 19 minute fără pauză",
            description: "Am râs, am povestit și mi-ai dat ragebait de nu mai știam de mine, până am adormit amândoi cu căștile în urechi."
          },
          {
            id: "relationship",
            date: "19 Septembrie 2026",
            duration: "1 oră și 53 de minute",
            durationHuman: "1 oră și 53 de minute",
            image: "/photos/facetime-real-1.jpg",
            category: "Cel mai bine folosit timp 🥹",
            title: "Apelul din 19 septembrie 🥹",
            highlight: "Când am zis că suntem împreună",
            description: "În aproape 2 ore ne-am spus tot ce aveam pe suflet și am stabilit oficial că suntem noi doi."
          }
        ]
      },
      portrait: {
        title: "Cati & Ștefan • 19 septembrie 2026",
        badge: "Din ziua în care am devenit oficial iubit și iubită"
      },
      finalPrompt: {
        badge: "Amintiri & Surprize 🎁",
        message: "Mai am câteva surprize pentru tine înainte de scrisoarea finală. Hai să le vezi!"
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

