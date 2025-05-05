
/**
 * Utility functions for extracting content from Seneca Learning pages
 */

export interface SenecaQuestion {
  question: string;
  answer: string;
}

export interface SenecaResults {
  title: string;
  questions: SenecaQuestion[];
}

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
    // Default title
    let title = "Seneca Homework";
    
    // Try to extract a meaningful title
    if (data.meta && data.meta.title) {
      title = data.meta.title;
    } else if (data.course && data.course.title) {
      title = data.course.title;
    }
    
    // Extract questions and answers
    const questions: SenecaQuestion[] = [];
    
    // Handle different possible data structures
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any, index: number) => {
        if (item.question && item.correctAnswer) {
          questions.push({
            question: item.question,
            answer: item.correctAnswer
          });
        }
      });
    } else if (data.sections && Array.isArray(data.sections)) {
      data.sections.forEach((section: any) => {
        if (section.content && Array.isArray(section.content)) {
          section.content.forEach((content: any) => {
            if (content.question && content.answer) {
              questions.push({
                question: content.question,
                answer: content.answer
              });
            }
          });
        }
      });
    }
    
    // If no questions were found, try a different approach
    if (questions.length === 0 && data.content) {
      // Loop through all keys in data.content that might contain question data
      Object.keys(data.content).forEach(key => {
        const item = data.content[key];
        if (item.question && (item.answer || item.correctAnswer)) {
          questions.push({
            question: item.question,
            answer: item.answer || item.correctAnswer
          });
        }
      });
    }
    
    return {
      title,
      questions
    };
  } catch (error) {
    console.error("Error processing API response:", error);
    return {
      title: "Seneca Homework",
      questions: [
        {
          question: "Error processing data",
          answer: "Could not extract questions and answers from the API response."
        }
      ]
    };
  }
};

// Kept for backwards compatibility or testing purposes
const fetchSenecaContent = async (url: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return fake HTML content for demo purposes
  return `
    <html>
      <head><title>Biology Unit 2: Cells - Seneca Learning</title></head>
      <body>
        <div class="homework-title">Biology Unit 2: Cells</div>
        <div class="question-container">
          <div class="question">What is the basic unit of all living organisms?</div>
          <div class="answer">Cell</div>
        </div>
        <div class="question-container">
          <div class="question">What are the two main types of cells?</div>
          <div class="answer">Prokaryotic and Eukaryotic</div>
        </div>
        <div class="question-container">
          <div class="question">Which organelle is responsible for energy production in the cell?</div>
          <div class="answer">Mitochondria</div>
        </div>
        <div class="question-container">
          <div class="question">What is the function of the cell membrane?</div>
          <div class="answer">To control what enters and leaves the cell</div>
        </div>
      </body>
    </html>
  `;
};

// Kept for backwards compatibility or testing purposes
const parseSenecaHTML = (html: string): SenecaResults => {
  console.log("Parsing Seneca HTML content...");
  
  // In a real implementation, we would use a proper HTML parser
  // For now, we'll create a mock result based on our simulated HTML
  
  // Extract title (simplified)
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "Seneca Homework";
  
  // Extract questions and answers (simplified)
  const questionsData: SenecaQuestion[] = [];
  
  // Very simplified extraction logic - in a real implementation we'd use DOM parsing
  const questionRegex = /<div class="question">(.*?)<\/div>\s*<div class="answer">(.*?)<\/div>/gs;
  let match;
  
  while ((match = questionRegex.exec(html)) !== null) {
    questionsData.push({
      question: match[1].trim(),
      answer: match[2].trim()
    });
  }
  
  return {
    title,
    questions: questionsData
  };
};
