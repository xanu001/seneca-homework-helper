import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SenecaResults, SenecaQuestion, SenecaConcept, SenecaSection } from "@/utils/types";

interface ResultsDisplayProps {
  results: SenecaResults | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) return null;

  const renderToggleGroup = (questions: SenecaQuestion[]) => {
    if (questions.length === 0) return null;
    const groupQuestion = questions[0].question;

    return (
      <div className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium text-gray-800">{groupQuestion}</h3>
          <div className="ml-6 space-y-3">
            {questions.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="text-base text-gray-700">{item.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderConcept = (concept: SenecaConcept) => (
    <div className="my-8 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <h2 className="text-xl font-semibold text-primary mb-3">{concept.title}</h2>
      <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: concept.content }} />
    </div>
  );

  const renderQuestion = (item: SenecaQuestion, index: number) => {
    const renderQuestionContent = () => {
      switch (item.type) {
        case 'wordfill':
        case 'image-description':
          return (
            <div className="text-lg font-medium text-gray-800">
              {item.question.split('____').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="px-2 py-1 mx-1 bg-primary/10 rounded text-primary">
                      ______
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        default:
          return (
            <div className="text-lg font-medium text-gray-800">
              {item.question}
            </div>
          );
      }
    };

    return (
      <div className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start gap-4">
            <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full mt-1">
              Q{index + 1}
            </span>
            <div className="flex-1">
              {renderQuestionContent()}
            </div>
          </div>

          <div className="ml-12 mt-2">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="text-sm font-medium text-primary mb-2">Answer{item.type === 'wordfill' || item.type === 'image-description' ? 's' : ''}:</div>
              <div className="text-base text-gray-700 whitespace-pre-line">
                {item.type === 'wordfill' || item.type === 'image-description' 
                  ? item.answer.split(', ').map((ans, i) => (
                      <div key={i} className="mb-1">• {ans}</div>
                    ))
                  : item.answer}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (section: SenecaSection, sectionIndex: number) => {
    if ('type' in section && section.type === 'concept') {
      return renderConcept(section);
    }

    const questions = section as SenecaQuestion[];

    // Group toggle questions
    const toggleGroups: { [key: string]: SenecaQuestion[] } = {};
    const regularQuestions: SenecaQuestion[] = [];

    questions.forEach(question => {
      if (question.type === 'toggle' && question.toggleGroup) {
        if (!toggleGroups[question.toggleGroup]) {
          toggleGroups[question.toggleGroup] = [];
        }
        toggleGroups[question.toggleGroup].push(question);
      } else {
        regularQuestions.push(question);
      }
    });

    return (
      <div key={sectionIndex} className="space-y-8">
        {Object.values(toggleGroups).map((group, idx) => (
          <React.Fragment key={`toggle-group-${idx}`}>
            {renderToggleGroup(group)}
          </React.Fragment>
        ))}
        {regularQuestions.map((question, idx) => (
          <React.Fragment key={`question-${idx}`}>
            {renderQuestion(question, idx)}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-6">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">{results.title}</h1>
        <p className="text-gray-600 mt-2">Review your answers below</p>
      </div>

      <Card className="w-full">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-xl">Questions & Answers</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {results.sections.length > 0 ? (
            <div className="space-y-6">
              {results.sections.map((section, idx) => (
                <React.Fragment key={idx}>
                  {renderSection(section, idx)}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No questions found in the provided homework URL. Please try a different URL.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
