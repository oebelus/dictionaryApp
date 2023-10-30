export function capitalize(str) {
    const sentences = str.trim().split('.');
    
    const capitalizedSentences = sentences.map((sentence) => {
      const trimmedSentence = sentence.trim();
      return (
        trimmedSentence.charAt(0).toUpperCase() +
        trimmedSentence.slice(1).toLowerCase()
      );
    });
  
    return capitalizedSentences.join('. ');
  }
  