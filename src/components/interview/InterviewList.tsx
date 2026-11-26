import { Fragment } from 'react';
import InterviewCard from './InterviewCard';
import InterviewDetailPane from './InterviewDetailPane';
import type { InterviewQuestion } from '../../content/interview';

interface Props {
  questions: InterviewQuestion[];
  activeQuestionId: number | string | null;
  onSelectQuestion: (id: number | string) => void;
  onClearFilters: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function InterviewList({ questions, activeQuestionId, onSelectQuestion, onClearFilters, onNext, onPrev }: Props) {
  if (questions.length === 0) {
    return (
      <div className="iv-empty">
        <p>No questions match. Try another keyword or category.</p>
        <button type="button" className="btn btn--secondary" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    );
  }
  return (
    <ul className="iv-list">
      {questions.map((q, idx) => (
        <Fragment key={q.id}>
          <li>
            <InterviewCard question={q} isActive={activeQuestionId === q.id} index={idx} onClick={() => onSelectQuestion(q.id)} />
          </li>
          {activeQuestionId === q.id && (
            <li className="iv-inline">
              <InterviewDetailPane question={q} onNext={onNext} onPrev={onPrev} />
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
}
