import type { InterviewQuestion } from '../../content/interview';

interface Props {
  question: InterviewQuestion | null;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function InterviewDetailPane({ question, onNext, onPrev }: Props) {
  if (!question) {
    return (
      <section className="iv-detail iv-detail--empty" aria-label="Answer">
        <h2 className="iv-detail__h">Pick a question</h2>
        <p className="iv-detail__p">Select a question from the list to read its answer here.</p>
      </section>
    );
  }
  return (
    <section className="iv-detail" aria-labelledby="iv-answer-h">
      <p className="iv-card__meta">
        {question.category} · {question.title}
      </p>
      <h2 id="iv-answer-h" className="iv-detail__h">
        {question.question}
      </h2>
      <p className="iv-detail__p">{question.answer}</p>
      {question.context && (
        <pre className="iv-code">
          <code>{question.context}</code>
        </pre>
      )}
      <ul className="iv-tags" aria-label="Tags">
        {question.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="iv-nav">
        <button type="button" className="btn btn--secondary" onClick={onPrev} disabled={!onPrev}>
          Previous
        </button>
        <button type="button" className="btn btn--secondary" onClick={onNext} disabled={!onNext}>
          Next
        </button>
      </div>
    </section>
  );
}
