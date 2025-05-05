import { SenecaQuestion, SenecaResults, SenecaConcept, SenecaSection } from './types';

export const extractSenecaContent = async (userUrl: string): Promise<SenecaResults> => {
  try {
    console.log(`Attempting to extract content from: ${userUrl}`);
    
    // Extract the course ID and section ID from the Seneca URL
    const courseIdMatch = userUrl.match(/course\/([^\/]+)/);
    const sectionIdMatch = userUrl.match(/section\/([^\/]+)/);
    
    if (!courseIdMatch || !sectionIdMatch) {
      throw new Error("Invalid Seneca URL format. Could not extract course ID or section ID.");
    }
    
    const courseId = courseIdMatch[1];
    const sectionId = sectionIdMatch[1];
    
    console.log(`Extracted courseId: ${courseId}, sectionId: ${sectionId}`);
    
    // Construct the API URL to fetch the signed URL
    const apiUrl = `https://seneca.ellsies.tech/api/courses/${courseId}/signed-url?sectionId=${sectionId}`;
    
    // Fetch the signed URL from the API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Response:", data);
    
    if (!data.url) {
      throw new Error("API did not return a valid signed URL");
    }
    
    // Fetch the actual content from the signed URL
    const contentResponse = await fetch(data.url);
    
    if (!contentResponse.ok) {
      throw new Error(`Content fetch failed with status: ${contentResponse.status}`);
    }
    
    const contentData = await contentResponse.json();
    console.log("Content data:", contentData);
    
    // Process the response data into our SenecaResults format
    return processApiResponse(contentData);
  } catch (error) {
    console.error("Error extracting Seneca content:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to extract content from the provided URL");
  }
};

// Process the API response data into our SenecaResults format
const processApiResponse = (data: any): SenecaResults => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid API response format');
    }

    // Extract the title from the data
    let title = data.title || "Seneca Homework";
    let currentQuestions: SenecaQuestion[] = [];
    const sections: SenecaSection[] = [];
    
    if (!data.contents || !Array.isArray(data.contents)) {
      console.warn('No content modules found in the response');
      return { title, sections: [] };
    }

    data.contents.forEach((contentItem: any) => {
      if (!contentItem.contentModules || !Array.isArray(contentItem.contentModules)) {
        return;
      }

      let currentToggleGroup: {
        question: string;
        answers: SenecaQuestion[];
      } | null = null;

      contentItem.contentModules.forEach((module: any, moduleIndex: number) => {
        if (!module || !module.content) return;

        try {
          // Handle concept modules
          if (module.moduleType === "concept") {
            // If we have pending questions or toggle group, add them as a section
            if (currentToggleGroup) {
              currentQuestions.push(...currentToggleGroup.answers);
              currentToggleGroup = null;
            }
            if (currentQuestions.length > 0) {
              sections.push([...currentQuestions]);
              currentQuestions = [];
            }
            
            // Add the concept as its own section
            sections.push({
              type: 'concept',
              title: module.content.title || "Concept",
              content: module.content.text || module.content.html || ""
            });
            return;
          }

          switch (module.moduleType) {
            case "multiple-choice":
              if (module.content.question && module.content.correctAnswer) {
                if (currentToggleGroup) {
                  currentQuestions.push(...currentToggleGroup.answers);
                  currentToggleGroup = null;
                }
                currentQuestions.push({
                  type: 'multiple-choice',
                  question: module.content.question.trim(),
                  answer: module.content.correctAnswer.trim()
                });
              }
              break;

            case "toggles":
              if (module.content.statement && Array.isArray(module.content.toggles)) {
                // Start a new toggle group if we don't have one
                if (!currentToggleGroup) {
                  currentToggleGroup = {
                    question: module.content.statement.trim(),
                    answers: []
                  };
                }

                module.content.toggles.forEach((toggle: any) => {
                  if (toggle.correctToggle) {
                    currentToggleGroup!.answers.push({
                      type: 'toggle',
                      question: currentToggleGroup!.question,
                      answer: toggle.correctToggle.trim(),
                      toggleGroup: `toggle-group-${moduleIndex}`
                    });
                  }
                });
              }
              break;

            case "list":
              if (module.content.title && Array.isArray(module.content.items)) {
                if (currentToggleGroup) {
                  currentQuestions.push(...currentToggleGroup.answers);
                  currentToggleGroup = null;
                }
                module.content.items.forEach((item: any) => {
                  if (item) {
                    currentQuestions.push({
                      type: 'list',
                      question: module.content.title.trim(),
                      answer: (typeof item === 'string' ? item : JSON.stringify(item)).trim()
                    });
                  }
                });
              }
              break;

            case "grid":
              if (Array.isArray(module.content.definitions)) {
                if (currentToggleGroup) {
                  currentQuestions.push(...currentToggleGroup.answers);
                  currentToggleGroup = null;
                }
                module.content.definitions.forEach((def: any) => {
                  if (!def) return;
                  
                  const wordContent = typeof def.word === 'string'
                    ? def.word
                    : Array.isArray(def.word)
                      ? def.word.map((w: any) => typeof w === 'string' ? w : w.word).join('')
                      : typeof def.word === 'object' && def.word?.word
                        ? def.word.word
                        : '';

                  if (wordContent && def.text) {
                    currentQuestions.push({
                      type: 'grid',
                      question: wordContent.trim(),
                      answer: def.text.trim()
                    });
                  }
                });
              }
              break;

            case "wordfill":
              if (module.content.words) {
                if (currentToggleGroup) {
                  currentQuestions.push(...currentToggleGroup.answers);
                  currentToggleGroup = null;
                }

                // Reconstruct the full sentence and answer
                const fullSentence = module.content.words.map(word => {
                  if (typeof word === 'string') return word;
                  return word.otherPermittedWords?.[0] || word.word || '';
                }).join('');

                const answers = module.content.words
                  .filter((word): word is { word: string; otherPermittedWords?: string[] } => 
                    typeof word !== 'string' && !!word.word
                  )
                  .map(word => word.word)
                  .join(', ');

                if (answers) {
                  currentQuestions.push({
                    type: 'wordfill',
                    question: fullSentence,
                    answer: answers
                  });
                }
              }
              break;

            case "image-description":
              if (module.content.words) {
                if (currentToggleGroup) {
                  currentQuestions.push(...currentToggleGroup.answers);
                  currentToggleGroup = null;
                }

                // Reconstruct the full sentence and answer
                const fullSentence = module.content.words.map(word => {
                  if (typeof word === 'string') return word;
                  return '____';
                }).join('');

                const answers = module.content.words
                  .filter((word): word is { word: string; otherPermittedWords?: string[] } => 
                    typeof word !== 'string' && !!word.word
                  )
                  .map(word => word.word)
                  .join(', ');

                if (answers) {
                  currentQuestions.push({
                    type: 'image-description',
                    question: fullSentence,
                    answer: answers
                  });
                }
              }
              break;
          }
        } catch (moduleError) {
          console.warn('Error processing module:', moduleError);
        }
      });

      // Add any remaining toggle group
      if (currentToggleGroup) {
        currentQuestions.push(...currentToggleGroup.answers);
      }
    });

    // Add the final section if it has questions
    if (currentQuestions.length > 0) {
      sections.push([...currentQuestions]);
    }

    return { title, sections };
  } catch (error) {
    console.error("Error processing API response:", error);
    throw new Error('Failed to process the homework content');
  }
}; 