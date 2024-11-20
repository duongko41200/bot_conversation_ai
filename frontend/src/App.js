import React, { useState } from 'react';

function App() {
    const [recognizedText, setRecognizedText] = useState('');

    const handleStartRecognition = async () => {
        try {
            const result = await window.electron.startRecognition();
            setRecognizedText(result.text);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="App">
            <h1>Speech to Text</h1>
            <button onClick={handleStartRecognition}>Start Recognition</button>
            <p>{recognizedText}</p>
        </div>
    );
}

export default App;
