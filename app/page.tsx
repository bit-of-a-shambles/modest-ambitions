export default function Home() {
  return (
    <main>
      <header>
        <p className="status">
          <span aria-hidden="true">●</span> independent &amp; bootstrapped
        </p>
        <h1>Modest Ambitions</h1>
        <p className="lede">A small software startup studio.</p>
      </header>

      <hr />

      <section aria-labelledby="about">
        <h2 id="about">What we do</h2>
        <p>
          We build and operate useful internet businesses. No blitzscaling, no
          theatre—just patient work on software that earns its keep.
        </p>
      </section>

      <section aria-labelledby="portfolio">
        <h2 id="portfolio">Portfolio</h2>
        <ol className="portfolio">
          <li>
            <a href="https://popadex.com">PopaDex</a>
            <span>
              A private, read-only personal finance copilot for understanding
              your money.
            </span>
          </li>
        </ol>
      </section>

      <hr />

      <footer>
        <p>
          Modest Ambitions is a trading name of Administrative Burden Ltd,
          registered in the United Kingdom.
        </p>
        <p className="updated">Last updated: July 2026</p>
      </footer>
    </main>
  );
}
