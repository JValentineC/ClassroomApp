interface QuestionIndicatorsProps {
  numQuestions: number;
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  completedQuestions: boolean[];
}

export default function QuestionIndicators({
  numQuestions,
  currentQuestion,
  setCurrentQuestion,
  completedQuestions,
}: QuestionIndicatorsProps) {
  const buttonsPerRow = 10;

  const questionGroups = Array.from({ length: Math.ceil(numQuestions / buttonsPerRow) }, (_, rowIndex) =>
    Array.from(
      { length: Math.min(buttonsPerRow, numQuestions - rowIndex * buttonsPerRow) },
      (_, i) => rowIndex * buttonsPerRow + i + 1,
    ),
  );

  return (
    <div className="flex flex-col w-full items-center gap-2 py-2">
      {questionGroups.map((group, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap justify-center gap-2">
          {group.map(index => (
            <a
              key={index}
              href={`#item${index}`}
              className={`btn btn-xs w-8 ${
                currentQuestion === index - 1
                  ? 'btn-base-content' // Current question
                  : completedQuestions[index - 1]
                    ? 'btn-warning' // Completed questions
                    : 'btn-neutral border-2 border-white' // Default state
              } ${currentQuestion === index - 1 ? '' : 'border-2 border-white'}`} // Remove outline for current question
              onClick={() => setCurrentQuestion(index - 1)}
            >
              {index}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
