import { useState, useMemo } from "react";

const SENATORS = {
  "Alsobrooks": { first: "Angela D.", party: "D", state: "MD", phone: "202-224-4524", address: "374 Russell Senate Office Building, Washington DC 20510" },
  "Armstrong": { first: "Alan", party: "R", state: "OK", phone: "202-224-4721", address: "SH330 Hart Senate Office Building, Washington DC 20510" },
  "Baldwin": { first: "Tammy", party: "D", state: "WI", phone: "202-224-5653", address: "141 Hart Senate Office Building, Washington DC 20510" },
  "Banks": { first: "Jim", party: "R", state: "IN", phone: "202-224-4814", address: "303 Hart Senate Office Building, Washington DC 20510" },
  "Barrasso": { first: "John", party: "R", state: "WY", phone: "202-224-6441", address: "307 Dirksen Senate Office Building, Washington DC 20510" },
  "Bennet": { first: "Michael F.", party: "D", state: "CO", phone: "202-224-5852", address: "261 Russell Senate Office Building, Washington DC 20510" },
  "Blackburn": { first: "Marsha", party: "R", state: "TN", phone: "202-224-3344", address: "357 Dirksen Senate Office Building, Washington DC 20510" },
  "Blumenthal": { first: "Richard", party: "D", state: "CT", phone: "202-224-2823", address: "503 Hart Senate Office Building, Washington DC 20510" },
  "Blunt Rochester": { first: "Lisa", party: "D", state: "DE", phone: "202-224-2441", address: "513 Hart Senate Office Building, Washington DC 20510" },
  "Booker": { first: "Cory A.", party: "D", state: "NJ", phone: "202-224-3224", address: "306 Hart Senate Office Building, Washington DC 20510" },
  "Boozman": { first: "John", party: "R", state: "AR", phone: "202-224-4843", address: "555 Dirksen Senate Office Building, Washington DC 20510" },
  "Britt": { first: "Katie Boyd", party: "R", state: "AL", phone: "202-224-5744", address: "416 Russell Senate Office Building, Washington DC 20510" },
  "Budd": { first: "Ted", party: "R", state: "NC", phone: "202-224-3154", address: "354 Russell Senate Office Building, Washington DC 20510" },
  "Cantwell": { first: "Maria", party: "D", state: "WA", phone: "202-224-3441", address: "511 Hart Senate Office Building, Washington DC 20510" },
  "Capito": { first: "Shelley Moore", party: "R", state: "WV", phone: "202-224-6472", address: "170 Russell Senate Office Building, Washington DC 20510" },
  "Cassidy": { first: "Bill", party: "R", state: "LA", phone: "202-224-5824", address: "455 Dirksen Senate Office Building, Washington DC 20510" },
  "Collins": { first: "Susan M.", party: "R", state: "ME", phone: "202-224-2523", address: "413 Dirksen Senate Office Building, Washington DC 20510" },
  "Coons": { first: "Christopher A.", party: "D", state: "DE", phone: "202-224-5042", address: "218 Russell Senate Office Building, Washington DC 20510" },
  "Cornyn": { first: "John", party: "R", state: "TX", phone: "202-224-2934", address: "517 Hart Senate Office Building, Washington DC 20510" },
  "Cortez Masto": { first: "Catherine", party: "D", state: "NV", phone: "202-224-3542", address: "309 Hart Senate Office Building, Washington DC 20510" },
  "Cotton": { first: "Tom", party: "R", state: "AR", phone: "202-224-2353", address: "326 Russell Senate Office Building, Washington DC 20510" },
  "Cramer": { first: "Kevin", party: "R", state: "ND", phone: "202-224-2043", address: "313 Hart Senate Office Building, Washington DC 20510" },
  "Crapo": { first: "Mike", party: "R", state: "ID", phone: "202-224-6142", address: "239 Dirksen Senate Office Building, Washington DC 20510" },
  "Cruz": { first: "Ted", party: "R", state: "TX", phone: "202-224-5922", address: "167 Russell Senate Office Building, Washington DC 20510" },
  "Curtis": { first: "John R.", party: "R", state: "UT", phone: "202-224-5251", address: "502 Hart Senate Office Building, Washington DC 20510" },
  "Daines": { first: "Steve", party: "R", state: "MT", phone: "202-224-2651", address: "320 Hart Senate Office Building, Washington DC 20510" },
  "Duckworth": { first: "Tammy", party: "D", state: "IL", phone: "202-224-2854", address: "524 Hart Senate Office Building, Washington DC 20510" },
  "Durbin": { first: "Richard J.", party: "D", state: "IL", phone: "202-224-2152", address: "711 Hart Senate Office Building, Washington DC 20510" },
  "Ernst": { first: "Joni", party: "R", state: "IA", phone: "202-224-3254", address: "260 Russell Senate Office Building, Washington DC 20510" },
  "Fetterman": { first: "John", party: "D", state: "PA", phone: "202-224-4254", address: "142 Russell Senate Office Building, Washington DC 20510" },
  "Fischer": { first: "Deb", party: "R", state: "NE", phone: "202-224-6551", address: "448 Russell Senate Office Building, Washington DC 20510" },
  "Gallego": { first: "Ruben", party: "D", state: "AZ", phone: "202-224-4521", address: "302 Hart Senate Office Building, Washington DC 20510" },
  "Gillibrand": { first: "Kirsten E.", party: "D", state: "NY", phone: "202-224-4451", address: "478 Russell Senate Office Building, Washington DC 20510" },
  "Graham": { first: "Lindsey", party: "R", state: "SC", phone: "202-224-5972", address: "211 Russell Senate Office Building, Washington DC 20510" },
  "Grassley": { first: "Chuck", party: "R", state: "IA", phone: "202-224-3744", address: "135 Hart Senate Office Building, Washington DC 20510" },
  "Hagerty": { first: "Bill", party: "R", state: "TN", phone: "202-224-4944", address: "251 Russell Senate Office Building, Washington DC 20510" },
  "Hassan": { first: "Margaret Wood", party: "D", state: "NH", phone: "202-224-3324", address: "324 Hart Senate Office Building, Washington DC 20510" },
  "Hawley": { first: "Josh", party: "R", state: "MO", phone: "202-224-6154", address: "381 Russell Senate Office Building, Washington DC 20510" },
  "Heinrich": { first: "Martin", party: "D", state: "NM", phone: "202-224-5521", address: "709 Hart Senate Office Building, Washington DC 20510" },
  "Hickenlooper": { first: "John W.", party: "D", state: "CO", phone: "202-224-5941", address: "316 Hart Senate Office Building, Washington DC 20510" },
  "Hirono": { first: "Mazie K.", party: "D", state: "HI", phone: "202-224-6361", address: "109 Hart Senate Office Building, Washington DC 20510" },
  "Hoeven": { first: "John", party: "R", state: "ND", phone: "202-224-2551", address: "338 Russell Senate Office Building, Washington DC 20510" },
  "Husted": { first: "Jon", party: "R", state: "OH", phone: "202-224-3353", address: "304 Russell Senate Office Building, Washington DC 20510" },
  "Hyde-Smith": { first: "Cindy", party: "R", state: "MS", phone: "202-224-5054", address: "528 Hart Senate Office Building, Washington DC 20510" },
  "Johnson": { first: "Ron", party: "R", state: "WI", phone: "202-224-5323", address: "328 Hart Senate Office Building, Washington DC 20510" },
  "Justice": { first: "James C.", party: "R", state: "WV", phone: "202-224-3954", address: "509 Hart Senate Office Building, Washington DC 20510" },
  "Kaine": { first: "Tim", party: "D", state: "VA", phone: "202-224-4024", address: "231 Russell Senate Office Building, Washington DC 20510" },
  "Kelly": { first: "Mark", party: "D", state: "AZ", phone: "202-224-2235", address: "516 Hart Senate Office Building, Washington DC 20510" },
  "Kennedy": { first: "John", party: "R", state: "LA", phone: "202-224-4623", address: "437 Russell Senate Office Building, Washington DC 20510" },
  "Kim": { first: "Andy", party: "D", state: "NJ", phone: "202-224-4744", address: "520 Hart Senate Office Building, Washington DC 20510" },
  "King": { first: "Angus S.", party: "I", state: "ME", phone: "202-224-5344", address: "133 Hart Senate Office Building, Washington DC 20510" },
  "Klobuchar": { first: "Amy", party: "D", state: "MN", phone: "202-224-3244", address: "425 Dirksen Senate Office Building, Washington DC 20510" },
  "Lankford": { first: "James", party: "R", state: "OK", phone: "202-224-5754", address: "731 Hart Senate Office Building, Washington DC 20510" },
  "Lee": { first: "Mike", party: "R", state: "UT", phone: "202-224-5444", address: "363 Russell Senate Office Building, Washington DC 20510" },
  "Luján": { first: "Ben Ray", party: "D", state: "NM", phone: "202-224-6621", address: "498 Russell Senate Office Building, Washington DC 20510" },
  "Lummis": { first: "Cynthia M.", party: "R", state: "WY", phone: "202-224-3424", address: "127A Russell Senate Office Building, Washington DC 20510" },
  "Markey": { first: "Edward J.", party: "D", state: "MA", phone: "202-224-2742", address: "255 Dirksen Senate Office Building, Washington DC 20510" },
  "Marshall": { first: "Roger", party: "R", state: "KS", phone: "202-224-4774", address: "479A Russell Senate Office Building, Washington DC 20510" },
  "McConnell": { first: "Mitch", party: "R", state: "KY", phone: "202-224-2541", address: "317 Russell Senate Office Building, Washington DC 20510" },
  "McCormick": { first: "David", party: "R", state: "PA", phone: "202-224-6324", address: "702 Hart Senate Office Building, Washington DC 20510" },
  "Merkley": { first: "Jeff", party: "D", state: "OR", phone: "202-224-3753", address: "531 Hart Senate Office Building, Washington DC 20510" },
  "Moody": { first: "Ashley", party: "R", state: "FL", phone: "202-224-3041", address: "387 Russell Senate Office Building, Washington DC 20510" },
  "Moran": { first: "Jerry", party: "R", state: "KS", phone: "202-224-6521", address: "521 Dirksen Senate Office Building, Washington DC 20510" },
  "Moreno": { first: "Bernie", party: "R", state: "OH", phone: "202-224-2315", address: "284 Russell Senate Office Building, Washington DC 20510" },
  "Murkowski": { first: "Lisa", party: "R", state: "AK", phone: "202-224-6665", address: "522 Hart Senate Office Building, Washington DC 20510" },
  "Murphy": { first: "Christopher", party: "D", state: "CT", phone: "202-224-4041", address: "136 Hart Senate Office Building, Washington DC 20510" },
  "Murray": { first: "Patty", party: "D", state: "WA", phone: "202-224-2621", address: "154 Russell Senate Office Building, Washington DC 20510" },
  "Ossoff": { first: "Jon", party: "D", state: "GA", phone: "202-224-3521", address: "317 Hart Senate Office Building, Washington DC 20510" },
  "Padilla": { first: "Alex", party: "D", state: "CA", phone: "202-224-3553", address: "331 Hart Senate Office Building, Washington DC 20510" },
  "Paul": { first: "Rand", party: "R", state: "KY", phone: "202-224-4343", address: "295 Russell Senate Office Building, Washington DC 20510" },
  "Peters": { first: "Gary C.", party: "D", state: "MI", phone: "202-224-6221", address: "724 Hart Senate Office Building, Washington DC 20510" },
  "Reed": { first: "Jack", party: "D", state: "RI", phone: "202-224-4642", address: "728 Hart Senate Office Building, Washington DC 20510" },
  "Ricketts": { first: "Pete", party: "R", state: "NE", phone: "202-224-4224", address: "139 Russell Senate Office Building, Washington DC 20510" },
  "Risch": { first: "James E.", party: "R", state: "ID", phone: "202-224-2752", address: "483 Russell Senate Office Building, Washington DC 20510" },
  "Rosen": { first: "Jacky", party: "D", state: "NV", phone: "202-224-6244", address: "713 Hart Senate Office Building, Washington DC 20510" },
  "Rounds": { first: "Mike", party: "R", state: "SD", phone: "202-224-5842", address: "716 Hart Senate Office Building, Washington DC 20510" },
  "Sanders": { first: "Bernard", party: "I", state: "VT", phone: "202-224-5141", address: "332 Dirksen Senate Office Building, Washington DC 20510" },
  "Schatz": { first: "Brian", party: "D", state: "HI", phone: "202-224-3934", address: "722 Hart Senate Office Building, Washington DC 20510" },
  "Schiff": { first: "Adam B.", party: "D", state: "CA", phone: "202-224-3841", address: "112 Hart Senate Office Building, Washington DC 20510" },
  "Schmitt": { first: "Eric", party: "R", state: "MO", phone: "202-224-5721", address: "404 Russell Senate Office Building, Washington DC 20510" },
  "Schumer": { first: "Charles E.", party: "D", state: "NY", phone: "202-224-6542", address: "322 Hart Senate Office Building, Washington DC 20510" },
  "Scott (FL)": { first: "Rick", party: "R", state: "FL", phone: "202-224-5274", address: "110 Hart Senate Office Building, Washington DC 20510" },
  "Scott (SC)": { first: "Tim", party: "R", state: "SC", phone: "202-224-6121", address: "104 Hart Senate Office Building, Washington DC 20510" },
  "Shaheen": { first: "Jeanne", party: "D", state: "NH", phone: "202-224-2841", address: "506 Hart Senate Office Building, Washington DC 20510" },
  "Sheehy": { first: "Tim", party: "R", state: "MT", phone: "202-224-2644", address: "124 Russell Senate Office Building, Washington DC 20510" },
  "Slotkin": { first: "Elissa", party: "D", state: "MI", phone: "202-224-4822", address: "291 Russell Senate Office Building, Washington DC 20510" },
  "Smith": { first: "Tina", party: "D", state: "MN", phone: "202-224-5641", address: "720 Hart Senate Office Building, Washington DC 20510" },
  "Sullivan": { first: "Dan", party: "R", state: "AK", phone: "202-224-3004", address: "706 Hart Senate Office Building, Washington DC 20510" },
  "Thune": { first: "John", party: "R", state: "SD", phone: "202-224-2321", address: "511 Dirksen Senate Office Building, Washington DC 20510" },
  "Tillis": { first: "Thom", party: "R", state: "NC", phone: "202-224-6342", address: "113 Dirksen Senate Office Building, Washington DC 20510" },
  "Tuberville": { first: "Tommy", party: "R", state: "AL", phone: "202-224-4124", address: "455 Russell Senate Office Building, Washington DC 20510" },
  "Van Hollen": { first: "Chris", party: "D", state: "MD", phone: "202-224-4654", address: "730 Hart Senate Office Building, Washington DC 20510" },
  "Warner": { first: "Mark R.", party: "D", state: "VA", phone: "202-224-2023", address: "703 Hart Senate Office Building, Washington DC 20510" },
  "Warnock": { first: "Raphael G.", party: "D", state: "GA", phone: "202-224-3643", address: "717 Hart Senate Office Building, Washington DC 20510" },
  "Warren": { first: "Elizabeth", party: "D", state: "MA", phone: "202-224-4543", address: "311 Hart Senate Office Building, Washington DC 20510" },
  "Welch": { first: "Peter", party: "D", state: "VT", phone: "202-224-4242", address: "115 Russell Senate Office Building, Washington DC 20510" },
  "Whitehouse": { first: "Sheldon", party: "D", state: "RI", phone: "202-224-2921", address: "530 Hart Senate Office Building, Washington DC 20510" },
  "Wicker": { first: "Roger F.", party: "R", state: "MS", phone: "202-224-6253", address: "425 Russell Senate Office Building, Washington DC 20510" },
  "Wyden": { first: "Ron", party: "D", state: "OR", phone: "202-224-5244", address: "221 Dirksen Senate Office Building, Washington DC 20510" },
  "Young": { first: "Todd", party: "R", state: "IN", phone: "202-224-5623", address: "185 Dirksen Senate Office Building, Washington DC 20510" },
};

// Helper to resolve Scott by state
function resolveSenator(lastName, stateHint) {
  if (lastName === "Scott") {
    if (stateHint === "FL") return SENATORS["Scott (FL)"];
    if (stateHint === "SC") return SENATORS["Scott (SC)"];
    return SENATORS["Scott (FL)"];
  }
  return SENATORS[lastName] || null;
}

const COMMITTEES = [
  {
    id: "agriculture",
    name: "Agriculture, Nutrition & Forestry",
    chair: "Boozman (R-AR)",
    majority: ["Boozman","McConnell","Hoeven","Ernst","Hyde-Smith","Marshall","Tuberville","Justice","Grassley","Thune","Fischer","Moran"],
    minority: ["Klobuchar","Bennet","Smith","Durbin","Booker","Luján","Warnock","Welch","Fetterman","Schiff","Slotkin"],
  },
  {
    id: "appropriations",
    name: "Appropriations",
    chair: "Collins (R-ME)",
    majority: ["Collins","McConnell","Murkowski","Graham","Moran","Hoeven","Boozman","Capito","Kennedy","Hyde-Smith","Hagerty","Britt","Fischer","Rounds","Husted"],
    minority: ["Murray","Durbin","Reed","Shaheen","Merkley","Coons","Schatz","Baldwin","Murphy","Van Hollen","Heinrich","Peters","Gillibrand","Ossoff"],
  },
  {
    id: "armed-services",
    name: "Armed Services",
    chair: "Wicker (R-MS)",
    majority: ["Wicker","Fischer","Cotton","Rounds","Ernst","Sullivan","Cramer","Scott (FL)","Tuberville","Budd","Schmitt","Banks","Sheehy","Moody"],
    minority: ["Reed","Shaheen","Gillibrand","Blumenthal","Hirono","Kaine","King","Warren","Peters","Duckworth","Rosen","Kelly","Slotkin"],
  },
  {
    id: "banking",
    name: "Banking, Housing & Urban Affairs",
    chair: "Scott (SC-R)",
    majority: ["Scott (SC)","Crapo","Rounds","Tillis","Kennedy","Hagerty","Lummis","Britt","Ricketts","Banks","Cramer","Moreno","McCormick"],
    minority: ["Warren","Reed","Warner","Van Hollen","Cortez Masto","Smith","Warnock","Kim","Gallego","Blunt Rochester","Alsobrooks"],
  },
  {
    id: "budget",
    name: "Budget",
    chair: "Graham (R-SC)",
    majority: ["Graham","Grassley","Crapo","Johnson","Marshall","Cornyn","Lee","Kennedy","Ricketts","Moreno","Scott (FL)"],
    minority: ["Merkley","Murray","Wyden","Sanders","Whitehouse","Warner","Bennet","Warnock","Ossoff","Luján"],
  },
  {
    id: "commerce",
    name: "Commerce, Science & Transportation",
    chair: "Cruz (R-TX)",
    majority: ["Cruz","Thune","Wicker","Fischer","Moran","Sullivan","Blackburn","Young","Budd","Schmitt","Curtis","Moreno","Sheehy","Capito","Lummis"],
    minority: ["Cantwell","Klobuchar","Schatz","Markey","Peters","Baldwin","Duckworth","Rosen","Luján","Hickenlooper","Fetterman","Kim","Blunt Rochester"],
  },
  {
    id: "energy",
    name: "Energy & Natural Resources",
    chair: "Lee (R-UT)",
    majority: ["Lee","Barrasso","Risch","Daines","Cotton","McCormick","Justice","Cassidy","Hyde-Smith","Murkowski","Hoeven"],
    minority: ["Heinrich","Wyden","Cantwell","Hirono","King","Cortez Masto","Hickenlooper","Padilla","Gallego"],
  },
  {
    id: "environment",
    name: "Environment & Public Works",
    chair: "Capito (R-WV)",
    majority: ["Capito","Cramer","Lummis","Curtis","Graham","Sullivan","Ricketts","Wicker","Boozman","Husted"],
    minority: ["Whitehouse","Sanders","Merkley","Markey","Kelly","Padilla","Schiff","Blunt Rochester","Alsobrooks"],
  },
  {
    id: "finance",
    name: "Finance",
    chair: "Crapo (R-ID)",
    majority: ["Crapo","Grassley","Cornyn","Thune","Scott (SC)","Cassidy","Lankford","Daines","Young","Barrasso","Johnson","Tillis","Blackburn","Marshall"],
    minority: ["Wyden","Cantwell","Bennet","Warner","Whitehouse","Hassan","Cortez Masto","Warren","Sanders","Smith","Luján","Warnock","Welch"],
  },
  {
    id: "foreign-relations",
    name: "Foreign Relations",
    chair: "Risch (R-ID)",
    majority: ["Risch","Ricketts","McCormick","Daines","Hagerty","Barrasso","Lee","Paul","Cruz","Scott (FL)","Curtis","Cornyn"],
    minority: ["Shaheen","Coons","Murphy","Kaine","Merkley","Booker","Schatz","Van Hollen","Duckworth","Rosen"],
  },
  {
    id: "help",
    name: "Health, Education, Labor & Pensions (HELP)",
    chair: "Cassidy (R-LA)",
    majority: ["Cassidy","Paul","Collins","Murkowski","Marshall","Scott (SC)","Hawley","Tuberville","Banks","Husted","Moody","Armstrong"],
    minority: ["Sanders","Murray","Baldwin","Murphy","Kaine","Hassan","Hickenlooper","Markey","Kim","Blunt Rochester","Alsobrooks"],
  },
  {
    id: "homeland-security",
    name: "Homeland Security & Governmental Affairs",
    chair: "Paul (R-KY)",
    majority: ["Paul","Johnson","Lankford","Scott (FL)","Hawley","Moreno","Ernst","Moody"],
    minority: ["Peters","Hassan","Blumenthal","Fetterman","Kim","Gallego","Slotkin"],
  },
  {
    id: "judiciary",
    name: "Judiciary",
    chair: "Grassley (R-IA)",
    majority: ["Grassley","Graham","Cornyn","Lee","Cruz","Hawley","Tillis","Kennedy","Blackburn","Schmitt","Britt","Moody"],
    minority: ["Durbin","Whitehouse","Klobuchar","Coons","Blumenthal","Hirono","Booker","Padilla","Welch","Schiff"],
  },
  {
    id: "rules",
    name: "Rules & Administration",
    chair: "McConnell (R-KY)",
    majority: ["McConnell","Cruz","Capito","Wicker","Fischer","Hyde-Smith","Hagerty","Britt","Boozman"],
    minority: ["Padilla","Schumer","Warner","Klobuchar","Merkley","Ossoff","Bennet","Welch"],
  },
  {
    id: "small-business",
    name: "Small Business & Entrepreneurship",
    chair: "Ernst (R-IA)",
    majority: ["Ernst","Risch","Paul","Scott (SC)","Young","Hawley","Budd","Curtis","Justice","Husted"],
    minority: ["Markey","Cantwell","Shaheen","Booker","Coons","Hirono","Rosen","Hickenlooper","Schiff"],
  },
  {
    id: "intelligence",
    name: "Select Committee on Intelligence",
    chair: "Cotton (R-AR)",
    majority: ["Cotton","Risch","Collins","Cornyn","Moran","Lankford","Rounds","Young","Budd"],
    minority: ["Warner","Wyden","Heinrich","King","Bennet","Gillibrand","Ossoff","Kelly"],
  },
  {
    id: "veterans",
    name: "Veterans' Affairs",
    chair: "Moran (R-KS)",
    majority: ["Moran","Boozman","Cassidy","Tillis","Sullivan","Blackburn","Cramer","Tuberville","Banks","Sheehy"],
    minority: ["Blumenthal","Murray","Sanders","Hirono","Hassan","King","Duckworth","Gallego","Slotkin"],
  },
];

function getSenatorInfo(lastName) {
  const stateMatch = lastName.match(/\(([A-Z]{2})\)$/);
  if (stateMatch) {
    const state = stateMatch[1];
    const cleanName = lastName.replace(/\s*\([^)]+\)$/, "").trim();
    return resolveSenator(cleanName, state);
  }
  if (SENATORS[lastName]) return SENATORS[lastName];
  const resolved = resolveSenator(lastName, null);
  return resolved;
}

function partyColor(party) {
  if (party === "R") return "var(--party-r)";
  if (party === "D") return "var(--party-d)";
  return "var(--party-i)";
}

function partyLabel(party, state) {
  return `${party}-${state}`;
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const markCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const handleCopy = () => {
    // Prefer the async Clipboard API (secure contexts), fall back to a
    // temporary textarea + execCommand for http / older browsers.
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };
  const fallbackCopy = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      markCopied();
    } catch {
      /* clipboard unavailable — leave the button in its default state */
    }
  };
  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      style={{
        background: copied ? "rgba(40,90,50,0.5)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${copied ? "rgba(80,160,80,0.4)" : "var(--border-gold)"}`,
        borderRadius: "3px",
        color: copied ? "#80c880" : "#7a8a98",
        fontSize: "10px",
        padding: "2px 6px",
        cursor: "pointer",
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "all 0.2s",
        lineHeight: "1.4",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function SenatorRow({ lastName }) {
  const info = getSenatorInfo(lastName);
  if (!info) return null;
  const { first, party, state, phone, address } = info;
  const displayName = lastName.replace(/\s*\([^)]+\)$/, "");
  const tag = partyLabel(party, state);
  const color = partyColor(party);

  return (
    <div style={{
      padding: "10px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontSize: "13px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
        <span style={{
          display: "inline-block",
          padding: "2px 7px",
          borderRadius: "3px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.04em",
          background: color,
          color: "var(--cream)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{tag}</span>
        <span style={{ color: "var(--parchment)", fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: "600" }}>
          {first} {displayName}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px", paddingLeft: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <a href={`tel:${phone}`} style={{
            color: "var(--link)",
            textDecoration: "none",
            fontFamily: "'Courier Prime', 'Courier New', monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}>{phone}</a>
          <CopyButton text={phone} label="phone" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#6a7a88", fontSize: "11px" }}>·</span>
          <span style={{ color: "#8a9aaa", fontSize: "12px", lineHeight: "1.4" }}>{address}</span>
          <CopyButton text={address} label="address" />
        </div>
      </div>
    </div>
  );
}

function CommitteePanel({ committee, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const allMembers = [...committee.majority, ...committee.minority];
  const uniqueMembers = [...new Set(allMembers)];

  return (
    <div style={{
      marginBottom: "10px",
      border: "1px solid var(--border-gold)",
      borderRadius: "6px",
      overflow: "hidden",
      background: "rgba(10,18,30,0.6)",
      boxShadow: open ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
      transition: "box-shadow 0.3s",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: open ? "rgba(60,40,20,0.4)" : "rgba(20,30,45,0.6)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? "1px solid var(--border-gold-strong)" : "none",
          transition: "background 0.2s",
        }}
      >
        <div>
          <span style={{
            color: "var(--gold)",
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "0.02em",
          }}>{committee.name}</span>
          <span style={{
            marginLeft: "14px",
            color: "#6b8090",
            fontSize: "12px",
            fontFamily: "'Courier Prime', monospace",
          }}>{uniqueMembers.length} senators</span>
        </div>
        <span style={{
          color: "var(--gold)",
          fontSize: "18px",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s",
          lineHeight: 1,
        }}>▾</span>
      </button>

      {open && (
        <div>
          <div style={{
            padding: "6px 16px 4px",
            borderBottom: "1px solid var(--border-gold-faint)",
            display: "flex",
            gap: "24px",
          }}>
            <span style={{ color: "#6b7a88", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>Senator</span>
            <span style={{ color: "#6b7a88", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>Phone · DC Mailing Address</span>
          </div>
          <div style={{ background: "rgba(5,12,22,0.5)" }}>
            {committee.majority.map(name => <SenatorRow key={`maj-${name}`} lastName={name} />)}
            <div style={{ height: "1px", background: "var(--border-gold-faint)", margin: "2px 0" }} />
            {committee.minority.map(name => <SenatorRow key={`min-${name}`} lastName={name} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [filterParty, setFilterParty] = useState("all");
  const [filterState, setFilterState] = useState("");

  const filtered = useMemo(() => {
    if (!search && filterParty === "all" && !filterState) return COMMITTEES;

    return COMMITTEES.map(c => {
      const filterMember = (name) => {
        const info = getSenatorInfo(name);
        if (!info) return false;
        const { first, party, state } = info;
        const displayName = name.replace(/\s*\([^)]+\)$/, "");
        const fullName = `${first} ${displayName}`.toLowerCase();
        const matchSearch = !search || fullName.includes(search.toLowerCase()) || state.toLowerCase().includes(search.toLowerCase());
        const matchParty = filterParty === "all" || party === filterParty;
        const matchState = !filterState || state.toLowerCase() === filterState.toLowerCase();
        return matchSearch && matchParty && matchState;
      };
      const maj = c.majority.filter(filterMember);
      const min = c.minority.filter(filterMember);
      if (maj.length === 0 && min.length === 0) return null;
      return { ...c, majority: maj, minority: min };
    }).filter(Boolean);
  }, [search, filterParty, filterState]);

  const allStates = useMemo(() => {
    const states = new Set();
    Object.values(SENATORS).forEach(s => states.add(s.state));
    return [...states].sort();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-navy)",
      backgroundImage: "radial-gradient(ellipse at 20% 0%, rgba(30,50,80,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(80,30,20,0.25) 0%, transparent 60%)",
      fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif",
      color: "var(--ink)",
    }}>
      {/* Slim sticky header */}
      <header style={{
        padding: "calc(10px + env(safe-area-inset-top)) 20px 10px",
        borderBottom: "1px solid var(--border-gold)",
        background: "rgba(6,13,25,0.95)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#6a5a40", fontWeight: "700", textTransform: "uppercase", marginBottom: "2px" }}>119th Congress · 2025–2026</div>
          <h1 style={{
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            fontSize: "clamp(14px, 2.5vw, 18px)",
            color: "var(--cream)",
            margin: 0,
            fontWeight: "700",
            lineHeight: 1.2,
          }}>
            Senate Oversight <span style={{ color: "var(--gold)" }}>Contact Directory</span>
          </h1>
        </div>
      </header>

      {/* Committees */}
      <main style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "14px 16px 40px" }}>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search senator or state…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "7px 12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-gold-strong)",
              borderRadius: "4px",
              color: "var(--parchment)",
              fontSize: "13px",
              outline: "none",
              flex: "1 1 140px",
              minWidth: "120px",
            }}
          />
          <select
            value={filterParty}
            onChange={e => setFilterParty(e.target.value)}
            style={{
              padding: "7px 10px",
              background: "rgba(10,18,30,0.9)",
              border: "1px solid var(--border-gold-strong)",
              borderRadius: "4px",
              color: "var(--parchment)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <option value="all">All Parties</option>
            <option value="R">Republican</option>
            <option value="D">Democrat</option>
            <option value="I">Independent</option>
          </select>
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            style={{
              padding: "7px 10px",
              background: "rgba(10,18,30,0.9)",
              border: "1px solid var(--border-gold-strong)",
              borderRadius: "4px",
              color: "var(--parchment)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <option value="">All States</option>
            {allStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(search || filterParty !== "all" || filterState) && (
            <button
              onClick={() => { setSearch(""); setFilterParty("all"); setFilterState(""); }}
              style={{
                padding: "7px 10px",
                background: "rgba(139,26,26,0.25)",
                border: "1px solid rgba(139,26,26,0.4)",
                borderRadius: "4px",
                color: "#d08080",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >✕ Clear</button>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" }}>
          {[["R","var(--party-r)","Republican"],["D","var(--party-d)","Democrat"],["I","var(--party-i)","Independent"]].map(([party, color, label]) => (
            <div key={party} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "26px", padding: "2px 0", textAlign: "center", background: color, color: "var(--cream)", fontSize: "11px", fontWeight: "700", borderRadius: "3px" }}>{party}</span>
              <span style={{ color: "#5a6870", fontSize: "12px" }}>{label}</span>
            </div>
          ))}
          <span style={{ color: "#3a4a58", fontSize: "11px", marginLeft: "auto" }}>Majority first · tap to expand</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#4a5a68" }}>
            No results match your filters.
          </div>
        ) : (
          filtered.map((c, i) => (
            <CommitteePanel key={c.id} committee={c} defaultOpen={false} />
          ))
        )}
      </main>

      <footer style={{
        borderTop: "1px solid var(--border-gold-faint)",
        padding: "20px 32px",
        textAlign: "center",
        color: "#3a4a58",
        fontSize: "11px",
        letterSpacing: "0.05em",
      }}>
        SOURCE: senate.gov · Members sourced June 2026 · Committee membership subject to change
        <br />
        US Capitol Switchboard: 202-224-3121
      </footer>
    </div>
  );
}
