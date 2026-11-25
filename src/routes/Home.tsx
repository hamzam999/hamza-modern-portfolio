import { Link } from 'react-router-dom';

/** Temporary placeholder until the six levels land in Phase 2. */
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-heading text-4xl font-bold">Mohammad Hamza</h1>
      <p className="mt-4 text-primary/80">Senior Frontend Engineer. Portfolio revamp in progress.</p>
      <p className="mt-6">
        <Link className="text-blue underline" to="/interview-framework">
          Frontend interview framework
        </Link>
      </p>
    </main>
  );
}
