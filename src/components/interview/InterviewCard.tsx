import type { InterviewQuestion } from '../../content/interview';

interface Props {
  question: InterviewQuestion;
  isActive: boolean;
  index: number;
  onClick: () => void;
}

export default function InterviewCard({ question, isActive, index, onClick }: Props) {
  return (
    <button type="button" className="iv-card" aria-pressed={isActive} onClick={onClick}>
      <span className="iv-card__n tabular" aria-hidden="true">
        {index + 1}
      </span>
      <span className="iv-card__body">
        <span className="iv-card__meta">
          {question.category} · {question.title}
        </span>
        <span className="iv-card__q">{question.question}</span>
      </span>
    </button>
  );
}
