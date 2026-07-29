export default function Home() {
  return (
    <main id="top">
      <h1>
        <a href="#top">Modest Ambitions</a> - A Software Startup Studio
      </h1>

      <nav className="text-nav" aria-label="Primary navigation">
        [ <a href="#about">What We Do?</a> ] [ <a href="#companies">Companies</a>{" "}
        ] [ <a href="https://popadex.com">PopaDex</a> ]
      </nav>

      <nav className="button-nav" aria-label="Shortcuts">
        <a className="yellow" href="#top">
          ▾ Top
        </a>
        <a className="lilac" href="#companies">
          ↗ Companies
        </a>
        <a className="pink" href="#about">
          ✦ About
        </a>
      </nav>

      <p id="about">
        Modest Ambitions builds and operates small, useful internet businesses.
      </p>

      <h2 id="companies">Companies</h2>
      <ul className="directory">
        <li>
          <a href="https://popadex.com">PopaDex</a>
          <em> (personal finance software)</em> <mark>NEW</mark>
        </li>
      </ul>

      <p className="count">
        <em>1 company in the portfolio</em> | <a href="#top">Top</a> |{" "}
        <a href="#about">About</a>
      </p>

      <hr />

      <footer>
        <em>Modest Ambitions is a trading name of Administrative Burden Ltd.</em>
        <br />
        Copyright © 2026 Administrative Burden Ltd
      </footer>
    </main>
  );
}
