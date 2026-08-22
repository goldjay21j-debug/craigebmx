import type { Metadata } from "next";
import { getBikes } from "../../../lib/catalogue";
import { RevealEffects } from "../reveal-effects";
import { StoreFooter } from "../store-footer";
import { StoreHeader } from "../store-header";

export const metadata: Metadata = {
  title: "The History of BMX | Craig's Bikes",
  description: "Ride through the roots of BMX, from early Pedal-Cross racing to freestyle pioneers, big air and the Olympic era.",
};

const historyStories = [
  {
    name: "Scot Breithaupt",
    era: "The racing roots · 1970",
    image: "/history/kotter-bmx-1982.jpg",
    alt: "Vintage Kotter's Racing Team BMX bicycle",
    title: "The organiser who gave BMX a starting gate.",
    copy: "As a teenager in Long Beach, Scot Breithaupt organised early Pedal-Cross races and helped turn backyard imitation motocross into an organised sport.",
    sourceLabel: "USA BMX history",
    sourceUrl: "https://www.usabmx.com/news-and-media/General/2015-07-07/BMX-World-salutes-the-Life-of-a-BMX-Icon?id=1344",
    credit: "Photo: BMX Olli · CC BY-SA 4.0",
  },
  {
    name: "Bob Haro",
    era: "The freestyle blueprint · 1978",
    image: "/history/haro-master-neon-1986.jpg",
    alt: "Neon green 1986 Haro Freestyle Master",
    title: "He turned tricks into a movement.",
    copy: "Bob Haro formed an early freestyle team in 1978 and later developed the first purpose-built freestyle frame and fork—giving a new discipline its own machine.",
    sourceLabel: "Bob Haro’s story",
    sourceUrl: "https://bobharo.com/pages/my-story",
    credit: "Photo: Mcmrose · CC BY-SA 4.0",
  },
  {
    name: "Eddie Fiola",
    era: "The King of the Skateparks · 1980s",
    image: "/products/1987-gt-performer-day-glo-pink/cover.png",
    alt: "Day-Glo Pink 1987 GT Performer BMX bicycle",
    title: "Style, progression and the GT Performer.",
    copy: "Eddie Fiola won five King of the Skateparks titles, four NORA Cups and is credited with the first 540 in a pipe. He also helped shape GT’s iconic Pro Performer.",
    sourceLabel: "USA BMX Hall of Fame",
    sourceUrl: "https://www.usabmx.com/about/hall-of-fame/1524",
    credit: "Craig's Bikes catalogue photograph",
  },
  {
    name: "Mat Hoffman",
    era: "Big air reimagined · 1985 onward",
    image: "/history/mat-hoffman-2006.jpg",
    alt: "Portrait of BMX vert pioneer Mat Hoffman",
    title: "He refused to accept the ceiling.",
    copy: "Hoffman entered freestyle contests as an amateur in 1985, was a top professional while still a teenager and pushed vert into the age of big air.",
    sourceLabel: "Mat Hoffman profile",
    sourceUrl: "https://en.wikipedia.org/wiki/Mat_Hoffman",
    credit: "Photo: Martin Terber · CC BY 2.0",
  },
];

const eras = [
  {
    year: "Late 1960s → 1970",
    title: "Built in dirt",
    copy: "Young riders in Southern California began copying motocross on bicycles. Backyard tracks, jumps and an appetite for speed gave the new sport its spark.",
    image: "/history/bmx-local-race-gate-2013.jpg",
    alt: "BMX riders lined up at the Desert Downs starting gate",
    credit: "Spc. Jarred Woods / U.S. Army · Public domain",
    creditUrl: "https://commons.wikimedia.org/wiki/File:BMX_racing_opportunities_in_El_Paso_130710-A-ZA744-454.jpg",
  },
  {
    year: "1982",
    title: "The world found BMX",
    copy: "Organised racing crossed borders and the first official BMX World Championships arrived in Dayton, Ohio. A local movement had become a world stage.",
    image: "/history/bmx-world-cup-gate-2007.jpg",
    alt: "BMX racers waiting at a World Cup starting gate",
    credit: "Fabrizio Tarizzo · CC BY-SA 2.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Starting_gate_2007_BMX_World_Cup.jpg",
  },
  {
    year: "2008 → today",
    title: "Same nerve. Bigger crowd.",
    copy: "BMX racing entered the Olympic programme at Beijing 2008, with freestyle following at Tokyo 2020. The scale changed; the stoke stayed the same.",
    image: "/history/bmx-munich-mash-2018.jpg",
    alt: "A BMX freestyle rider airborne at the Munich Mash Park Final",
    credit: "Usien · CC BY-SA 3.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Munich_Mash_Festival_2018_BMX_Freestyle_0001.jpg",
  },
];

export const revalidate = 60;

export default async function HistoryPage() {
  const bikes = await getBikes();

  return (
    <div className="page-shell history-page">
      <StoreHeader />
      <main>
        <section className="history-page-hero">
          <div className="history-page-hero-copy" data-reveal>
            <span className="eyebrow light"><i /> The roots, rebels &amp; riders</span>
            <h1>The story of BMX.<br /><em>Forever RAD.</em></h1>
            <p>Before the collector builds and chrome restorations, there were kids in the dirt, riders inventing new lines and originals who refused to accept the limits.</p>
            <div className="history-page-actions">
              <a className="button button-white" href="#timeline">Start at the beginning</a>
              <a className="text-link light-link" href="/shop">Shop the legends <span>→</span></a>
            </div>
          </div>
          <aside data-reveal>
            <span>Craig's Bikes archive</span>
            <strong>Speed. Style. Progression.</strong>
            <small>A short ride through the moments and makers that gave old-school BMX its soul.</small>
          </aside>
        </section>

        <section className="history-era-section" id="timeline">
          <div className="history-era-heading" data-reveal>
            <span className="eyebrow"><i /> From backyard tracks to the world stage</span>
            <h2>One rebel idea.<br />A culture without limits.</h2>
          </div>
          <div className="history-era-list">
            {eras.map((era, index) => (
              <article className="history-era" key={era.year} data-reveal>
                <div className="history-era-image">
                  <img src={era.image} alt={era.alt} />
                  <a href={era.creditUrl} target="_blank" rel="noreferrer">{era.credit} ↗</a>
                </div>
                <div className="history-era-copy">
                  <small>{String(index + 1).padStart(2, "0")} · {era.year}</small>
                  <h3>{era.title}</h3>
                  <p>{era.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="history-section history-page-legends">
          <div className="history-intro" data-reveal>
            <span className="eyebrow light"><i /> The people behind the progression</span>
            <h2>Before the legends,<br /><em>there were riders.</em></h2>
            <p>Racers, designers and fearless innovators shaped BMX into a culture of speed, invention and individual style. Meet four who pushed it forward.</p>
          </div>

          <div className="history-timeline" aria-label="A short history of BMX" data-reveal>
            <span><b>1970</b><small>Early Pedal-Cross races</small></span><i />
            <span><b>1978</b><small>Freestyle team era begins</small></span><i />
            <span><b>1982</b><small>Purpose-built freestyle bikes</small></span><i />
            <span><b>1985</b><small>Big-air generation emerges</small></span>
          </div>

          <div className="history-grid">
            {historyStories.map((story, index) => (
              <article className={`history-card history-card-${index + 1}`} key={story.name} data-reveal>
                <div className="history-image">
                  <img src={story.image} alt={story.alt} />
                  <span>{story.era}</span>
                </div>
                <div className="history-card-copy">
                  <small>{String(index + 1).padStart(2, "0")} · {story.name}</small>
                  <h3>{story.title}</h3>
                  <p>{story.copy}</p>
                  <div><a href={story.sourceUrl} target="_blank" rel="noreferrer">{story.sourceLabel} ↗</a><em>{story.credit}</em></div>
                </div>
              </article>
            ))}
          </div>

          <div className="history-note" data-reveal>
            <p>History notes are editorial context, not product provenance. Licensed archival images are credited to their creators; the Eddie Fiola story is represented by the GT Performer rather than a restricted portrait.</p>
          </div>
        </section>

        <section className="history-page-cta" data-reveal>
          <span className="eyebrow light"><i /> Keep the stoke alive</span>
          <h2>Ride the history.<br />Own a piece of it.</h2>
          <p>Explore original golden-era BMX bikes with full galleries, collector details and worldwide order support.</p>
          <a className="button button-white" href="/shop">Shop all classic bikes <span>→</span></a>
        </section>
      </main>
      <StoreFooter bikes={bikes} />
      <RevealEffects />
    </div>
  );
}
