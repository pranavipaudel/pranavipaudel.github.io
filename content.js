/* =====================================================================
   PRANAVI'S FARM — CONTENT FILE
   ---------------------------------------------------------------------
   Everything people read on the site lives in this one file, so you can
   update text, links and images without touching any game code.

   • Image paths are relative to the site root (same folder as index.html).
   • Keep the quotes and commas exactly as they are when editing.
   • Skill levels go from 1 to 5.
   ===================================================================== */
window.FARM = window.FARM || {};

FARM.data = {

  /* ------------------------------------------------------------------ */
  person: {
    name: "Pranavi Paudel",
    first: "Pranavi",
    title: "Mechanical & Biomedical Engineer",
    tagline: "I design it, build it, test it, and make it better.",
    school: "Mississippi State University",
    degree: "B.S. Mechanical & Biomedical Engineering",
    grad: "May 2027",
    gpa: "4.0 / 4.0",
    location: "Starkville, Mississippi",
    roots: "Nepal",
    photo: "pranu.JPEG",
    email: "pp892@msstate.edu",
    altEmail: "pranavipaudel@gmail.com",
    linkedin: "https://www.linkedin.com/in/pranavi-paudel/",
    instagram: "https://www.instagram.com/pranavipaudel/",
    /* Paste a Calendly (or similar) link here and the Golden Acorn Pass
       will use it for booking. Leave empty to use email instead. */
    bookingLink: "",
    resumes: [
      { label: "Mechanical & Biomedical Engineering", short: "Mech + Biomed", file: "PranaviPaudel_Resume_mbe.pdf" },
      { label: "Mechanical Engineering", short: "Mechanical", file: "PranaviPaudel_Resume_me.pdf" }
    ],
    lookingFor: "Co-op and internship roles in mechanical design, medical devices, manufacturing and product development."
  },

  /* ------------------------------------------------------------------ */
  about: {
    greeting: "Namaste! I'm Pranavi.",
    intro: [
      "I'm a senior studying Mechanical & Biomedical Engineering at Mississippi State University, with a 4.0 GPA and a May 2027 graduation date. I grew up in Nepal and moved to the U.S. for engineering, and I've been building things ever since.",
      "I'm most energized by the part of engineering where an idea becomes a real product. My work spans CAD and simulation (SolidWorks, ANSYS Fluent, Abaqus), hands-on prototyping and CNC machining, and time on the shop floor. Right now I'm redesigning a ventricular shunt catheter at CAVS. Last summer I helped improve valve assembly lines at Parker Hannifin.",
      "I love the loop of model, test, learn, redesign, and I keep going until the design is more robust, more manufacturable, and genuinely useful to the people who depend on it."
    ],
    stats: [
      { icon: "cap",      label: "Studying",   value: "B.S. Mechanical & Biomedical Eng." },
      { icon: "star",     label: "GPA",        value: "4.0 · President's List 2023–25" },
      { icon: "calendar", label: "Graduating", value: "May 2027" },
      { icon: "wrench",   label: "Currently",  value: "Engineering Assistant @ CAVS" },
      { icon: "gear",     label: "Summer '26", value: "Design & Mfg. Intern @ Parker" },
      { icon: "mountain", label: "Roots",      value: "Nepal → Starkville, MS" }
    ],
    /* "Fireside chats": short Q&As in Pranavi's own words */
    chats: [
      {
        q: "What kind of engineer do you want to be?",
        a: "I love working on lots of projects and learning something new from each one. In an interview once, I met an engineer who had spent almost thirty years designing car side mirrors, a whole career in a field I didn't even know existed. It reminded me how much there still is to explore. I don't want my days to feel monotonous… but if I ever fall in love with side mirrors, I'll happily design them for a lifetime."
      },
      {
        q: "A moment from Parker that stuck with you?",
        a: "Everything in our plant was built in-house, from pack-out tables to complex test stands. One day I asked who made the test stand, and the answer was: \"We did. We're the engineers.\" That's when it really hit me. Later, during a kaizen, I redesigned a barcode-scanner holder whose buried magnet kept the scanner on 24/7. When another cell needed the same fix, nobody knew I'd already made one, and they were very surprised to find out it was me."
      },
      {
        q: "Why do you care so much about manufacturing?",
        a: "You can design anything in CAD, but manufacturing teaches you what's actually possible, affordable and practical. Knowing how to model a part is one thing. Designing it so it can be machined the simplest way, with the least material wasted, is what makes a great engineer."
      },
      {
        q: "Tell me about a time something failed.",
        a: "My bridge design looked great in FEA, but the 3D-printed version came out weak. The print layers ran parallel to the main stress instead of across it, and my simulation didn't account for infill or layer orientation. Lesson learned: a simulation is only as good as its assumptions."
      },
      {
        q: "Why do you tutor?",
        a: "It's one thing to understand something yourself; it's more impactful when you can make someone else understand it. Breaking down bending stress or Bernoulli's equation for a struggling student forced me to go beyond memorization, and it made me think much more practically about engineering."
      },
      {
        q: "Best part of working on the shop floor?",
        a: "The people. Operators have their own lives and their own clever ways of solving problems, and the more you talk with them, the more they open up. Following someone through their routine for an hour taught me more than reading twenty pages about how a valve works."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* Experience: listed oldest → newest (the cart drives through them in
     this order). start/end use "YYYY-MM". Use end: "present" if ongoing. */
  experience: [
    {
      id: "nerd",
      org: "Neural Engineering Research Division (NERD)",
      short: "NERD",
      role: "Undergraduate Researcher",
      start: "2024-05", end: "2024-08", dates: "May 2024 – Aug 2024",
      kind: "research", building: "lab",
      logo: "NERD.png",
      skills: ["EEG recording", "MATLAB", "Signal processing", "Experimental design"],
      bullets: [
        "Executed a 10-participant EEG study on fear of heights: developed the experimental protocol, managed data acquisition, and applied MATLAB signal analysis (FPVS).",
        "Quantified neural oscillations, showing a 25–30% increase in activity in fear-responsive participants versus controls."
      ]
    },
    {
      id: "taebi",
      org: "Taebi Lab",
      short: "Taebi Lab",
      role: "Undergraduate Research Assistant",
      start: "2024-08", end: "2025-05", dates: "Aug 2024 – May 2025",
      kind: "research", building: "lab",
      logo: "taebi.png",
      skills: ["Human-subject studies", "ECG", "Physiological data", "Signal analysis"],
      bullets: [
        "Conducted 25+ human-subject studies capturing synchronized ECG, pulse oximeter, accelerometer and blood-pressure data during breath-hold and normal breathing.",
        "Collected and analyzed physiological signals using LabScribe, Bluetooth sensors, respiration belts and video systems for contactless cardiovascular monitoring."
      ]
    },
    {
      id: "heal",
      org: "HEAL Lab · MSU Kinesiology",
      short: "HEAL Lab",
      role: "Undergraduate Researcher",
      start: "2025-01", end: "2025-12", dates: "Jan 2025 – Dec 2025",
      kind: "research", building: "hall",
      logo: "heal.jpg",
      skills: ["Assistive robotics", "Human-machine interaction", "Research writing", "Literature review"],
      bullets: [
        "Co-authoring two research papers on assistive robots for movement, locomotion and mobility.",
        "Analyzed 50+ assistive robotic systems on the market to identify common design principles, neuromechanics and mobility optimization for real-world use."
      ]
    },
    {
      id: "ummc",
      org: "UMMC Cancer Center & Research Institute",
      short: "UMMC",
      role: "Summer Research Intern",
      start: "2025-06", end: "2025-08", dates: "Jun 2025 – Aug 2025",
      location: "Jackson, MS",
      kind: "research", building: "hospital",
      logo: "UMMC.jpg",
      skills: ["2D/3D cell culture", "Bioprinting", "qRT-PCR", "Western blot", "MTT assays"],
      bullets: [
        "Designed 2D/3D tumor models (organoids and spheroids) to study treatment response.",
        "Performed qRT-PCR, Western blot, immunohistochemistry and MTT assays with significant results (p < 0.0001).",
        "Used 3D bioprinting (CELLINK BIO X) to create tumor–bone–vessel constructs for translational applications."
      ]
    },
    {
      id: "polylab",
      org: "Biomedical Polymer Engineering Lab",
      short: "Polymer Lab",
      role: "Undergraduate Research Assistant",
      start: "2025-08", end: "2025-12", dates: "Aug 2025 – Dec 2025",
      kind: "research", building: "lab",
      logo: "polylab.jpg",
      skills: ["Instron testing", "UV-Vis", "Cytocompatibility", "Material selection"],
      bullets: [
        "Ran stress–strain characterization of nanotech polymer samples on an Instron universal testing machine (tensile strength, elastic modulus, failure behavior), improving consistency of material comparisons by ~20%.",
        "Correlated UV-Vis spectrophotometry with stress–strain data to identify stiffness, degradation and failure trends, improving prediction of performance trade-offs under real-world loading by ~15%.",
        "Performed fibroblast cytotoxicity experiments and absorbance analysis to evaluate nanoparticle biocompatibility across concentration gradients."
      ]
    },
    {
      id: "cavs",
      org: "Center for Advanced Vehicular Systems (CAVS), Mississippi State University",
      short: "CAVS",
      role: "Engineering Assistant",
      start: "2026-01", end: "present", dates: "Jan 2026 – Present",
      location: "Starkville, MS",
      kind: "industry", building: "hall",
      logo: "cavs.png",
      skills: ["SolidWorks", "CFD", "ANSYS Fluent", "Abaqus FEA", "Medical device design"],
      bullets: [
        "Designing and optimizing a ventricular shunt catheter in SolidWorks, reducing simulated flow stagnation zones by ~33% by refining lumen geometry, inlet-hole configuration and a semi-open tip, while speeding up design iteration cycles by ~30%.",
        "Running CFD in SolidWorks Flow Simulation and ANSYS Fluent at physiological flow rates (laminar, low Reynolds number), improving velocity-distribution uniformity by ~18% and minimizing recirculation zones linked to obstruction risk.",
        "Applying FEA in Abaqus under physiological pressure loading, reducing peak stress concentrations by ~20% while keeping the geometry manufacturable."
      ],
      journal: "Shunts drain excess cerebrospinal fluid from the brain, but they clog often because tissue gets pulled into the inlet holes and sticks where wall shear stress is low. It's a geometry problem and a fluid-mechanics problem at the same time, which is exactly why I love it."
    },
    {
      id: "parker",
      org: "Parker Hannifin · Fluid Control Division",
      short: "Parker Hannifin",
      role: "Design & Manufacturing Engineer Intern",
      start: "2026-06", end: "2026-08", dates: "Jun 2026 – Aug 2026",
      location: "Madison, MS",
      kind: "industry", building: "factory",
      logo: "parker.jpg",
      skills: ["Kaizen", "5S", "Yamazumi", "Time studies", "Inventor", "SolidWorks", "PLC / HMI", "Test stands"],
      bullets: [
        "Contributed to Kaizen projects generating ~$510K in total savings by optimizing valve-assembly flow, reducing waste, integrating camera-based verification and making operations more sequential and reliable.",
        "Redesigned a production cell: footprint cut from 240 to 108 sq ft and output raised from 13 to 27.2 PPHL through layout optimization, time studies, 5S and Yamazumi analysis.",
        "Developed 20+ standard work sheets, updated routers, and cut changeover time from 100 s to 10 s by replacing an outdated manual test stand with a newly programmed system for pressure decay, mass flow and functional valve testing.",
        "Designed and 3D-printed fixtures and tooling (Autodesk Inventor, SolidWorks, Bambu Lab) and supported PLC / C-More HMI / CLICK automation, including brazing-process monitoring and Dozuki operator guidance."
      ],
      journal: "When the O-ring camera check kept stopping a torque machine, there were no electrical drawings for the cell, so I started a plan to create them. I spent hours with our electrical engineer asking \"why\" about every wire. It's still one of my favorite parts of the summer."
    }
  ],

  /* ------------------------------------------------------------------ */
  projects: [
    {
      id: "drainwatch",
      featured: true,
      title: "DrainWatch",
      subtitle: "Sensor-integrated Jackson-Pratt drain support system",
      role: "Team project · MSU Agricultural & Biological Engineering",
      image: "breadboard_setup.jpg",
      tags: ["Medical device", "Mechatronics", "SolidWorks", "Arduino", "Load cell"],
      summary: "A wearable, non-invasive system that holds a surgical drain steady and tells patients when it's full, with no more guessing, dangling bulbs or hand-written logs.",
      sections: [
        { h: "The problem", p: "Jackson-Pratt (JP) drains pull fluid away from surgical sites after operations like mastectomies. But patients have to empty, measure and log them by hand several times a day. The bulb dangles from clothing, measurements get missed, and suction can be lost, all of which raise the risk of infection or a delayed drain removal.",
          images: [["jackson_pratt_drain_anatomy.jpg", "Anatomy of a Jackson-Pratt drain"], ["prospective_placement.jpg", "How a JP drain is typically worn"], ["manual_tracking.webp", "Today: emptying and measuring by hand"]] },
        { h: "What we built", list: [
          "A SolidWorks-designed, 3D-printed holster that cradles the bulb and stops tubing-induced displacement.",
          "A 5 kg load cell under the holster, read through an HX711 amplifier by an Arduino Uno, estimates fluid volume without ever touching the fluid.",
          "An SSD1306 OLED shows live weight, volume and elapsed time; a vibration motor buzzes at the 100 cc threshold; a push button tares between measurements."
        ] },
        { h: "How it works", formula: "F = m·g = ρ·V·g   →   V = F / (ρ·g)", p: "The load cell measures force. Since mass grows as the drain fills, and m = ρ·V, we can turn force into volume. We calibrated with a known 96.8 g reference (calibration factor −420.46) and assume water-like density for the prototype." },
        { h: "Results", stats: [
          ["96.8 g", "DrainWatch matched the reference scale exactly"],
          ["R² ≈ 1.00", "weight-to-volume relationship"],
          ["100 cc", "haptic alert fired right at threshold"],
          ["~31%", "overall improvement over first prototype"]
        ], images: [["1777004485506_image.png", "Weight vs. volume: y = x, R² = 1"], ["1777005524754_image.png", "Real-time fluid collection over 72 s (R² = 0.98)"]] },
        { h: "Prototype & testing", images: [["IMG_7865.jpeg", "Reference scale: 96.8 g"], ["IMG_7866.jpeg", "DrainWatch reading the same 96.8 g in its printed holster"], ["ba4cedca-baab-47c4-8714-8bcb0574db2c.jpg", "Load cell, HX711 and Arduino wired up"], ["46ec4eb1-eea4-404c-9e9d-a0107f880621.jpg", "OLED showing weight, volume and time"]] },
        { h: "What's next", list: [
          "Integrate everything into a wearable neoprene belt with a custom PCB (KiCad / EasyEDA).",
          "Calibrate for movement and real-world wear, then add Bluetooth/Wi-Fi logging to a phone app.",
          "Support multiple drains and add pressure and temperature sensing for suction-loss and infection cues."
        ] },
        { h: "Poster", images: [["poster.png", "DrainWatch research poster, MSU Agricultural & Biological Engineering"]] }
      ],
      credits: "With Mikayla Jones, Naima Bradley and Anna Geter · MSU Dept. of Agricultural & Biological Engineering · thanks to Dr. Van Den Heever and Laura Geter, RN, BSN.",
      links: [
        { label: "Full technical write-up", href: "drainwatch_final.html" },
        { label: "Request the full report", href: "mailto:pp892@msstate.edu?subject=DrainWatch%20report%20request", kind: "mail" }
      ]
    },
    {
      id: "hand",
      title: "Humanoid Hand",
      subtitle: "Servo-actuated hand for motion replication",
      art: "hand",
      tags: ["SolidWorks", "3D printing", "Arduino", "Servos", "Mechanisms"],
      summary: "A multi-DOF robotic hand that copies human finger motion.",
      sections: [
        { h: "What I did", list: [
          "Designed, modeled and fabricated a multi-DOF humanoid hand in SolidWorks and on a Bambu Lab printer, developing finger linkages and joint mechanisms and iterating for fit, strength, joint mobility and grip.",
          "Integrated Arduino UNO control, servo motors and sensor inputs for synchronized multi-joint motion, improving positional accuracy and responsiveness by ~20% over the first prototype.",
          "Built the hardware and signal-processing pipeline (calibration, motion mapping and real-time visualization) for a prototype that consistently tracks and replicates joint movement."
        ] }
      ]
    },
    {
      id: "shunt",
      title: "Shunt Catheter Redesign",
      subtitle: "CFD + FEA for a less clog-prone brain shunt (CAVS)",
      year: "2026",
      art: "shunt",
      tags: ["CFD", "ANSYS Fluent", "Abaqus", "SolidWorks", "Biomedical"],
      summary: "Re-shaping catheter holes and tips so cerebrospinal fluid keeps flowing.",
      sections: [
        { h: "The problem", p: "Ventricular shunts treat hydrocephalus by draining excess cerebrospinal fluid (CSF) from the brain. They fail often: tissue is pulled into the inlet holes by suction and sticks where wall shear stress is low, slowly clogging the tube and sending patients back to surgery." },
        { h: "My approach", list: [
          "Built catheter geometries in SolidWorks, varying lumen diameter, hole configuration and tip design.",
          "Ran CFD with inlet/outlet pressure conditions to measure flow-rate distribution, velocity profiles, wall shear stress and pressure drop.",
          "Checked structural behavior with FEA in Abaqus under physiological pressure loading.",
          "Compared designs to find geometries that cut suction peaks at holes, spread flow evenly and raise wall shear enough to discourage adhesion."
        ] },
        { h: "Results so far", stats: [["~33%", "fewer simulated stagnation zones"], ["~18%", "more uniform velocity distribution"], ["~20%", "lower peak stress"], ["~30%", "faster design iterations"]] },
        { h: "The physics", formula: "Q = A·v     τ = μ·(du/dy)     Re = ρvD/μ", p: "Continuity, Navier–Stokes (solved by the CFD), wall shear stress and Reynolds number to confirm the flow stays laminar." }
      ]
    },
    {
      id: "desk",
      title: "Desk Assistant",
      subtitle: "A voice-controlled AI helper for my desk",
      art: "desk",
      tags: ["Electronics", "Python", "LLM", "Text-to-speech", "DFM"],
      summary: "Ask it a question out loud and it answers back, while its screen shows stocks, weather, reminders and my calendar.",
      sections: [
        { h: "How it works", list: [
          "A microphone listens for my voice and sends the question to a hosted language model (Gemini, chosen because it's very affordable).",
          "The answer is converted to speech with a text-to-speech model and played through a speaker.",
          "A small screen shows stocks, weather, reminders and calendar info while it waits."
        ] },
        { h: "What I did", p: "I wrote the backend code, integrated the electronics, and modeled the enclosure with design-for-manufacturing in mind so it can be replicated later." }
      ]
    },
    {
      id: "bioprint",
      title: "3D Bioprinted Tumor Models",
      subtitle: "Tumor–bone–vessel constructs (UMMC)",
      year: "2025",
      image: "3dprintedbio.jpg",
      tags: ["Bioprinting", "CELLINK BIO X", "Cell culture"],
      summary: "Printing living tissue scaffolds to study how tumors respond to treatment.",
      sections: [
        { h: "What I did", p: "Used 3D bioprinting (CELLINK BIO X) to create tumor–bone–vessel constructs, alongside 2D/3D organoid and spheroid models, demonstrating scalability and feasibility for translational medicine.", images: [["3dprintedbio.jpg", "A bioprinted lattice in a petri dish"]] }
      ]
    },
    {
      id: "bridge",
      title: "Bridge Design",
      subtitle: "CAD + FEA small-scale truss bridge",
      image: "bridge.png",
      tags: ["SolidWorks", "FEA", "3D printing"],
      summary: "Designed and tested a truss bridge, and learned the hard way about print orientation.",
      sections: [
        { h: "What I did", p: "Designed and tested a small-scale arch-truss bridge, optimizing load distribution and structural integrity with CAD and FEA.", images: [["bridge.png", "Final bridge drawing, SolidWorks"]] },
        { h: "What I learned", p: "It performed great in FEA but the printed bridge came out weak: the layers ran parallel to the main stress, and FEA didn't model infill or layer direction. Now I always ask how a part will actually be made before trusting the simulation." }
      ]
    },
    {
      id: "holder",
      title: "Grocery Bag Holder",
      subtitle: "Ergonomic 3D-printed carry handle",
      image: "holder.png",
      tags: ["SolidWorks", "3D printing", "Ergonomics"],
      summary: "Carry six grocery bags without the plastic cutting into your fingers.",
      sections: [
        { h: "What I did", p: "Created a custom grocery-bag holder with CAD and 3D printing, focusing on ergonomics and ease of carrying for daily use.", images: [["holder.png", "Bag holder drawing with hooks and grip"]] }
      ]
    },
    {
      id: "eeg",
      title: "EEG Study of Fear",
      subtitle: "FPVS responses to high-altitude imagery",
      year: "2024",
      art: "brain",
      tags: ["EEG", "MATLAB", "Experimental design"],
      summary: "Measuring how the brain reacts, implicitly, to heights.",
      sections: [
        { h: "What I did", p: "Designed MATLAB-based EEG protocols and analyzed neural responses to high-altitude imagery, finding a 25–30% increase in neural activity in fear-responsive participants and adding to our understanding of implicit fear processing." }
      ]
    },
    {
      id: "cardio",
      title: "Contactless Heart Monitoring",
      subtitle: "Synchronized ECG + accelerometry",
      year: "2024 – 2025",
      art: "heart",
      tags: ["Human-subject studies", "ECG", "Signal analysis"],
      summary: "Capturing cardiovascular signals without wires on the skin.",
      sections: [
        { h: "What I did", p: "Developed human-subject experimental setups and biosignal acquisition systems for contactless cardiovascular monitoring, using synchronized ECG, pulse oximetry, accelerometry and blood pressure across 25+ sessions." }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  certs: [
    { id: "cswp", title: "Certified SOLIDWORKS Professional (CSWP)", issuer: "Dassault Systèmes", date: "Mar 31, 2026", credId: "C-5DA7M8WTJV",
      image: "cswpcert.png", pdf: "CSWP.pdf", verify: "https://cv.virtualtester.com/qr/?b=SLDWRKS&i=C-5DA7M8WTJV", ribbon: "blue",
      note: "Advanced parametric modeling, complex assemblies and design intent." },
    { id: "cswaam", title: "CSWA: Additive Manufacturing", issuer: "Dassault Systèmes", date: "Feb 20, 2026", credId: "C-E8RTJGS5HA",
      image: "cswaamcert.png", pdf: "CSWA - AM.pdf", verify: "https://cv.virtualtester.com/qr/?b=SLDWRKS&i=C-E8RTJGS5HA", ribbon: "red",
      note: "Design for additive manufacturing, print workflows, material and process selection." },
    { id: "cswa", title: "Certified SOLIDWORKS Associate (CSWA)", issuer: "Dassault Systèmes", date: "Sep 15, 2025", credId: "C-DYL5C34RBT",
      image: "cswacert.png", pdf: "CSWA.pdf", verify: "https://cv.virtualtester.com/qr/?b=SLDWRKS&i=C-DYL5C34RBT", ribbon: "yellow",
      note: "3D modeling, assemblies and engineering drawings." },
    { id: "ace", title: "ACE CNC Machining Training Program", issuer: "America's Cutting Edge · IACMI", date: "Fusion 360 · 0.6 CEUs",
      image: "ace.png", badge: "acelogo.png", ribbon: "purple",
      note: "2-axis and 3-axis CNC workflows, toolpath generation and CAM-to-machine production." },
    { id: "soar", title: "LGS-SOAR Scholar: Interdisciplinary Sciences", issuer: "Emory University · Laney Graduate School", date: "Jul 31, 2025",
      image: "lgscert.png", pdf: "LGS.pdf", badge: "lgs.png", ribbon: "green",
      note: "Research training in academic ethics, medical machine learning, neuroscience and biotechnology." },
    { id: "gdt", title: "GD&T", issuer: "SolidProfessor", date: "", ribbon: "orange",
      note: "Geometric dimensioning & tolerancing." },
    { id: "osha", title: "OSHA 10", issuer: "Occupational Safety & Health Administration", date: "", ribbon: "teal",
      note: "Hazard identification and workplace safety, because safety is part of design, not an afterthought." }
  ],

  /* ------------------------------------------------------------------ */
  /* Skills become constellations in the night sky. level: 1–5.
     "used" lists where each skill shows up (optional). */
  skills: [
    { id: "cad", name: "The Drafting Compass", group: "CAD, CAM & Design", color: "#ffd36e",
      stars: [
        { name: "SolidWorks", level: 5, used: "CSWP · CAVS shunt · DrainWatch · Humanoid hand" },
        { name: "Autodesk Inventor", level: 5, used: "Parker fixtures & schematics" },
        { name: "AutoCAD", level: 5 },
        { name: "Fusion 360 / CAM", level: 5, used: "ACE CNC program · AMS workshops" },
        { name: "GD&T", level: 4, used: "SolidProfessor GD&T · AMS" }
      ] },
    { id: "sim", name: "The River", group: "Simulation & Analysis", color: "#8fd6ff",
      stars: [
        { name: "CFD", level: 4, used: "CAVS shunt catheter" },
        { name: "ANSYS Fluent", level: 4, used: "CAVS shunt catheter" },
        { name: "FEA", level: 4, used: "Bridge · CAVS" },
        { name: "Abaqus", level: 4, used: "CAVS structural analysis" },
        { name: "Minitab", level: 3 },
        { name: "Excel", level: 3, used: "DrainWatch calibration & data" }
      ] },
    { id: "mfg", name: "The Anvil", group: "Manufacturing", color: "#ff9a6b",
      stars: [
        { name: "CNC machining", level: 4, used: "ACE program · AMS (2/3-axis)" },
        { name: "3D printing / additive", level: 4, used: "Parker fixtures · DrainWatch holster" },
        { name: "DFM & DFA", level: 4, used: "AMS workshops · Parker" },
        { name: "Kaizen · 5S · Yamazumi", level: 4, used: "Parker Hannifin" },
        { name: "Time studies & standard work", level: 4, used: "Parker Hannifin" },
        { name: "PLC / HMI", level: 3, used: "Parker test stand & brazing" }
      ] },
    { id: "code", name: "The Circuit", group: "Programming & Electronics", color: "#b6ff8a",
      stars: [
        { name: "Python", level: 4, used: "Desk assistant" },
        { name: "MATLAB", level: 4, used: "EEG study" },
        { name: "Mathematica", level: 4 },
        { name: "Arduino & mechatronics", level: 4, used: "DrainWatch · Humanoid hand" },
        { name: "PCB / EDA design", level: 3, used: "KiCad · EasyEDA" },
        { name: "LabVIEW", level: 3 }
      ] },
    { id: "bio", name: "The Helix", group: "Biomedical Lab", color: "#ffa6d8",
      stars: [
        { name: "Western blot", level: 5, used: "UMMC" },
        { name: "2D/3D cell culture", level: 5, used: "UMMC" },
        { name: "3D bioprinting", level: 4, used: "UMMC" },
        { name: "Immunostaining", level: 4, used: "UMMC" },
        { name: "qRT-PCR & MTT assays", level: 4, used: "UMMC" },
        { name: "Human-subject studies", level: 4, used: "Taebi Lab · NERD" },
        { name: "Mechanical testing (Instron)", level: 4, used: "Polymer Lab" }
      ] }
  ],

  /* ------------------------------------------------------------------ */
  /* Greenhouse hobbies. plant: tulip | daisy | sun | fern | lily | rhodo | clover
     color: petal color. Edit freely! */
  hobbies: [
    { id: "lego", name: "LEGO builds", plant: "tulip", color: "#e8473a", center: "#ffd23f",
      text: "Brick by brick. My manager at Parker and I talked LEGO sets (and board games) on almost every break." },
    { id: "games", name: "Board games", plant: "daisy", color: "#ffffff", center: "#f2b33d",
      text: "Strategy, laughs and a little friendly rivalry. Ask me for a recommendation!" },
    { id: "print", name: "3D printing", plant: "fern", color: "#4fb06d", center: "#2f7a49",
      text: "My Bambu Lab printer makes fixtures for work and little gifts for friends. A mentor once surprised me with holographic prints from her new build plate, and it instantly made my day." },
    { id: "tinker", name: "Tinkering", plant: "sun", color: "#ffcc33", center: "#7a4a25",
      text: "Weekend builds like my voice-controlled desk assistant. If it has a microcontroller, I want to open it up." },
    { id: "teach", name: "Teaching", plant: "lily", color: "#c9a7ff", center: "#fff1a8",
      text: "I tutor Engineering Mechanics, Mechanics of Materials, Thermodynamics and Fluids. Watching Bernoulli's equation finally \"click\" for someone never gets old." },
    { id: "nepal", name: "Home: Nepal", plant: "rhodo", color: "#e2335a", center: "#ffd0dc",
      text: "Rhododendron is Nepal's national flower. Leaving home to study engineering was the biggest decision I've made, and it taught me to adapt, work hard and keep going." },
    { id: "candy", name: "Candy tray", plant: "clover", color: "#ff8fc2", center: "#ffffff",
      text: "There's always a candy tray on my desk. I once counted and found one piece missing, and it made my day. Take one!" }
  ],

  /* ------------------------------------------------------------------ */
  education: {
    school: "Mississippi State University",
    degree: "B.S. Mechanical & Biomedical Engineering",
    grad: "Expected May 2027",
    details: ["Cumulative GPA 4.0 / 4.0", "President's List 2023, 2024, 2025"]
  },

  leadership: [
    { title: "Advanced Manufacturing Society (AMS)", text: "Leading SolidWorks/CSWA prep and design-for-manufacturing workshops; training students on 3D printing, drilling, milling, lathes and 2/3-axis CNC from CAD to finished part." },
    { title: "Tutor, Bagley College of Engineering", text: "One-on-one tutoring in Engineering Mechanics, Mechanics of Materials, Thermodynamics and Fluid Mechanics (2025–present)." },
    { title: "Research co-author", text: "Two papers on assistive robotic systems for mobility and locomotion, analyzing 50+ systems (HEAL Lab)." },
    { title: "Montgomery Leadership Program Scholar", text: "Led fundraising of $2,000 for the Boys & Girls Club (2024–2025)." },
    { title: "LGS-SOAR Scholar", text: "Interdisciplinary research boot camp at Emory University (2025)." }
  ],

  highlights: [
    ["$510K", "Kaizen savings contributed at Parker"],
    ["240 → 108", "sq ft production-cell redesign"],
    ["100 s → 10 s", "changeover after new test stand"],
    ["~33%", "fewer stagnation zones in shunt CFD"]
  ]
};
