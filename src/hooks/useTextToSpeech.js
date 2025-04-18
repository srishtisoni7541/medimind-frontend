const useTextToSpeech = () => {
    const speak = (text) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Text-to-speech is not supported in your browser.');
      }
    };
  
    return speak;
  };
  
  export default useTextToSpeech;